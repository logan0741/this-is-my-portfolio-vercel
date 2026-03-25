"use client";

import { Activity } from "@/types";
import { parseGithubName } from "@/lib/data";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ActivityBlockProps {
  activity: Activity;
}

export default function ActivityBlock({ activity }: ActivityBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div
        className="activity-block relative group cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Top row: title + award */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <motion.svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--text-tertiary)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <path d="M9 18l6-6-6-6" />
            </motion.svg>
            <h3 className="font-semibold text-[var(--text-primary)] text-sm leading-snug pr-4">
              {activity.title}
            </h3>
          </div>
          {activity.is_awarded && activity.award_title && (
            <span className="award-badge flex-shrink-0">
              🏆 {activity.award_title}
            </span>
          )}
        </div>

        {/* Tech Stack Tags */}
        {activity.tech_stack && activity.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {activity.tech_stack.map((tech) => (
              <span
                key={tech}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[rgba(102,126,234,0.12)] text-[rgba(147,168,255,0.9)] border border-[rgba(102,126,234,0.2)]"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Roles */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {activity.roles.map((role) => (
            <span key={role} className="role-tag">
              {role}
            </span>
          ))}
        </div>

        {/* Bottom row: github */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {activity.github_url && (
              <a
                href={activity.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span className="font-mono">
                  {parseGithubName(activity.github_url)}
                </span>
              </a>
            )}
          </div>

          {/* Expand hint */}
          <span className="text-[10px] text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity">
            {isExpanded ? "접기" : "자세히 보기"}
          </span>
        </div>

        {/* Description preview (always visible, collapsed) */}
        {!isExpanded && activity.description && (
          <p className="mt-3 text-xs text-[var(--text-tertiary)] line-clamp-2 leading-relaxed">
            {activity.description}
          </p>
        )}

        {/* Expanded Detail Section */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: "auto",
                opacity: 1,
                transition: {
                  height: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
                  opacity: { duration: 0.25, delay: 0.1 },
                },
              }}
              exit={{
                height: 0,
                opacity: 0,
                transition: {
                  height: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] },
                  opacity: { duration: 0.15 },
                },
              }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)] space-y-4">
                {/* Description */}
                {activity.description && (
                  <div>
                    <h4 className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                      📋 프로젝트 설명
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {activity.description}
                    </p>
                  </div>
                )}

                {/* Reflection */}
                {activity.reflection && (
                  <div>
                    <h4 className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                      💭 느낀점
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {activity.reflection}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
