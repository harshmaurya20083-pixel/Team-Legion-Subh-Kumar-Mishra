CREATE FUNCTION public.update_event_registration(record_id uuid, registration_url text, registration_deadline text DEFAULT NULL) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ DECLARE item public.event_records; url text; BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Administrator access required'; END IF;
  SELECT * INTO item FROM public.event_records WHERE id=record_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Event not found'; END IF;
  IF item.status<>'published' THEN RAISE EXCEPTION 'Only published events can be updated'; END IF;
  IF registration_url IS NOT NULL AND length(btrim(registration_url))>0 THEN
    item.event:=jsonb_set(item.event,'{registrationUrl}',to_jsonb(btrim(registration_url)));
    item.event:=jsonb_set(item.event,'{isSample}','false'::jsonb);
  END IF;
  IF registration_deadline IS NOT NULL AND length(btrim(registration_deadline))>0 THEN
    IF btrim(registration_deadline) !~ '^\d{4}-\d{2}-\d{2}$' OR to_char(btrim(registration_deadline)::date,'YYYY-MM-DD')<>btrim(registration_deadline) THEN RAISE EXCEPTION 'Invalid deadline'; END IF;
    item.event:=jsonb_set(item.event,'{registrationDeadline}',to_jsonb(btrim(registration_deadline)));
  END IF;
  UPDATE public.event_records SET event=item.event, updated_at=now() WHERE id=record_id;
  DELETE FROM public.published_event_urls WHERE event_id=record_id;
  FOR url IN SELECT DISTINCT public.normalize_event_url(v) FROM unnest(ARRAY[item.event->>'sourceUrl',item.event->>'registrationUrl']) v WHERE length(public.normalize_event_url(v))>0 LOOP
    INSERT INTO public.published_event_urls(url,event_id) VALUES(url,record_id);
  END LOOP;
END; $$;
REVOKE ALL ON FUNCTION public.update_event_registration(uuid,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_event_registration(uuid,text,text) TO authenticated;