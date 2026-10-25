CREATE TABLE public.community_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  platform text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  tags jsonb NOT NULL DEFAULT '[]'::jsonb,
  audience text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  url text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'published',
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.community_records TO anon;
GRANT SELECT ON public.community_records TO authenticated;
GRANT ALL ON public.community_records TO service_role;

ALTER TABLE public.community_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "published_communities" ON public.community_records
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "admin_communities" ON public.community_records
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE OR REPLACE FUNCTION public.validate_community_record()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF char_length(trim(NEW.name)) < 2 OR char_length(NEW.name) > 120 THEN
    RAISE EXCEPTION 'Community name must be 2-120 characters';
  END IF;
  IF NEW.platform NOT IN ('WhatsApp', 'Discord', 'Telegram', 'Reddit') THEN
    RAISE EXCEPTION 'Unknown platform';
  END IF;
  IF NEW.category NOT IN ('Technology', 'Education', 'Careers', 'Business', 'Local', 'Culture', 'General News') THEN
    RAISE EXCEPTION 'Unknown category';
  END IF;
  IF char_length(trim(NEW.description)) < 10 OR char_length(NEW.description) > 2000 THEN
    RAISE EXCEPTION 'Description must be 10-2000 characters';
  END IF;
  IF jsonb_typeof(NEW.tags) <> 'array' OR jsonb_array_length(NEW.tags) > 12 THEN
    RAISE EXCEPTION 'Tags must be a list of at most 12';
  END IF;
  IF char_length(NEW.url) > 500 THEN
    RAISE EXCEPTION 'URL too long';
  END IF;
  IF NEW.url <> '' AND NEW.url !~ '^https://(chat\.whatsapp\.com/|wa\.me/|discord\.gg/|discord\.com/invite/|t\.me/|reddit\.com/r/)' THEN
    RAISE EXCEPTION 'Join URL must be an official WhatsApp, Discord, Telegram or Reddit link';
  END IF;
  IF NEW.status NOT IN ('published', 'archived') THEN
    RAISE EXCEPTION 'Unknown status';
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_community_record
  BEFORE INSERT OR UPDATE ON public.community_records
  FOR EACH ROW EXECUTE FUNCTION public.validate_community_record();