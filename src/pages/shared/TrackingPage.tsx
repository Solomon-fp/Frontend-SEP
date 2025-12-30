import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatusBadge, TimelineItem } from '@/components/shared/StatCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Download, Share2, Clock, Search } from 'lucide-react';
import { formatCurrency } from '@/lib/mockData';

type FBRStatusFinal = 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'OBJECTION';

const TrackingPage = () => {
  const { returnId } = useParams();
  const navigate = useNavigate();

  const [searchId, setSearchId] = useState(returnId || '');
  const [taxReturn, setTaxReturn] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchReturn = async (id: string) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/client/returns?returnId=${id}`);
      const data = await res.json();
      const result = Array.isArray(data) ? data[0] : data;
      setTaxReturn(result || null);
    } catch (err) {
      console.error(err);
      setTaxReturn(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (returnId) fetchReturn(returnId);
  }, [returnId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId) return;
    navigate(`/tracking/${searchId}`);
    fetchReturn(searchId);
  };

  /* ===============================
     Build timeline based on FBR status
  =============================== */
  const getTimelineSteps = (fbrStatus: FBRStatusFinal | null) => {
    switch (fbrStatus) {
      case 'APPROVED':
        return [
          { title: 'Return Created', description: 'Tax return initiated', date: 'Completed', status: 'completed' },
          { title: 'Documents Uploaded', description: 'Client uploaded documents', date: 'Completed', status: 'completed' },
          { title: 'Verification', description: 'Under review', date: 'Completed', status: 'completed' },
          { title: 'Submitted to FBR', description: 'Submitted for review', date: 'Completed', status: 'completed' },
          { title: 'Approved', description: 'Final approval by FBR', date: 'Completed', status: 'completed' },
        ];
      case 'REJECTED':
        return [
          { title: 'Return Created', description: 'Tax return initiated', date: 'Completed', status: 'completed' },
          { title: 'Documents Uploaded', description: 'Client uploaded documents', date: 'Completed', status: 'completed' },
          { title: 'Verification', description: 'Under review', date: 'Completed', status: 'completed' },
          { title: 'Submitted to FBR', description: 'Submitted for review', date: 'Completed', status: 'completed' },
          { title: 'Rejected', description: 'Return rejected by FBR', date: 'Completed', status: 'completed' },
        ];
      case 'OBJECTION':
        return [
          { title: 'Return Created', description: 'Tax return initiated', date: 'Completed', status: 'completed' },
          { title: 'Documents Uploaded', description: 'Client uploaded documents', date: 'Completed', status: 'completed' },
          { title: 'Verification', description: 'Under review', date: 'Completed', status: 'completed' },
          { title: 'Submitted to FBR', description: 'Submitted for review', date: 'Completed', status: 'completed' },
          { title: 'Objection Raised', description: 'FBR raised objection', date: 'Completed', status: 'completed' },
        ];
      default:
        return [
          { title: 'Return Created', description: 'Tax return initiated', date: 'Completed', status: 'completed' },
          { title: 'Documents Uploaded', description: 'Client uploaded documents', date: 'Completed', status: 'completed' },
          { title: 'Verification', description: 'Under review', date: 'In Progress', status: 'current' },
          { title: 'Submitted to FBR', description: 'Pending Approval', date: 'Pending', status: 'pending' },
          { title: 'Approved', description: 'Final approval', date: 'Pending', status: 'pending' },
        ];
    }
  };

  const timelineSteps = taxReturn ? getTimelineSteps(taxReturn.fbrStatus) : [];

  return (
    <DashboardLayout title="Track Filing Status" subtitle="Monitor your tax return progress">
      {/* SEARCH */}
      <Card className="card-elevated p-6 mb-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Enter Return ID (e.g., TR-2024-001)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="pl-12 h-12"
            />
          </div>
          <Button type="submit" size="lg">Track Return</Button>
        </form>
      </Card>

      {/* LOADING */}
      {loading && (
        <Card className="p-10 text-center">
          <p className="text-muted-foreground">Loading return details...</p>
        </Card>
      )}

      {/* DATA FOUND */}
      {taxReturn && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* TIMELINE */}
          <div className="lg:col-span-2">
            <Card className="card-elevated p-6">
              <div className="flex justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Filing Timeline</h2>
                  <p className="text-muted-foreground">
  Return ID: {`TR-${taxReturn.taxYear}-${taxReturn.clientId}`}
</p>

                </div>
                <StatusBadge status={taxReturn.fbrStatus} />
              </div>

              {timelineSteps.map((step, index) => (
                <TimelineItem key={index} {...step} isLast={index === timelineSteps.length - 1} />
              ))}
            </Card>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            <Card className="card-elevated p-6">
              <h3 className="font-semibold mb-4">Return Summary</h3>
              <div className="space-y-3">
                <Row label="Tax Year" value={taxReturn.taxYear} />
                <Row label="Client Name" value={taxReturn.clientName} />
                <Row label="Total Income" value={formatCurrency(taxReturn.totalIncome)} />
                <Row label="Tax Payable" value={formatCurrency(taxReturn.totalTax)} />
                <Row label="Documents" value={`${taxReturn.documents} files`} />
                <Row label="Employee Status" value={taxReturn.status} />
                <Row label="FBR Status" value={taxReturn.fbrStatus || 'Pending'} />
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* NO DATA */}
      {!taxReturn && !loading && (
        <Card className="card-elevated p-12 text-center">
          <Search className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
          <h3 className="text-xl font-semibold">No return found</h3>
          <p className="text-muted-foreground">Please check the Return ID and try again.</p>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default TrackingPage;

/* ===============================
   SMALL HELPER COMPONENT
=============================== */
const Row = ({ label, value }: { label: string; value: any }) => (
  <div className="flex justify-between border-b pb-2">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);
