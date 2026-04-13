"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "@/lib/theme/context";
import { scheduleRatingsAvailableNotification, requestNotificationPermission } from "@/lib/notifications";

function seededRng(seed: number) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}
function fakeNum(seed: string, min: number, max: number) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) & 0x7fffffff;
  return min + (h % (max - min));
}
function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}
function dailyPick(arr: string[], count: number): string[] {
  const d = new Date();
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  const rng = seededRng(seed);
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, count);
}
function fileToVideoData(file: string) {
  const creator = "@" + file.split("_")[0];
  const views = fakeNum(file + "v", 10_000, 9_800_000);
  const likes = fakeNum(file + "l", 500, Math.floor(views * 0.15));
  return {
    videoSrc: `/videos/${file}`,
    title: "TikTok viral video",
    duration: "0:15",
    views: fmt(views),
    likes: fmt(likes),
    creator,
  };
}

export default function CreatePage() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [videoData, setVideoData] = useState<ReturnType<typeof fileToVideoData>[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ratings, setRatings] = useState<(string | null)[]>([]);
  const [savedProgress, setSavedProgress] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState({ emoji: "", text: "", type: "" });
  const [totalEarned, setTotalEarned] = useState(0);
  const [loadedVideos, setLoadedVideos] = useState<number[]>([0]);
  const [displayedBalance, setDisplayedBalance] = useState(0);
  const [limitReached, setLimitReached] = useState(false);
  const [allRated, setAllRated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [supabaseDataLoaded, setSupabaseDataLoaded] = useState(false);

  // Load videos ONLY after Supabase data is loaded
  useEffect(() => {
    if (!supabaseDataLoaded) return;
    
    fetch("/videos/index.json")
      .then(r => r.json())
      .then((all: string[]) => {
        const picked = dailyPick(all, 20).map(fileToVideoData);
        setVideoData(picked);
        const saved = savedProgress || 0;
        const init = new Array(picked.length).fill(null) as (string | null)[];
        for (let i = 0; i < saved; i++) init[i] = "done";
        setRatings(init);
        // Set currentIndex to the saved position (next video to watch)
        if (saved > 0) setCurrentIndex(Math.min(saved, picked.length - 1));
      });
  }, [supabaseDataLoaded, savedProgress]);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const cashSoundRef = useRef<HTMLAudioElement | null>(null);

  // Check Supabase for daily limit per user
  useEffect(() => {
    const checkUserLimit = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setSupabaseDataLoaded(true);
        setLoading(false);
        return;
      }

      setUserId(user.id);

      // Get user's video rating data
      const { data: ratingData } = await supabase
        .from("video_ratings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (ratingData) {
        const lastDate = new Date(ratingData.last_rating_date);
        const now = new Date();
        const hoursDiff = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60);

        if (hoursDiff < 24 && ratingData.ratings_count >= 20) {
          // Limit reached - less than 24h and already rated 20 videos
          setLimitReached(true);
          setTotalEarned(ratingData.total_earned || 0);
        } else if (hoursDiff >= 24) {
          // Reset after 24 hours - update the record
          await supabase
            .from("video_ratings")
            .update({ 
              ratings_count: 0, 
              total_earned: 0,
              current_video_index: 0,
              last_rating_date: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq("user_id", user.id);
          // Reset saved progress for new day
          setSavedProgress(0);
        } else if (hoursDiff < 24 && ratingData.ratings_count < 20) {
          // User has progress but not finished - restore their position
          const savedIndex = ratingData.current_video_index || 0;
          setSavedProgress(savedIndex);
          setTotalEarned(ratingData.total_earned || 0);
        }
      } else {
        // No rating data yet - new user
        setSavedProgress(0);
      }

      setSupabaseDataLoaded(true);
      setLoading(false);
    };

    checkUserLimit();
  }, []);

  // Animate balance display
  useEffect(() => {
    if (displayedBalance < totalEarned) {
      const diff = totalEarned - displayedBalance;
      const increment = Math.max(1, Math.floor(diff / 20));
      const timer = setTimeout(() => {
        setDisplayedBalance(prev => Math.min(prev + increment, totalEarned));
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [displayedBalance, totalEarned]);

  const playCashSound = () => {
    if (cashSoundRef.current) {
      cashSoundRef.current.currentTime = 0;
      cashSoundRef.current.play().catch(() => {});
    }
  };

  const displayToast = useCallback((emoji: string, text: string, type: string) => {
    setToastData({ emoji, text, type });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 700);
  }, []);

  const updateVideoMutes = useCallback((activeIndex: number) => {
    videoRefs.current.forEach((video, i) => {
      if (video) {
        if (i === activeIndex) {
          video.muted = false;
          video.play().catch(() => {});
        } else {
          video.muted = true;
          video.pause();
        }
      }
    });
  }, []);

  const slideTo = useCallback((idx: number) => {
    if (idx < 0 || idx >= videoData.length) return;
    if (idx === currentIndex) return;
    setAnimating(true);
    setCurrentIndex(idx);
    setTimeout(() => setAnimating(false), 500);
  }, [currentIndex, videoData.length]);

  const goNext = useCallback(() => {
    if (currentIndex < videoData.length - 1) {
      slideTo(currentIndex + 1);
    }
  }, [currentIndex, slideTo]);

  const handleReaction = useCallback(async (reaction: string) => {
    if (videoData.length === 0 || ratings.length !== videoData.length) return;
    if (ratings[currentIndex] !== null) return;
    if (animating) return;
    if (!userId) return;

    // amount em dolares (~6-12 por video, total ~120-240 em 20 videos)
    const amountDollars = Math.floor(Math.random() * (12 - 6 + 1)) + 6;
    const newTotal = totalEarned + amountDollars;
    setTotalEarned(newTotal);

    const newRatings = [...ratings];
    newRatings[currentIndex] = reaction;
    setRatings(newRatings);

    playCashSound();

    const emojis: Record<string, string> = { happy: "😊", neutral: "😐", sad: "😞" };
    const labels: Record<string, string> = { happy: "Loved it!", neutral: "Noted!", sad: "Got it!" };
    displayToast(emojis[reaction], `${labels[reaction]} +$${amountDollars.toFixed(2)}`, reaction);

    // Dispatch event to update TopBar balance with animation
    window.dispatchEvent(new CustomEvent("balanceUpdated", { detail: { amount: amountDollars } }));

    if (videoRefs.current[currentIndex]) {
      videoRefs.current[currentIndex]!.muted = true;
    }

    // Save to Supabase (fire-and-forget to not block UI, but ensure it completes)
    const supabase = createClient();
    const ratingsCount = newRatings.filter(r => r !== null).length;
    const nextIndex = Math.min(currentIndex + 1, videoData.length - 1);
    const xpToAdd = amountDollars * 10000;

    // Save both in parallel - don't await to avoid blocking navigation
    const savePromise = Promise.all([
      // 1. Save video ratings progress
      supabase
        .from("video_ratings")
        .upsert({
          user_id: userId,
          last_rating_date: new Date().toISOString(),
          total_earned: newTotal,
          ratings_count: ratingsCount,
          current_video_index: nextIndex,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" }),

      // 2. Save XP - read current then update
      supabase
        .from("profiles")
        .select("total_xp")
        .eq("id", userId)
        .single()
        .then(({ data: currentProfile }) => {
          const currentXp = currentProfile?.total_xp || 0;
          return supabase
            .from("profiles")
            .update({ total_xp: currentXp + xpToAdd, updated_at: new Date().toISOString() })
            .eq("id", userId);
        })
        .then(({ error: updateError }) => {
          if (updateError) {
            console.error("Direct update failed, trying RPC:", updateError);
            return supabase.rpc('increment_user_xp', {
              p_user_id: userId,
              p_xp_amount: xpToAdd
            });
          }
        }),
    ]).catch(err => console.error("Save error:", err));

    // Check referral on first video
    if (currentIndex === 0 && ratingsCount === 1) {
      fetch("/api/referral/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      }).catch(() => {});
    }

    // Check if all videos rated
    const allDone = newRatings.length === videoData.length && newRatings.every((r) => r !== null);
    if (allDone) {
      // Wait for save to complete before showing final screen
      await savePromise;
      requestNotificationPermission().then((granted) => {
        if (granted) {
          scheduleRatingsAvailableNotification();
        }
      });

      setTimeout(() => {
        setAllRated(true);
        setTimeout(() => {
          setLimitReached(true);
        }, 2000);
      }, 1000);
    } else {
      setTimeout(() => {
        goNext();
      }, 900);
    }
  }, [ratings, currentIndex, animating, displayToast, goNext, totalEarned, userId]);

  // Play current video (always muted = autoplay guaranteed)
  useEffect(() => {
    if (loading || videoData.length === 0) return;
    const v = videoRefs.current[currentIndex];
    if (v) {
      v.muted = true;
      v.play().catch(() => {});
    }
    // pause previous
    videoRefs.current.forEach((ref, i) => {
      if (i !== currentIndex && ref) ref.pause();
    });
  }, [loading, currentIndex, videoData.length]);

  // Loading screen
  if (loading || videoData.length === 0) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", minHeight: "80vh", padding: "20px",
      }}>
        <div style={{
          width: "40px", height: "40px",
          border: "3px solid rgba(255,255,255,0.1)",
          borderTopColor: "#fe2c55",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}/>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Not logged in
  if (!userId) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", minHeight: "80vh", padding: "20px", textAlign: "center",
      }}>
        <h2 style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "12px" }}>
          Log in to rate videos
        </h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
          You need to be logged in to rate videos and earn money.
        </p>
      </div>
    );
  }

  // Limit reached screen
  if (limitReached) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", minHeight: "80vh", padding: "20px", textAlign: "center",
      }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          style={{
            width: "100px", height: "100px", borderRadius: "50%",
            background: "linear-gradient(135deg, #fe2c55, #25f4ee)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "12px" }}
        >
          Daily Limit Reached!
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ fontSize: "15px", color: "var(--text-secondary)", marginBottom: "16px", maxWidth: "320px", lineHeight: 1.6 }}
        >
          You have already rated all 3 videos for today. Come back in 24 hours to rate more videos and keep earning!
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            background: "rgba(37,244,238,0.1)",
            border: "1px solid rgba(37,244,238,0.3)",
            borderRadius: "16px",
            padding: "20px 32px",
            marginBottom: "24px",
          }}
        >
          <p style={{ fontSize: "13px", color: "#25f4ee", marginBottom: "4px" }}>Balance added to wallet</p>
          <p style={{ fontSize: "32px", fontWeight: 800, color: "var(--text-primary)" }}>
            +${totalEarned > 0 ? totalEarned.toFixed(2) : "0.00"}
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "24px" }}
        >
          Your balance is available in the Wallet tab
        </motion.p>

        {/* Referral CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            width: "100%",
            maxWidth: "320px",
            padding: "20px",
            background: "linear-gradient(135deg, rgba(254,44,85,0.1) 0%, rgba(254,44,85,0.05) 100%)",
            borderRadius: "16px",
            border: "1px solid rgba(254,44,85,0.2)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #fe2c55 0%, #ff6b8a 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
                Invite Friends & Earn More!
              </h3>
              <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                Get $20.00 for each friend who joins
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const event = new CustomEvent("openReferralModal");
              window.dispatchEvent(event);
            }}
            style={{
              width: "100%",
              padding: "12px",
              background: "linear-gradient(135deg, #fe2c55 0%, #ff4070 100%)",
              border: "none",
              borderRadius: "10px",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            Share & Earn
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      width: "100%", 
      maxWidth: "100vw",
      padding: "clamp(8px, 2vw, 16px) clamp(12px, 3vw, 20px)", 
      paddingTop: "clamp(8px, 2vw, 16px)",
      paddingBottom: "calc(clamp(20px, 5vw, 32px) + env(safe-area-inset-bottom, 0px))",
      height: "100%",
      minHeight: "calc(100vh - clamp(70px, 18vw, 90px))",
      overflow: "hidden",
      boxSizing: "border-box",
      alignItems: "center",
    }}>
      <audio ref={cashSoundRef} src="/sounds/cashregister.mp3" preload="auto" />

      {/* Toast de feedback */}
      <AnimatePresence>
        {showToast && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.75 }}
              style={{
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                gap: "8px",
                padding: "12px 24px",
                background: "rgba(20,20,24,0.95)",
                border: `1px solid ${toastData.type === "happy" ? "#22c55e" : toastData.type === "neutral" ? "#eab308" : "#fe2c55"}`,
                borderRadius: "12px", 
                backdropFilter: "blur(20px)",
                fontSize: "14px", 
                fontWeight: 600, 
                whiteSpace: "nowrap",
                boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
              }}
            >
              <span style={{ fontSize: "18px" }}>{toastData.emoji}</span>
              <span style={{ color: toastData.type === "happy" ? "#22c55e" : toastData.type === "neutral" ? "#eab308" : "#fe2c55" }}>
                {toastData.text}
              </span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* All rated success message */}
      <AnimatePresence>
        {allRated && !limitReached && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, zIndex: 300,
              background: "rgba(0,0,0,0.9)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              style={{
                width: "80px", height: "80px", borderRadius: "50%",
                background: "linear-gradient(135deg, #22c55e, #25f4ee)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "20px",
              }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </motion.div>
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
              Congratulations!
            </h2>
            <p style={{ fontSize: "16px", color: "#25f4ee" }}>
              +${totalEarned.toFixed(2)} added!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video player - one at a time with AnimatePresence */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "clamp(12px, 3vw, 20px)",
          width: "min(calc(100vw - clamp(32px, 8vw, 56px)), clamp(260px, 70vw, 360px))",
          height: "clamp(280px, calc(100vh - clamp(220px, 35vh, 300px)), 550px)",
          minHeight: "250px",
          maxHeight: "65vh",
          marginLeft: "auto",
          marginRight: "auto",
          flexShrink: 0,
          background: "#000",
          boxShadow: isDarkMode ? "0 8px 32px rgba(0,0,0,0.5)" : "0 8px 32px rgba(0,0,0,0.15)",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.25 }}
            style={{ position: "absolute", inset: 0 }}
          >
            {/* current video — key forces remount = guaranteed autoplay */}
            <video
              key={videoData[currentIndex]?.videoSrc}
              ref={el => { videoRefs.current[currentIndex] = el; }}
              src={videoData[currentIndex]?.videoSrc}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              loop
              playsInline
              muted
              autoPlay
              preload="auto"
            />

            {/* Gradient overlay */}
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.85) 100%)",
            }} />

            {/* Video info */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "#fff", fontWeight: 700, fontSize: "14px" }}>{videoData[currentIndex]?.creator}</p>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", marginTop: "4px" }}>
                    {videoData[currentIndex]?.views} views &nbsp; {videoData[currentIndex]?.likes} likes
                  </p>
                </div>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "11px", background: "rgba(0,0,0,0.5)", padding: "3px 7px", borderRadius: "4px" }}>
                  {videoData[currentIndex]?.duration}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* preload next video in background */}
        {currentIndex + 1 < videoData.length && (
          <video
            key={`pre-${videoData[currentIndex + 1]?.videoSrc}`}
            src={videoData[currentIndex + 1]?.videoSrc}
            style={{ display: "none" }}
            muted
            preload="auto"
            playsInline
          />
        )}

        {/* Progress bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "rgba(255,255,255,0.12)", zIndex: 10 }}>
          <motion.div
            animate={{ width: `${(ratings.filter(r => r !== null).length / (videoData.length || 1)) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ height: "100%", background: "linear-gradient(90deg, #25f4ee, #fe2c55)", borderRadius: "0 2px 2px 0" }}
          />
        </div>

        {/* Counter */}
        <div style={{
          position: "absolute", top: "10px", right: "10px", zIndex: 10,
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
          borderRadius: "99px", padding: "3px 10px",
          fontSize: "11px", fontWeight: 700, color: "#fff",
        }}>
          {ratings.filter(r => r !== null).length}/{videoData.length}
        </div>
      </div>

      {/* Pergunta */}
      <div style={{ textAlign: "center", marginTop: "12px", flexShrink: 0 }}>
        <h2 style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "15px" }}>
          How do you feel about this video?
        </h2>
      </div>

      {/* 3 Botoes de reacao - mobile optimized */}
      <div 
        className="reaction-buttons"
        style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: "clamp(16px, 5vw, 28px)", 
          marginTop: "clamp(8px, 2vw, 16px)",
          flexShrink: 0,
          paddingBottom: "calc(clamp(12px, 3vw, 24px) + env(safe-area-inset-bottom, 0px))",
          width: "100%",
          maxWidth: "min(320px, calc(100vw - 32px))",
          marginLeft: "auto",
          marginRight: "auto",
        }}>
        {/* Happy */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleReaction("happy")}
          disabled={ratings[currentIndex] !== null}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
            background: "transparent", border: "none", cursor: ratings[currentIndex] === null ? "pointer" : "default",
            opacity: ratings[currentIndex] !== null && ratings[currentIndex] !== "happy" ? 0.4 : 1,
            transform: ratings[currentIndex] === "happy" ? "scale(1.1)" : "scale(1)",
            transition: "all 200ms",
            padding: "4px",
          }}
        >
          <motion.div 
            whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
            className="reaction-button"
            style={{
              width: "clamp(44px, 12vw, 56px)", 
              height: "clamp(44px, 12vw, 56px)", 
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "2px solid #25f4ee",
              background: ratings[currentIndex] === "happy" ? "rgba(37,244,238,0.2)" : "transparent",
              transition: "all 200ms",
            }}
          >
            <span style={{ fontSize: "clamp(20px, 5vw, 26px)" }}>😊</span>
          </motion.div>
        </motion.button>

        {/* Neutral */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleReaction("neutral")}
          disabled={ratings[currentIndex] !== null}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
            background: "transparent", border: "none", cursor: ratings[currentIndex] === null ? "pointer" : "default",
            opacity: ratings[currentIndex] !== null && ratings[currentIndex] !== "neutral" ? 0.4 : 1,
            transform: ratings[currentIndex] === "neutral" ? "scale(1.1)" : "scale(1)",
            transition: "all 200ms",
            padding: "4px",
          }}
        >
          <motion.div 
            whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
            className="reaction-button"
            style={{
              width: "clamp(44px, 12vw, 56px)", 
              height: "clamp(44px, 12vw, 56px)", 
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "2px solid #eab308",
              background: ratings[currentIndex] === "neutral" ? "rgba(234,179,8,0.2)" : "transparent",
              transition: "all 200ms",
            }}
          >
            <span style={{ fontSize: "clamp(20px, 5vw, 26px)" }}>😐</span>
          </motion.div>
        </motion.button>

        {/* Sad */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleReaction("sad")}
          disabled={ratings[currentIndex] !== null}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
            background: "transparent", border: "none", cursor: ratings[currentIndex] === null ? "pointer" : "default",
            opacity: ratings[currentIndex] !== null && ratings[currentIndex] !== "sad" ? 0.4 : 1,
            transform: ratings[currentIndex] === "sad" ? "scale(1.1)" : "scale(1)",
            transition: "all 200ms",
            padding: "4px",
          }}
        >
          <motion.div 
            whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
            className="reaction-button"
            style={{
              width: "clamp(44px, 12vw, 56px)", 
              height: "clamp(44px, 12vw, 56px)", 
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "2px solid #fe2c55",
              background: ratings[currentIndex] === "sad" ? "rgba(254,44,85,0.2)" : "transparent",
              transition: "all 200ms",
            }}
          >
            <span style={{ fontSize: "clamp(20px, 5vw, 26px)" }}>😞</span>
          </motion.div>
        </motion.button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
