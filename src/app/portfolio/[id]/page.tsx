"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, PortfolioData } from "@/types";
import { parseGithubName } from "@/lib/data";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import QuickLookModal from "@/components/portfolio/QuickLookModal";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [quickLookImage, setQuickLookImage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data: PortfolioData) => {
        const found = data.activities.find((a) => a.id === id);
        setActivity(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AnimatedBackground />
        <motion.div
          className="glass p-8 text-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <p className="text-[var(--text-secondary)]">로딩 중...</p>
        </motion.div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AnimatedBackground />
        <div className="glass p-8 text-center">
          <p className="text-[var(--text-secondary)]">
            프로젝트를 찾을 수 없습니다.
          </p>
          <button
            onClick={() => router.push("/portfolio")}
            className="mt-4 text-sm text-[var(--accent-blue)] hover:underline"
          >
            포트폴리오로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />

      {/* Header */}
      <motion.header
        className="sticky top-0 z-50 px-6 py-4"
        style={{
          background: "rgba(10, 10, 26, 0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push("/portfolio")}
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">포트폴리오로</span>
          </button>
          <span className="text-xs text-[var(--text-tertiary)]">
            {activity.year}년 {activity.term}
          </span>
        </div>
      </motion.header>

      {/* Content */}
      <motion.main
        className="max-w-4xl mx-auto px-6 py-10 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Hero Section */}
        <div className="mb-10">
          {/* Category + Award */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-[rgba(102,126,234,0.15)] text-[rgba(147,168,255,0.9)] border border-[rgba(102,126,234,0.25)]">
              {activity.category}
            </span>
            {activity.is_awarded && activity.award_title && (
              <span className="award-badge">🏆 {activity.award_title}</span>
            )}
          </div>

          {/* Title */}
          <h1
            className="text-3xl md:text-4xl font-bold mb-4 leading-tight"
            style={{
              background: "linear-gradient(135deg, #f5f5f7 0%, #a0a0b0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {activity.title}
          </h1>

          {/* Roles */}
          <div className="flex flex-wrap gap-2 mb-4">
            {activity.roles.map((role) => (
              <span key={role} className="role-tag">
                {role}
              </span>
            ))}
          </div>

          {/* Tech Stack */}
          {activity.tech_stack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {activity.tech_stack.map((tech) => (
                <span
                  key={tech}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[rgba(102,126,234,0.12)] text-[rgba(147,168,255,0.9)] border border-[rgba(102,126,234,0.2)]"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* GitHub Link */}
          {activity.github_url && (
            <a
              href={activity.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-6"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="font-mono">{parseGithubName(activity.github_url)}</span>
            </a>
          )}
        </div>

        {/* Description */}
        <section className="detail-section">
          <h2 className="detail-section-title">📋 프로젝트 설명</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            {activity.description}
          </p>
        </section>

        {/* Detail Sections */}
        {activity.detail_sections &&
          activity.detail_sections.length > 0 &&
          activity.detail_sections.map((section, idx) => (
            <motion.section
              key={idx}
              className="detail-section"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <h2 className="detail-section-title">{section.heading}</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                {section.content}
              </p>
              {section.images && section.images.length > 0 && (
                <div className={`grid gap-3 ${section.images.length === 1 ? "grid-cols-1" : section.images.length === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3"}`}>
                  {section.images.map((img, imgIdx) => (
                    <motion.div
                      key={imgIdx}
                      className="detail-image-container cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setQuickLookImage(img)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={encodeURI(img)}
                        alt={`${section.heading} ${imgIdx + 1}`}
                        className="w-full h-auto rounded-lg"
                        loading="lazy"
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.section>
          ))}

        {/* Reflection */}
        {activity.reflection && (
          <section className="detail-section">
            <h2 className="detail-section-title">💭 느낀점</h2>
            <div className="glass-subtle p-6">
              <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                {activity.reflection}
              </p>
            </div>
          </section>
        )}

        {/* Certificates & Proofs */}
        {(activity.certificates.length > 0 || activity.images.length > 0) && (
          <section className="detail-section">
            <h2 className="detail-section-title">📎 증빙 서류</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[...activity.certificates, ...activity.images].map(
                (file, i) => (
                  <div
                    key={i}
                    className="detail-proof-card cursor-pointer"
                    onClick={() => setQuickLookImage(file)}
                  >
                    {file.toLowerCase().endsWith(".pdf") ? (
                      <div className="flex flex-col items-center justify-center h-full gap-2 py-6">
                        <span className="text-3xl">📄</span>
                        <span className="text-[10px] text-[var(--text-tertiary)] text-center px-2 line-clamp-2">
                          {decodeURIComponent(file.split("/").pop() || "")}
                        </span>
                      </div>
                    ) : (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={encodeURI(file)}
                        alt="증빙"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </div>
                )
              )}
            </div>
          </section>
        )}
      </motion.main>

      {/* Quick Look Modal */}
      <AnimatePresence>
        {quickLookImage && (
          <QuickLookModal
            imageSrc={quickLookImage}
            onClose={() => setQuickLookImage(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
