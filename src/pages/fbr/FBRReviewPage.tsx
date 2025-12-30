import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatCard";
import { formatCurrency } from "@/lib/mockData";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const FBRReviewPage = () => {
  const { returnId } = useParams();
  const [taxReturns, setTaxReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  // Fetch all tax returns
  useEffect(() => {
    const fetchReturns = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/fbr/dashboard/returns");
        setTaxReturns(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReturns();
  }, [returnId]);

  // Handle Approve / Reject / Objection
  const handleDecision = async (id: number, decision: "APPROVED" | "REJECTED" | "OBJECTION") => {
    try {
      setProcessingId(id);
      await axios.post(`http://localhost:5000/api/fbr/returns/${id}/decision`, { decision });
      // Refresh data
      const res = await axios.get("http://localhost:5000/api/fbr/dashboard/returns");
      setTaxReturns(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <p className="text-center py-10">Loading tax returns...</p>;

  if (!taxReturns.length)
    return <p className="text-center py-10 text-muted-foreground">No tax returns found.</p>;

  return (
    <DashboardLayout title="Review Returns">
    <div className="space-y-6">
      {taxReturns.map((taxReturn) => (
        <Card key={taxReturn.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold">{taxReturn.clientName}</h2>
            <p className="text-sm text-muted-foreground">
              Return ID: {taxReturn.id} • Tax Year: {taxReturn.taxYear}
            </p>
            <p className="text-sm">Total Income: {formatCurrency(taxReturn.totalIncome)}</p>
            <p className="text-sm">Tax Payable: {formatCurrency(taxReturn.totalTax)}</p>
            <div className="mt-2">
              <StatusBadge status={taxReturn.fbrStatus.toLowerCase()} /> 
            </div>
          </div>
          <div className="flex gap-2 flex-wrap mt-4 md:mt-0">
            <Button
              size="sm"
              disabled={processingId === taxReturn.id}
              onClick={() => handleDecision(taxReturn.id, "APPROVED")}
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              disabled={processingId === taxReturn.id}
              onClick={() => handleDecision(taxReturn.id, "REJECTED")}
            >
              Reject
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={processingId === taxReturn.id}
              onClick={() => handleDecision(taxReturn.id, "OBJECTION")}
            >
              Objection
            </Button>
          </div>
        </Card>
      ))}
    </div>
    </DashboardLayout>
  );
};

export default FBRReviewPage;
