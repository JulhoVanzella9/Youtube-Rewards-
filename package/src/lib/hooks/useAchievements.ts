"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xp: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  category: string;
  maxProgress?: number;
}

export interface UserAchievement {
  achievement_id: string;
  progress: number;
  unlocked: boolean;
  unlocked_at: string | null;
}

// Lista de conquistas disponíveis
export const achievements: Achievement[] = [
  { id: "first-lesson", title: "First Step", description: "Complete your first lesson", icon: "🎯", xp: 50, rarity: "common", category: "Learning" },
  { id: "first-course", title: "Dedicated Student", description: "Complete your first course", icon: "📚", xp: 200, rarity: "common", category: "Learning" },
  { id: "five-courses", title: "Course Master", description: "Complete 5 courses", icon: "🏆", xp: 500, rarity: "rare", category: "Learning", maxProgress: 5 },
  { id: "ten-courses", title: "TikCash Expert", description: "Complete 10 courses", icon: "👑", xp: 1000, rarity: "epic", category: "Learning", maxProgress: 10 },
  { id: "streak-3", title: "Consistency", description: "Maintain a 3-day streak", icon: "🔥", xp: 100, rarity: "common", category: "Dedication", maxProgress: 3 },
  { id: "streak-7", title: "Perfect Week", description: "Maintain a 7-day streak", icon: "⚡", xp: 300, rarity: "rare", category: "Dedication", maxProgress: 7 },
  { id: "streak-30", title: "On Fire", description: "Maintain a 30-day streak", icon: "💎", xp: 1000, rarity: "epic", category: "Dedication", maxProgress: 30 },
  { id: "watch-1h", title: "Viewer", description: "Watch 1 hour of content", icon: "👀", xp: 50, rarity: "common", category: "Time" },
  { id: "watch-10h", title: "Binge Watcher", description: "Watch 10 hours of content", icon: "🎬", xp: 300, rarity: "rare", category: "Time" },
  { id: "watch-50h", title: "Learning Addict", description: "Watch 50 hours of content", icon: "🌟", xp: 800, rarity: "epic", category: "Time" },
  { id: "xp-1000", title: "XP Collector", description: "Accumulate 1000 XP", icon: "✨", xp: 100, rarity: "common", category: "Progress", maxProgress: 1000 },
  { id: "xp-5000", title: "XP Master", description: "Accumulate 5000 XP", icon: "💫", xp: 500, rarity: "rare", category: "Progress", maxProgress: 5000 },
  { id: "all-categories", title: "Explorer", description: "Complete a course in every category", icon: "🗺️", xp: 750, rarity: "epic", category: "Exploration" },
  { id: "perfect-quiz", title: "Genius", description: "Score 100% on a quiz", icon: "🧠", xp: 200, rarity: "rare", category: "Quiz" },
  { id: "early-bird", title: "Early Bird", description: "Study before 7am", icon: "🌅", xp: 100, rarity: "common", category: "Special" },
  { id: "night-owl", title: "Night Owl", description: "Study after 11pm", icon: "🦉", xp: 100, rarity: "common", category: "Special" },
];

