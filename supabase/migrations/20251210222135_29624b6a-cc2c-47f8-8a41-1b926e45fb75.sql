-- Drop the content_type check constraint that's blocking custom content types
ALTER TABLE public.drafts DROP CONSTRAINT IF EXISTS drafts_content_type_check;