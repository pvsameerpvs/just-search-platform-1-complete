import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AppShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar title={title} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
