import {
  Activity,
  YearGroup,
  TermGroup,
  CategoryGroup,
  PortfolioStats,
  PortfolioData,
  YearPositions,
} from "@/types";

const TERM_ORDER = ["1학기", "여름방학", "2학기", "겨울방학"];

export async function fetchPortfolioData(): Promise<PortfolioData> {
  const res = await fetch("/data.json");
  if (!res.ok) throw new Error("Failed to fetch data.json");
  return res.json();
}

export function getActivityById(
  activities: Activity[],
  id: string
): Activity | undefined {
  return activities.find((a) => a.id === id);
}

export function getPositionsByYear(
  positions: YearPositions[],
  year: number
): YearPositions | undefined {
  return positions.find((p) => p.year === year);
}

export function groupByDate(activities: Activity[]): YearGroup[] {
  const yearMap = new Map<number, Map<string, Activity[]>>();

  activities.forEach((a) => {
    if (!yearMap.has(a.year)) yearMap.set(a.year, new Map());
    const termMap = yearMap.get(a.year)!;
    if (!termMap.has(a.term)) termMap.set(a.term, []);
    termMap.get(a.term)!.push(a);
  });

  return Array.from(yearMap.entries())
    .sort(([a], [b]) => b - a)
    .map(([year, termMap]) => ({
      year,
      terms: Array.from(termMap.entries())
        .sort(
          ([a], [b]) => TERM_ORDER.indexOf(a) - TERM_ORDER.indexOf(b)
        )
        .map(
          ([term, acts]): TermGroup => ({
            term,
            activities: acts,
          })
        ),
    }));
}

export function groupByCategory(activities: Activity[]): CategoryGroup[] {
  const catMap = new Map<string, Activity[]>();

  activities.forEach((a) => {
    if (!catMap.has(a.category)) catMap.set(a.category, []);
    catMap.get(a.category)!.push(a);
  });

  return Array.from(catMap.entries())
    .sort(([, a], [, b]) => b.length - a.length)
    .map(([category, activities]) => ({
      category,
      activities,
    }));
}

export function computeStats(activities: Activity[]): PortfolioStats {
  const roleDistribution: Record<string, number> = {};
  const githubLinks: { title: string; url: string }[] = [];
  const proofFiles: { url: string; title: string; isCert: boolean }[] = [];
  let totalAwards = 0;

  activities.forEach((a) => {
    if (a.is_awarded) totalAwards++;
    a.roles.forEach((role) => {
      roleDistribution[role] = (roleDistribution[role] || 0) + 1;
    });
    if (a.github_url) {
      githubLinks.push({ title: a.title, url: a.github_url });
    }
    a.images.forEach((img) =>
      proofFiles.push({ url: img, title: a.title, isCert: false })
    );
    a.certificates.forEach((cert) =>
      proofFiles.push({ url: cert, title: a.title, isCert: true })
    );
  });

  return {
    totalActivities: activities.length,
    totalAwards,
    roleDistribution,
    githubLinks,
    proofFiles,
  };
}

export function parseGithubName(url: string): string {
  try {
    const parts = new URL(url).pathname.split("/").filter(Boolean);
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : url;
  } catch {
    return url;
  }
}
