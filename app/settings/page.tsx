import { AppShell } from "@/components/shell/app-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <AppShell title="Settings">
      <Card>
        <CardHeader>
          <div className="text-jsBlack-900 font-semibold">Settings</div>
          <div className="text-gray-500 text-sm">Update profile, password, and system settings (scaffold)</div>
        </CardHeader>
        <CardContent className="text-gray-700 text-sm">
          This page is included as a placeholder for future settings features.
        </CardContent>
      </Card>
    </AppShell>
  );
}
