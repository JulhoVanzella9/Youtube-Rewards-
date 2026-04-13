"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export interface UserProfile {
  id: string;
  display_name: string;
  username: string;
  member_since: number;
  certificates_count: number;
  achievements_count: number;
  streak_days: number;
  total_watch_hours: string;
  total_xp: number;
}

const defaultProfile: UserProfile = {
  id: "",
  display_name: "User",
  username: "user",
  member_since: 2025,
  certificates_count: 0,
  achievements_count: 0,
  streak_days: 0,
  total_watch_hours: "0h",
  total_xp: 0,
};

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch profile
  const fetchProfile = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setLoading(false);
      return;
    }

    setUserId(user.id);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setProfile({
        id: data.id,
        display_name: data.display_name || user.email?.split("@")[0] || "User",
        username: data.username || user.email?.split("@")[0] || "user",
        member_since: data.member_since || 2025,
        certificates_count: data.certificates_count || 0,
        achievements_count: data.achievements_count || 0,
        streak_days: data.streak_days || 0,
        total_watch_hours: data.total_watch_hours || "0h",
        total_xp: data.total_xp || 0,
      });
    } else if (error && error.code === "PGRST116") {
      // Profile doesn't exist, create it
      const newProfile = {
        id: user.id,
        display_name: user.email?.split("@")[0] || "User",
        username: user.email?.split("@")[0] || "user",
        total_xp: 0,
      };
      await supabase.from("profiles").insert(newProfile);
      setProfile({ ...defaultProfile, ...newProfile });
    }

    setLoading(false);
  }, []);

  // Update profile
  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!userId) return;

    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", userId);

    if (!error) {
      setProfile((prev) => ({ ...prev, ...updates }));
    }
    return !error;
  }, [userId]);

  // Increment stats
  const incrementStat = useCallback(async (stat: "certificates_count" | "achievements_count" | "total_xp", amount: number = 1) => {
    if (!userId) return;

    const supabase = createClient();
    const newValue = profile[stat] as number + amount;
    
    const { error } = await supabase
      .from("profiles")
      .update({ [stat]: newValue, updated_at: new Date().toISOString() })
      .eq("id", userId);

    if (!error) {
      setProfile((prev) => ({ ...prev, [stat]: newValue }));
    }
    return !error;
  }, [userId, profile]);

  // Update watch hours
  const addWatchTime = useCallback(async (minutes: number) => {
    if (!userId) return;

    const currentHours = parseFloat(profile.total_watch_hours.replace("h", "")) || 0;
    const newHours = currentHours + (minutes / 60);
    const formattedHours = `${newHours.toFixed(1)}h`;

    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ total_watch_hours: formattedHours, updated_at: new Date().toISOString() })
      .eq("id", userId);

    if (!error) {
      setProfile((prev) => ({ ...prev, total_watch_hours: formattedHours }));
    }
    return !error;
  }, [userId, profile.total_watch_hours]);

  // Update streak
  const updateStreak = useCallback(async () => {
    if (!userId) return;

    const supabase = createClient();
    const newStreak = profile.streak_days + 1;
    
    const { error } = await supabase
      .from("profiles")
      .update({ streak_days: newStreak, updated_at: new Date().toISOString() })
      .eq("id", userId);

    if (!error) {
      setProfile((prev) => ({ ...prev, streak_days: newStreak }));
    }
    return !error;
  }, [userId, profile.streak_days]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    userId,
    updateProfile,
    incrementStat,
    addWatchTime,
    updateStreak,
    refetch: fetchProfile,
  };
}
