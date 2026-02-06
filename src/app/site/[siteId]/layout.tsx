import Sidebar from "@/components/Sidebar";

export default function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { siteId: string };
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar siteId={params.siteId} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
