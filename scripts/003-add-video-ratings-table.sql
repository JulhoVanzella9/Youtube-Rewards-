-- Create table to track video ratings per user
CREATE TABLE IF NOT EXISTS public.video_ratings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  last_rating_date timestamp with time zone DEFAULT now(),
  total_earned numeric(10,2) DEFAULT 0,
  ratings_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.video_ratings ENABLE ROW LEVEL SECURITY;

-- Create policies for video_ratings
CREATE POLICY "Users can view own video ratings" ON public.video_ratings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own video ratings" ON public.video_ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own video ratings" ON public.video_ratings
  FOR UPDATE USING (auth.uid() = user_id);
