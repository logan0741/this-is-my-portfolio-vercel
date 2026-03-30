"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Activity, Position } from "@/types";
import ActivityBlock from "./ActivityBlock";

interface FolderAccordionProps {
  label: string;
  sublabel?: string;
  activities: Activity[];
  positions?: Position[];
  children?: React.ReactNode;
  defaultOpen?: boolean;
  depth?: number;
  onSelectActivities?: (activities: Activity[]) => void;
}

export default function FolderAccordion({
  label,
  sublabel,
  activities,
  positions,
  children,
  defaultOpen = false,
  depth = 0,
  onSelectActivities,
}: FolderAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const awardCount = activities.filter((a) => a.is_awarded).length;

  const handleToggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next && onSelectActivities) {
      onSelectActivities(activities);
    }
  };

  return (
    <div className={`mb-3 ${depth > 0 ? "ml-4" : ""}`}>
      {/* Folder Tab */}
      <motion.button
        className="w-full text-left"
        onClick={handleToggle}
        whileTap={{ scale: 0.99 }}
      >
        <div
          className={`flex items-center justify-between px-5 py-3.5 rounded-xl transition-all duration-300 ${
            isOpen
              ? "bg-[rgba(102,126,234,0.12)] border border-[rgba(102,126,234,0.25)]"
              : "bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.07)]"
          }`}
        >
          <div className="flex items-center gap-3">
            {/* Folder icon */}
            <motion.div
              animate={{ rotate: isOpen ? 0 : -10 }}
              transition={{ duration: 0.3 }}
              className="text-xl"
            >
              {depth === 0 ? "📁" : "📂"}
            </motion.div>

            <div>
              <span className="font-semibold text-[var(--text-primary)]">
                {label}
              </span>
              {sublabel && (
                <span className="ml-2 text-sm text-[var(--text-tertiary)]">
                  {sublabel}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Badge counts */}
            <span className="text-xs text-[var(--text-tertiary)] bg-[rgba(255,255,255,0.06)] px-2.5 py-1 rounded-full">
              {activities.length}개 활동
            </span>
            {awardCount > 0 && (
              <span className="text-xs text-[#ffd700] bg-[rgba(255,214,0,0.1)] px-2.5 py-1 rounded-full">
                🏆 {awardCount}
              </span>
            )}

            {/* Chevron */}
            <motion.svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--text-tertiary)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <path d="M6 9l6 6 6-6" />
            </motion.svg>
          </div>
        </div>
      </motion.button>

      {/* Expanding content - 아코디언 서류첩 */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
                opacity: { duration: 0.3, delay: 0.1 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
                opacity: { duration: 0.15 },
              },
            }}
            className="overflow-hidden"
          >
            <div className="pt-2 pl-2 border-l-2 border-[rgba(102,126,234,0.15)] ml-5 mt-2">
              
              {/* Positions rendering (직책 UI) */}
              {positions && positions.length > 0 && (
                <div className="mb-4 space-y-2 mt-2 mr-2">
                  <h4 className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2 flex items-center gap-1.5 pl-1">
                    <span>🎖️</span> 해당 연도 주요 지책 및 가입 동아리
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {positions.map((pos, idx) => (
                      <div key={idx} className="position-badge rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-3">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="font-semibold text-[var(--accent-blue)] text-sm">{pos.role}</span>
                          <span className="text-[var(--text-secondary)] text-xs border-l border-[rgba(255,255,255,0.1)] pl-2">{pos.org}</span>
                        </div>
                        {pos.description && (
                          <p className="text-[var(--text-tertiary)] text-[11px] leading-relaxed">
                            {pos.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Children or Activities */}
              {children ||
                activities.map((activity, i) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.3 }}
                    className="mb-2"
                  >
                    <ActivityBlock activity={activity} />
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
