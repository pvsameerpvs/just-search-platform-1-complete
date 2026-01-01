
import { notFound } from "next/navigation";
import { AppShell } from "@/components/shell/app-shell";
import { ClientEditForm } from "@/components/clients/ClientEditForm";
import { getClientById } from "@/lib/data";

export default async function ClientEditPage({ params }: { params: { id: string } }) {
  const client = await getClientById(params.id);

  if (!client) {
    notFound();
  }

  return (
    <AppShell title={`Edit: ${client.companyName}`}>
      <div className="max-w-3xl mx-auto">
        <ClientEditForm client={client} />
      </div>
    </AppShell>
  );
}
