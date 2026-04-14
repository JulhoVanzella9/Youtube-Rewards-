"use client";
import { useEffect, useRef, useState, useCallback } from "react";

// ── Storage keys for persisting video state ────────────────────────────────
const STORAGE_KEY = "youcash_feed_current_index";
const STORAGE_TIME_KEY = "youcash_feed_current_time";
const STORAGE_DATE_KEY = "youcash_feed_date";

// ── seeded shuffle (mesma ordem o dia todo, muda todo dia) ─────────────────
function seededRng(seed: number) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}
function dailyShuffle<T>(arr: T[]): T[] {
  const d = new Date();
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  const rng = seededRng(seed);
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, 20);
}

// ── Get today's date string for comparison ─────────────────────────────────
function getTodayString() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

// ── Get saved index from sessionStorage (only if same day) ─────────────────
function getSavedIndex(): number {
  if (typeof window === "undefined") return 0;
  try {
    const savedDate = sessionStorage.getItem(STORAGE_DATE_KEY);
    const today = getTodayString();
    // Reset index if it's a new day (since videos shuffle daily)
    if (savedDate !== today) {
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.setItem(STORAGE_DATE_KEY, today);
      return 0;
    }
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? parseInt(saved, 10) : 0;
  } catch {
    return 0;
  }
}

// ── Save index to sessionStorage ───────────────────────────────────────────
function saveIndex(index: number) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, index.toString());
    sessionStorage.setItem(STORAGE_DATE_KEY, getTodayString());
  } catch {
    // Ignore storage errors
  }
}

// ── Get saved playback time from sessionStorage ────────────────────────────
function getSavedTime(): number {
  if (typeof window === "undefined") return 0;
  try {
    const savedDate = sessionStorage.getItem(STORAGE_DATE_KEY);
    const today = getTodayString();
    if (savedDate !== today) return 0;
    const saved = sessionStorage.getItem(STORAGE_TIME_KEY);
    return saved ? parseFloat(saved) : 0;
  } catch {
    return 0;
  }
}

// ── Save playback time to sessionStorage ───────────────────────────────────
function saveTime(time: number) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_TIME_KEY, time.toString());
  } catch {
    // Ignore storage errors
  }
}

// ── fake stats estáveis por seed ───────────────────────────────────────────
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

