import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, TimelineItem } from "@/components/shared/StatCard";
import { formatCurrency } from "@/lib/mockData";
import axios from "axios";

interface TaxReturn {
  id: string;
  clientName: string;
  taxYear: string;
  totalIncome: number;
  status: "APPROVED" | "FINAL_APPROVED" | "IN_REVIEW" | "SUBMITTED";
}

const FinalApprovalPage = () => {
  const [returns, setReturns] = useState<TaxReturn[]>([]);
  const [loading, setLoading] = useState(true);

  const api_url = "http://localhost:5000/api";

  useEffect(() => {
    const fetchFinalApprovals = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${api_url}/final-approval`);
        setReturns(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFinalApprovals();
  }, []);

  const approveFinal = async (id: string) => {
    try {
      await axios.put(`${api_url}/verify/${id}/final-approve`);
      setReturns(prev =>
        prev.map(r => (r.id === id ? { ...r, status: "FINAL_APPROVED" } : r))
      );
      // Optionally: notify client
      await axios.post(`http://localhost:5000/api/notifications`, {
        title: "Return Approved",
        message: "Your tax return has been approved by FBR.",
        type: "SUCCESS",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const getTimelineSteps = (r: TaxReturn) => [
    { title: "Return Created", status: "completed" as const },
    { title: "Documents Uploaded", status: "completed" as const },
    { title: "Verification", status: r.status === "APPROVED" || r.status === "FINAL_APPROVED" ? "completed" : "current" as const },
    { title: "Final Approval", status: r.status === "FINAL_APPROVED" ? "completed" : "current" as const },
  ];

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <DashboardLayout title="Final Approvals" subtitle="Approve client returns">
      {returns.length === 0 && <p className="p-6 text-muted-foreground">No returns pending final approval.</p>}

      {returns.map(r => (
        <Card key={r.id} className="p-6 mb-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="font-medium">{r.clientName}</p>
              <p className="text-sm text-muted-foreground">Tax Year {r.taxYear}</p>
              <StatusBadge status={r.status} />
            </div>
            {r.status !== "FINAL_APPROVED" && (
              <Button onClick={() => approveFinal(r.id)}>Approve Final</Button>
            )}
          </div>

          {/* Timeline */}
          <div className="mt-2 space-y-1">
            {getTimelineSteps(r).map((step, idx) => (
              <TimelineItem key={idx} {...step} isLast={idx === 3} />
            ))}
          </div>
        </Card>
      ))}
    </DashboardLayout>
  );
};

export default FinalApprovalPage;
