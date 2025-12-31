import { AppShell } from "@/components/shell/app-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <AppShell title="Reports">
      <Card>
        <CardHeader>
          <div className="text-jsBlack-900 font-semibold">Reports</div>
          <div className="text-gray-500 text-sm">Admin/Sales reports endpoints are ready in /api/reports</div>
        </CardHeader>
        <CardContent className="text-gray-700 text-sm">
          Use:
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>/api/reports/admin</li>
            <li>/api/reports/sales</li>
          </ul>
        </CardContent>
      </Card>
    </AppShell>
  );
}