export default function FeedPage() {
  const [videos, setVideos] = useState<string[]>([]);
  const [current, setCurrent] = useState(() => getSavedIndex());
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [muted, setMuted] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const pendingTimeRestore = useRef<number | null>(getSavedTime());
  const isFirstLoad = useRef(true);

  // carrega lista de vídeos
  useEffect(() => {
    fetch("/videos/index.json")
      .then(r => r.json())
      .then((all: string[]) => {
        const shuffled = dailyShuffle(all);
        setVideos(shuffled);
        // Ensure saved index is within bounds
        const savedIdx = getSavedIndex();
        if (savedIdx >= shuffled.length) {
          setCurrent(0);
          saveIndex(0);
        }
      });
  }, []);

  // Save current index whenever it changes
  useEffect(() => {
    saveIndex(current);
  }, [current]);

  // pausa todos, toca o atual com tempo restaurado
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === current) {
        // Restore saved time on first load, otherwise start from beginning
        if (isFirstLoad.current && pendingTimeRestore.current !== null && pendingTimeRestore.current > 0) {
          v.currentTime = pendingTimeRestore.current;
          pendingTimeRestore.current = null;
          isFirstLoad.current = false;
        } else if (isFirstLoad.current) {
          // First load but no saved time - just mark as loaded
          isFirstLoad.current = false;
        } else {
          // Navigating to a new video - reset time
          v.currentTime = 0;
          saveTime(0);
        }
        v.play().catch(() => {});
      } else {
        v.pause();
        v.currentTime = 0;
      }
    });
  }, [current, videos]);

  // Save playback time periodically and on visibility change
  useEffect(() => {
    const saveCurrentTime = () => {
      const v = videoRefs.current[current];
      if (v && !isNaN(v.currentTime)) {
        saveTime(v.currentTime);
      }
    };

    // Save time every second while playing
    const interval = setInterval(saveCurrentTime, 1000);

    // Save time when user leaves the page
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        saveCurrentTime();
      }
    };

    // Save time before unload
    const handleBeforeUnload = () => {
      saveCurrentTime();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      saveCurrentTime(); // Save on cleanup
    };
  }, [current]);

  // scroll para o vídeo atual
  useEffect(() => {
    const el = videoRefs.current[current];
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [current]);

  const goNext = useCallback(() => setCurrent(c => Math.min(c + 1, videos.length - 1)), [videos.length]);
  const goPrev = useCallback(() => setCurrent(c => Math.max(c - 1, 0)), []);

  // swipe
  const touchStart = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientY; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dy = touchStart.current - e.changedTouches[0].clientY;
    if (dy > 60) goNext();
    else if (dy < -60) goPrev();
  };

  // teclado
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") goNext();
      if (e.key === "ArrowUp") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev]);

  if (!videos.length) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "#aaa", fontSize: 14 }}>
      Loading videos...
    </div>
  );

  return (
    <div
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{
        position: "fixed", inset: 0,
        background: "#000",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* vídeo atual */}
      {videos.map((file, i) => {
        if (Math.abs(i - current) > 1) return null; // renderiza só vizinhos
        const views = fakeNum(file + "v", 10_000, 9_800_000);
        const likes = fakeNum(file + "l", 500, Math.floor(views * 0.15));
        const comments = fakeNum(file + "c", 50, Math.floor(likes * 0.3));
        const isActive = i === current;

        return (
          <div
            key={file}
            style={{
              position: "absolute",
              inset: 0,
              opacity: isActive ? 1 : 0,
              transition: "opacity .25s",
              pointerEvents: isActive ? "auto" : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* vídeo */}
            <video
              ref={el => { videoRefs.current[i] = el; }}
              src={`/videos/${file}`}
              loop
              playsInline
              muted={muted}
              onClick={() => {
                const v = videoRefs.current[i];
                if (!v) return;
                v.paused ? v.play() : v.pause();
              }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
                cursor: "pointer",
              }}
            />

            {/* overlay escuro na parte inferior */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: "45%",
              background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
              pointerEvents: "none",
            }} />

            {/* info inferior esquerda */}
            <div style={{
              position: "absolute", bottom: 80, left: 16, right: 70,
              color: "#fff",
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, textShadow: "0 1px 4px rgba(0,0,0,.8)" }}>
                @{file.split("_")[0]}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)", textShadow: "0 1px 4px rgba(0,0,0,.8)" }}>
                {fmt(views)} views
              </div>
            </div>

            {/* ações lateral direita */}
            <div style={{
              position: "absolute", bottom: 80, right: 12,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
            }}>
              {/* like */}
              <ActionBtn
                icon={liked.has(i) ? "❤️" : "🤍"}
                label={fmt(likes + (liked.has(i) ? 1 : 0))}
                onClick={() => setLiked(s => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; })}
                active={liked.has(i)}
              />
              {/* comments */}
              <ActionBtn icon="💬" label={fmt(comments)} onClick={() => {}} />
              {/* mute */}
              <ActionBtn
                icon={muted ? "🔇" : "🔊"}
                label={muted ? "Muted" : "Sound"}
                onClick={() => setMuted(m => !m)}
              />
            </div>

            {/* contador de vídeos */}
            <div style={{
              position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)",
              background: "rgba(0,0,0,.5)", borderRadius: 99, padding: "4px 14px",
              fontSize: 12, color: "#fff", fontWeight: 600,
              backdropFilter: "blur(8px)",
            }}>
              {i + 1} / {videos.length}
            </div>
          </div>
        );
      })}

      {/* setas */}
      {current > 0 && (
        <button onClick={goPrev} style={arrowStyle("top")}>▲</button>
      )}
      {current < videos.length - 1 && (
        <button onClick={goNext} style={arrowStyle("bottom")}>▼</button>
      )}
    </div>
  );
}

function ActionBtn({ icon, label, onClick, active }: { icon: string; label: string; onClick: () => void; active?: boolean }) {
  return (
    <button onClick={onClick} style={{
      background: "none", border: "none", cursor: "pointer",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
      color: "#fff", padding: 0,
    }}>
      <span style={{ fontSize: 28, filter: active ? "drop-shadow(0 0 6px #FF0000)" : "none", transition: "filter .2s" }}>{icon}</span>
      <span style={{ fontSize: 11, fontWeight: 700, textShadow: "0 1px 4px rgba(0,0,0,.8)" }}>{label}</span>
    </button>
  );
}

function arrowStyle(pos: "top" | "bottom"): React.CSSProperties {
  return {
    position: "absolute",
    [pos]: 16,
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(255,255,255,.15)",
    border: "none",
    borderRadius: "50%",
    width: 36, height: 36,
    color: "#fff",
    fontSize: 14,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(8px)",
    zIndex: 10,
  };
}
