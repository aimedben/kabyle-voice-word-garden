CREATE TABLE public.reading_prompts (
  id text PRIMARY KEY,
  kind text NOT NULL CHECK (kind IN ('word', 'phrase')),
  text text NOT NULL,
  translation text NOT NULL,
  source text NOT NULL,
  source_name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  position integer NOT NULL DEFAULT 0
);
GRANT SELECT ON public.reading_prompts TO anon, authenticated;
GRANT ALL ON public.reading_prompts TO service_role;
ALTER TABLE public.reading_prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads active reading prompts" ON public.reading_prompts FOR SELECT TO anon, authenticated USING (is_active);
INSERT INTO public.reading_prompts (id, kind, text, translation, source, source_name, position) VALUES
('p1','phrase','Amek i telliḍ ?','Comment vas-tu ?','https://omniglot.com/language/phrases/kabyle.htm','Omniglot · Kabyle',1),
('p2','phrase','Aqliyi bxir','Je vais bien.','https://omniglot.com/language/phrases/kabyle.htm','Omniglot · Kabyle',2),
('p3','phrase','Isem-ik ?','Comment t’appelles-tu ? (à un homme)','https://omniglot.com/language/phrases/kabyle.htm','Omniglot · Kabyle',3),
('p4','phrase','Isem-im ?','Comment t’appelles-tu ? (à une femme)','https://omniglot.com/language/phrases/kabyle.htm','Omniglot · Kabyle',4),
('p5','phrase','Ar azekka','À demain.','http://tadjenanet.free.fr/kabylie/dictionnaire.htm','Dictionnaire kabyle',5),
('w1','word','azul','bonjour','https://lmed.ovh/','Lmed · Apprendre le kabyle',6),
('w2','word','tanemmirt','merci','https://lmed.ovh/','Lmed · Apprendre le kabyle',7),
('w3','word','ih','oui','https://omniglot.com/language/phrases/kabyle.htm','Omniglot · Kabyle',8),
('w4','word','xaṭi','non','https://omniglot.com/language/phrases/kabyle.htm','Omniglot · Kabyle',9),
('w5','word','amek','comment','https://omniglot.com/language/phrases/kabyle.htm','Omniglot · Kabyle',10),
('w6','word','tayri','amour','http://tadjenanet.free.fr/kabylie/dictionnaire.htm','Dictionnaire kabyle',11),
('w7','word','izimer','agneau','http://tadjenanet.free.fr/kabylie/dictionnaire.htm','Dictionnaire kabyle',12),
('w8','word','tizizwit','abeille','http://tadjenanet.free.fr/kabylie/dictionnaire.htm','Dictionnaire kabyle',13),
('w9','word','ddu','aller','http://tadjenanet.free.fr/kabylie/dictionnaire.htm','Dictionnaire kabyle',14);