export function useAchievements() {
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch user achievements
  const fetchAchievements = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setLoading(false);
      return;
    }

    setUserId(user.id);

    const { data, error } = await supabase
      .from("user_achievements")
      .select("achievement_id, progress, unlocked, unlocked_at")
      .eq("user_id", user.id);

    if (data) {
      setUserAchievements(data);
    }
    setLoading(false);
  }, []);

  // Get achievement progress
  const getAchievementProgress = useCallback((achievementId: string): UserAchievement | undefined => {
    return userAchievements.find((a) => a.achievement_id === achievementId);
  }, [userAchievements]);

  // Update achievement progress
  const updateProgress = useCallback(async (achievementId: string, progress: number) => {
    if (!userId) return false;

    const supabase = createClient();
    const achievement = achievements.find((a) => a.id === achievementId);
    if (!achievement) return false;

    const maxProgress = achievement.maxProgress || 1;
    const newProgress = Math.min(progress, maxProgress);
    const shouldUnlock = newProgress >= maxProgress;

    const { error } = await supabase
      .from("user_achievements")
      .upsert({
        user_id: userId,
        achievement_id: achievementId,
        progress: newProgress,
        unlocked: shouldUnlock,
        unlocked_at: shouldUnlock ? new Date().toISOString() : null,
      }, { onConflict: "user_id,achievement_id" });

    if (!error) {
      setUserAchievements((prev) => {
        const existing = prev.find((a) => a.achievement_id === achievementId);
        if (existing) {
          return prev.map((a) =>
            a.achievement_id === achievementId
              ? { ...a, progress: newProgress, unlocked: shouldUnlock, unlocked_at: shouldUnlock ? new Date().toISOString() : null }
              : a
          );
        }
        return [...prev, { achievement_id: achievementId, progress: newProgress, unlocked: shouldUnlock, unlocked_at: shouldUnlock ? new Date().toISOString() : null }];
      });

      // Update profile achievements count if unlocked
      if (shouldUnlock) {
        await supabase.rpc("increment_achievements_count", { user_id_param: userId });
      }
    }
    return !error;
  }, [userId]);

  // Unlock achievement immediately
  const unlockAchievement = useCallback(async (achievementId: string) => {
    if (!userId) return false;

    const supabase = createClient();
    const achievement = achievements.find((a) => a.id === achievementId);
    if (!achievement) return false;

    const { error } = await supabase
      .from("user_achievements")
      .upsert({
        user_id: userId,
        achievement_id: achievementId,
        progress: achievement.maxProgress || 1,
        unlocked: true,
        unlocked_at: new Date().toISOString(),
      }, { onConflict: "user_id,achievement_id" });

    if (!error) {
      setUserAchievements((prev) => {
        const existing = prev.find((a) => a.achievement_id === achievementId);
        if (existing) {
          return prev.map((a) =>
            a.achievement_id === achievementId
              ? { ...a, progress: achievement.maxProgress || 1, unlocked: true, unlocked_at: new Date().toISOString() }
              : a
          );
        }
        return [...prev, { achievement_id: achievementId, progress: achievement.maxProgress || 1, unlocked: true, unlocked_at: new Date().toISOString() }];
      });

      // Add XP to profile
      await supabase.rpc("add_xp", { user_id_param: userId, xp_amount: achievement.xp });
    }
    return !error;
  }, [userId]);

  // Check if achievement is unlocked
  const isUnlocked = useCallback((achievementId: string): boolean => {
    const userAchievement = userAchievements.find((a) => a.achievement_id === achievementId);
    return userAchievement?.unlocked || false;
  }, [userAchievements]);

  // Get all achievements with user progress
  const getAchievementsWithProgress = useCallback(() => {
    return achievements.map((achievement) => {
      const userProgress = userAchievements.find((a) => a.achievement_id === achievement.id);
      return {
        ...achievement,
        progress: userProgress?.progress || 0,
        unlocked: userProgress?.unlocked || false,
        unlocked_at: userProgress?.unlocked_at || null,
      };
    });
  }, [userAchievements]);

  // Get stats
  const getStats = useCallback(() => {
    const total = achievements.length;
    const unlocked = userAchievements.filter((a) => a.unlocked).length;
    const totalXp = userAchievements
      .filter((a) => a.unlocked)
      .reduce((sum, ua) => {
        const achievement = achievements.find((a) => a.id === ua.achievement_id);
        return sum + (achievement?.xp || 0);
      }, 0);

    return { total, unlocked, totalXp };
  }, [userAchievements]);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  return {
    achievements: getAchievementsWithProgress(),
    loading,
    getAchievementProgress,
    updateProgress,
    unlockAchievement,
    isUnlocked,
    getStats,
    refetch: fetchAchievements,
  };
}
