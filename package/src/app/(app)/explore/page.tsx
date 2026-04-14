"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { courses } from "@/app/data/courses";
import CourseCard from "@/app/components/CourseCard";
import { useI18n } from "@/lib/i18n/context";

export default function ExplorePage() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [active, setActive] = useState("all");

  // Memoize categories to avoid recalculation
  const categories = useMemo(() => {
    const existingCategories = Array.from(new Set(courses.map((c) => c.category)));
    return ["all", ...existingCategories];
  }, []);

  // Memoize filtered results
  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase()) ||
        c.instructor.toLowerCase().includes(search.toLowerCase());
      const matchCat = active === "all" || c.category === active;
      return matchSearch && matchCat;
    });
  }, [search, active]);

  const getCategoryLabel = (cat: string) => {
    if (cat === "all") return t("all");
    return cat;
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        style={{
          position: "relative", marginBottom: "20px",
        }}
      >
        <svg
          width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round"
          style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }}
        >
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%", padding: "14px 18px 14px 48px", fontSize: "15px",
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px", color: "#fff", outline: "none", fontFamily: "inherit",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "rgba(255,0,0,0.3)";
            e.target.style.boxShadow = "0 0 0 4px rgba(255,0,0,0.08)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(255,255,255,0.08)";
            e.target.style.boxShadow = "none";
          }}
        />
      </motion.div>

      {/* Categories - only show if there are multiple */}
      {categories.length > 1 && (
        <div style={{
          display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px",
          marginBottom: "24px", scrollbarWidth: "none",
        }}>
          {categories.map((cat, i) => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03, duration: 0.2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActive(cat)}
              style={{
                padding: "8px 18px", fontSize: "13px", fontWeight: 600,
                background: active === cat ? "var(--gradient-button)" : "rgba(255,255,255,0.04)",
                color: active === cat ? "#fff" : "var(--text-secondary)",
                border: active === cat ? "none" : "1px solid rgba(255,255,255,0.08)",
                borderRadius: "20px", cursor: "pointer", fontFamily: "inherit",
                whiteSpace: "nowrap", transition: "background 0.2s, color 0.2s",
              }}
            >
              {getCategoryLabel(cat)}
            </motion.button>
          ))}
        </div>
      )}

      {/* Results */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
        gap: "20px",
      }}>
        <AnimatePresence mode="popLayout">
          {filtered.map((course, i) => (
            <motion.div
              key={course.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <CourseCard course={course} index={i} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          style={{ textAlign: "center", padding: "60px 20px" }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
            {t("noCourseFound")}
          </h3>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            {t("tryOtherTerms")}
          </p>
        </motion.div>
      )}
    </div>
  );
}
