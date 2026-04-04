import type { Activity, PortfolioData, YearPositions } from "@/types";

export const sampleActivities: Activity[] = [
  {
    id: "activity-1",
    year: 2025,
    term: "2학기",
    category: "프로젝트",
    roles: ["Data Engineer", "Backend Engineer"],
    tech_stack: ["TypeScript", "Next.js"],
    title: "Project A",
    description: "sample project a",
    is_awarded: true,
    award_title: "우수상",
    github_url: "https://github.com/example/project-a",
    readme_content: null,
    reflection: "reflection a",
    images: ["/proofs/a-image.pdf"],
    certificates: ["/proofs/a-cert.pdf"],
    detail_sections: [],
  },
  {
    id: "activity-2",
    year: 2025,
    term: "1학기",
    category: "프로젝트",
    roles: ["Data Engineer"],
    tech_stack: ["Python"],
    title: "Project B",
    description: "sample project b",
    is_awarded: false,
    award_title: null,
    github_url: null,
    readme_content: null,
    reflection: "reflection b",
    images: [],
    certificates: [],
    detail_sections: [],
  },
  {
    id: "activity-3",
    year: 2024,
    term: "여름방학",
    category: "대회",
    roles: ["AI Engineer"],
    tech_stack: ["PyTorch"],
    title: "Contest A",
    description: "sample contest a",
    is_awarded: true,
    award_title: "장려상",
    github_url: "https://github.com/example/contest-a",
    readme_content: null,
    reflection: "reflection c",
    images: ["/proofs/c-image.pdf"],
    certificates: ["/proofs/c-cert.pdf"],
    detail_sections: [],
  },
  {
    id: "activity-4",
    year: 2024,
    term: "2학기",
    category: "학회",
    roles: ["Researcher"],
    tech_stack: [],
    title: "Seminar A",
    description: "sample seminar a",
    is_awarded: false,
    award_title: null,
    github_url: null,
    readme_content: null,
    reflection: "reflection d",
    images: [],
    certificates: ["/proofs/d-cert.pdf"],
    detail_sections: [],
  },
];

export const samplePositions: YearPositions[] = [
  {
    year: 2025,
    items: [
      {
        role: "Core Member",
        org: "GDG",
      },
    ],
  },
  {
    year: 2024,
    items: [
      {
        role: "팀장",
        org: "A.I.M",
      },
    ],
  },
];

export const samplePortfolioData: PortfolioData = {
  activities: sampleActivities,
  positions: samplePositions,
};
