CREATE POLICY "Users upload own recordings" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'recordings' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users read own recordings" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'recordings' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.is_reviewer(auth.uid())));
CREATE POLICY "Users update own recordings" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'recordings' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users delete own recordings" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'recordings' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.has_role(auth.uid(),'admin')));

CREATE POLICY "Avatars readable by signed-in users" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'avatars');
CREATE POLICY "Users insert own avatar" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users update own avatar" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);