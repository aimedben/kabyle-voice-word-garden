-- ENUMS
CREATE TYPE public.app_role AS ENUM ('admin','validator','contributor');
CREATE TYPE public.gender_type AS ENUM ('male','female','other','prefer_not_to_say');
CREATE TYPE public.age_group AS ENUM ('under_18','18_29','30_44','45_59','60_plus');
CREATE TYPE public.recording_type AS ENUM ('reading','conversation','story','interview','podcast');
CREATE TYPE public.emotion_type AS ENUM ('happy','sad','neutral','angry');
CREATE TYPE public.noise_level AS ENUM ('silent','street','home','car','office');
CREATE TYPE public.validation_status AS ENUM ('pending','validated','rejected');

-- UPDATED AT HELPER
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  country TEXT,
  native_speaker BOOLEAN NOT NULL DEFAULT true,
  gender public.gender_type,
  age_group public.age_group,
  region_id UUID,
  dialect_id UUID,
  points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ROLES
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_reviewer(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','validator'));
$$;

CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- NEW USER TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email,'@',1)),
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email,'@',1) || '_' || substr(NEW.id::text,1,6))
  )
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id,'contributor') ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- REGIONS
CREATE TABLE public.regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT UNIQUE,
  country TEXT NOT NULL DEFAULT 'Algeria',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.regions TO anon, authenticated;
GRANT ALL ON public.regions TO service_role;
ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Regions readable by all" ON public.regions FOR SELECT USING (true);
CREATE POLICY "Admins manage regions" ON public.regions FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- DIALECTS
CREATE TABLE public.dialects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT UNIQUE,
  description TEXT,
  region_id UUID REFERENCES public.regions(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.dialects TO anon, authenticated;
GRANT ALL ON public.dialects TO service_role;
ALTER TABLE public.dialects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Dialects readable by all" ON public.dialects FOR SELECT USING (true);
CREATE POLICY "Admins manage dialects" ON public.dialects FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

ALTER TABLE public.profiles ADD CONSTRAINT profiles_region_fk FOREIGN KEY (region_id) REFERENCES public.regions(id) ON DELETE SET NULL;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_dialect_fk FOREIGN KEY (dialect_id) REFERENCES public.dialects(id) ON DELETE SET NULL;

-- SENTENCES
CREATE TABLE public.sentences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'kab',
  category TEXT,
  difficulty SMALLINT NOT NULL DEFAULT 1,
  source TEXT,
  dialect_id UUID REFERENCES public.dialects(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  recorded_count INTEGER NOT NULL DEFAULT 0,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.sentences TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.sentences TO authenticated;
GRANT ALL ON public.sentences TO service_role;
ALTER TABLE public.sentences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active sentences readable by all" ON public.sentences FOR SELECT USING (is_active OR public.is_reviewer(auth.uid()));
CREATE POLICY "Admins manage sentences" ON public.sentences FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER sentences_updated_at BEFORE UPDATE ON public.sentences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RECORDINGS
CREATE TABLE public.recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  speaker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sentence_id UUID REFERENCES public.sentences(id) ON DELETE SET NULL,
  storage_path TEXT NOT NULL,
  duration_seconds NUMERIC(10,3) NOT NULL DEFAULT 0,
  file_size_bytes BIGINT NOT NULL DEFAULT 0,
  sample_rate INTEGER,
  audio_format TEXT,
  language TEXT NOT NULL DEFAULT 'kab',
  dialect_id UUID REFERENCES public.dialects(id) ON DELETE SET NULL,
  region_id UUID REFERENCES public.regions(id) ON DELETE SET NULL,
  gender public.gender_type,
  age_group public.age_group,
  recording_type public.recording_type NOT NULL DEFAULT 'reading',
  emotion public.emotion_type NOT NULL DEFAULT 'neutral',
  noise_level public.noise_level NOT NULL DEFAULT 'silent',
  quality_score NUMERIC(4,2),
  validation_status public.validation_status NOT NULL DEFAULT 'pending',
  admin_comment TEXT,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX recordings_speaker_idx ON public.recordings(speaker_id);
CREATE INDEX recordings_status_idx ON public.recordings(validation_status);
CREATE INDEX recordings_created_idx ON public.recordings(created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.recordings TO authenticated;
GRANT ALL ON public.recordings TO service_role;
ALTER TABLE public.recordings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own or reviewable recordings" ON public.recordings FOR SELECT TO authenticated
  USING (speaker_id = auth.uid() OR public.is_reviewer(auth.uid()) OR validation_status = 'validated');
CREATE POLICY "Contributors insert own recordings" ON public.recordings FOR INSERT TO authenticated WITH CHECK (speaker_id = auth.uid());
CREATE POLICY "Owners update pending recordings" ON public.recordings FOR UPDATE TO authenticated
  USING (speaker_id = auth.uid() AND validation_status = 'pending') WITH CHECK (speaker_id = auth.uid());
CREATE POLICY "Reviewers update recordings" ON public.recordings FOR UPDATE TO authenticated
  USING (public.is_reviewer(auth.uid())) WITH CHECK (public.is_reviewer(auth.uid()));
CREATE POLICY "Owners or admins delete recordings" ON public.recordings FOR DELETE TO authenticated
  USING (speaker_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE TRIGGER recordings_updated_at BEFORE UPDATE ON public.recordings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- TRANSCRIPTIONS
CREATE TABLE public.transcriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recording_id UUID NOT NULL UNIQUE REFERENCES public.recordings(id) ON DELETE CASCADE,
  auto_text TEXT,
  corrected_text TEXT,
  confidence NUMERIC(5,4),
  model TEXT,
  corrected_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  corrected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transcriptions TO authenticated;
GRANT ALL ON public.transcriptions TO service_role;
ALTER TABLE public.transcriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read transcriptions of accessible recordings" ON public.transcriptions FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.recordings r WHERE r.id = recording_id AND (r.speaker_id = auth.uid() OR public.is_reviewer(auth.uid()) OR r.validation_status = 'validated')));
CREATE POLICY "Owner or reviewer writes transcription" ON public.transcriptions FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.recordings r WHERE r.id = recording_id AND (r.speaker_id = auth.uid() OR public.is_reviewer(auth.uid()))));
CREATE POLICY "Owner or reviewer updates transcription" ON public.transcriptions FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.recordings r WHERE r.id = recording_id AND (r.speaker_id = auth.uid() OR public.is_reviewer(auth.uid()))))
  WITH CHECK (EXISTS (SELECT 1 FROM public.recordings r WHERE r.id = recording_id AND (r.speaker_id = auth.uid() OR public.is_reviewer(auth.uid()))));
