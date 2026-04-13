-- Add current_video_index column to video_ratings table
ALTER TABLE video_ratings 
ADD COLUMN IF NOT EXISTS current_video_index integer DEFAULT 0;
