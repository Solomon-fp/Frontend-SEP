import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatCard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import axios from "axios";

interface TaxReturn {
  id: string;
  clientName: string;
  taxYear: string;
  status: string;
  totalIncome: number;
  documents: { name: string; url: string }[];
}

export default function VerificationPage() {
  const [returns, setReturns] = useState<TaxReturn[]>([]);
  const [search, setSearch] = useState("");

  const fetchReturns = async (query: string = "") => {
    try {
      const res = await axios.get(`http://localhost:5000/api/verify`, {
        params: { search: query },
      });
      setReturns(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchReturns(search);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const verifyReturn = async (id: string, status: string) => {
    try {
      await axios.put(`http://localhost:5000/api/verify/${id}/verify`, { status });
      fetchReturns(search);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout title="Verification">
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Verification Requests</h1>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by client, year, or status..."
          className="w-full p-2 border rounded-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Verification List */}
        {returns.map((r) => (
          <Card
            key={r.id}
            className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <div className="flex-1 space-y-2">
              <p className="font-medium">{r.clientName}</p>
              <p className="text-sm text-muted-foreground">Tax Year {r.taxYear}</p>
              <StatusBadge status={r.status} />

              <div className="text-sm text-muted-foreground space-y-1 mt-2">
                <p>Total Income: {r.totalIncome}</p>
              </div>

              {/* Documents */}
              {r.documents?.length > 0 && (
                <div className="mt-2 space-y-1">
                  <p className="font-medium">Documents:</p>
                  <ul className="list-disc ml-5 text-sm">
                    {r.documents.map((doc, idx) => (
                      <li key={idx}>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {doc.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Approve / Reject */}
            <div className="flex gap-2 mt-2 md:mt-0">
              {r.status === "APPROVED" || r.status === "REJECTED" ? (
                <span className="font-medium">{r.status}</span>
              ) : (
                <>
                  <Button size="sm" onClick={() => verifyReturn(r.id, "approved")}>
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => verifyReturn(r.id, "rejected")}
                  >
                    Reject
                  </Button>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
