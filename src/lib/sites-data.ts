export interface Site {
  id: string;
  name: string;
  description: string;
  location: string;
  deviceCount: number;
  clientCount: number;
  status: "healthy" | "warning" | "critical";
  aiScore: number;
  bandwidth: string;
  uptime: string;
  lastUpdated: string;
}

export const sites: Site[] = [
  {
    id: "demo",
    name: "Main Campus",
    description: "Primary headquarters - full network deployment",
    location: "San Jose, CA",
    deviceCount: 22,
    clientCount: 272,
    status: "healthy",
    aiScore: 84,
    bandwidth: "2.4 TB",
    uptime: "99.8%",
    lastUpdated: "Just now",
  },
  {
    id: "branch-office",
    name: "Branch Office",
    description: "Regional satellite office network",
    location: "Austin, TX",
    deviceCount: 8,
    clientCount: 45,
    status: "warning",
    aiScore: 72,
    bandwidth: "680 GB",
    uptime: "98.2%",
    lastUpdated: "2m ago",
  },
  {
    id: "data-center",
    name: "Data Center",
    description: "Infrastructure and server connectivity",
    location: "Portland, OR",
    deviceCount: 12,
    clientCount: 6,
    status: "healthy",
    aiScore: 96,
    bandwidth: "8.1 TB",
    uptime: "99.99%",
    lastUpdated: "Just now",
  },
];

export function getSiteById(siteId: string): Site | undefined {
  return sites.find((s) => s.id === siteId);
}