CREATE TRIGGER transcriptions_updated_at BEFORE UPDATE ON public.transcriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- VALIDATIONS
CREATE TABLE public.validations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recording_id UUID NOT NULL REFERENCES public.recordings(id) ON DELETE CASCADE,
  validator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status public.validation_status NOT NULL,
  quality_score NUMERIC(4,2),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.validations TO authenticated;
GRANT ALL ON public.validations TO service_role;
ALTER TABLE public.validations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read validations for own or reviewable recordings" ON public.validations FOR SELECT TO authenticated
  USING (public.is_reviewer(auth.uid()) OR EXISTS (SELECT 1 FROM public.recordings r WHERE r.id = recording_id AND r.speaker_id = auth.uid()));
CREATE POLICY "Reviewers create validations" ON public.validations FOR INSERT TO authenticated
  WITH CHECK (public.is_reviewer(auth.uid()) AND validator_id = auth.uid());

-- BADGES
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  threshold INTEGER NOT NULL DEFAULT 0,
  metric TEXT NOT NULL DEFAULT 'recordings',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.badges TO anon, authenticated;
GRANT ALL ON public.badges TO service_role;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Badges readable by all" ON public.badges FOR SELECT USING (true);
CREATE POLICY "Admins manage badges" ON public.badges FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, badge_id)
);
GRANT SELECT, INSERT ON public.user_badges TO authenticated;
GRANT SELECT ON public.user_badges TO anon;
GRANT ALL ON public.user_badges TO service_role;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User badges readable by all" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "Users earn own badges" ON public.user_badges FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- PUBLIC PLATFORM STATS (aggregated, no PII)
CREATE OR REPLACE FUNCTION public.platform_stats()
RETURNS TABLE (
  total_recordings BIGINT,
  total_hours NUMERIC,
  validated_recordings BIGINT,
  pending_recordings BIGINT,
  rejected_recordings BIGINT,
  contributors BIGINT,
  avg_quality NUMERIC,
  total_sentences BIGINT
) LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT
    (SELECT count(*) FROM public.recordings),
    (SELECT COALESCE(round(sum(duration_seconds)/3600.0,2),0) FROM public.recordings),
    (SELECT count(*) FROM public.recordings WHERE validation_status='validated'),
    (SELECT count(*) FROM public.recordings WHERE validation_status='pending'),
    (SELECT count(*) FROM public.recordings WHERE validation_status='rejected'),
    (SELECT count(DISTINCT speaker_id) FROM public.recordings),
    (SELECT COALESCE(round(avg(quality_score),2),0) FROM public.recordings WHERE quality_score IS NOT NULL),
    (SELECT count(*) FROM public.sentences WHERE is_active);
$$;
GRANT EXECUTE ON FUNCTION public.platform_stats() TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.leaderboard(_limit INTEGER DEFAULT 10)
RETURNS TABLE (user_id UUID, display_name TEXT, username TEXT, avatar_url TEXT, recordings BIGINT, seconds NUMERIC, points INTEGER)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT p.id, p.display_name, p.username, p.avatar_url,
         COALESCE(count(r.id),0), COALESCE(sum(r.duration_seconds),0), p.points
  FROM public.profiles p
  LEFT JOIN public.recordings r ON r.speaker_id = p.id
  GROUP BY p.id
  ORDER BY count(r.id) DESC, p.points DESC
  LIMIT COALESCE(_limit,10);
$$;
GRANT EXECUTE ON FUNCTION public.leaderboard(INTEGER) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.daily_growth(_days INTEGER DEFAULT 30)
RETURNS TABLE (day DATE, recordings BIGINT, seconds NUMERIC)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT d::date, COALESCE(count(r.id),0), COALESCE(sum(r.duration_seconds),0)
  FROM generate_series(current_date - (COALESCE(_days,30) - 1), current_date, interval '1 day') d
  LEFT JOIN public.recordings r ON r.created_at::date = d::date
  GROUP BY d ORDER BY d;
$$;
GRANT EXECUTE ON FUNCTION public.daily_growth(INTEGER) TO anon, authenticated;