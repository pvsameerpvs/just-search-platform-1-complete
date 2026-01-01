"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function DeleteClientButton({ id, name }: { id: string, name: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/clients/delete?clientId=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Client deleted successfully");
        router.push("/clients");
      } else {
        toast.error("Failed to delete client");
      }
    } catch (err) {
      toast.error("Error deleting client");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="secondary" 
      onClick={handleDelete} 
      disabled={loading}
      className="text-red-500 hover:text-red-700 hover:bg-red-50"
    >
      {loading ? "Deleting..." : "Delete Client"}
    </Button>
  );
}
