-- Enable RLS on all tables with existing policies
-- This fixes Supabase security linter errors
-- Migration created: 2024-12-10

-- Enable RLS on user-scoped tables
ALTER TABLE public.autopilot_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draft_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insight_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reference_card_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reference_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.source_feeds ENABLE ROW LEVEL SECURITY;