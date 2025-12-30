import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatCard';
import axios from 'axios';
import { formatCurrency } from '@/lib/mockData';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface TaxReturn {
  id: number;
  clientName: string;
  taxYear: string;
  status: 'submitted' | 'in_review' | 'APPROVED' | 'REJECTED' | 'OBJECTION';
  fbrStatus: 'submitted' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'OBJECTION';
  totalTax: number;
  lastUpdated?: string;
}

const Decision = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/fbr/decision/returns');
        console.log(res.data)
        setReturns(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch returns.');
      } finally {
        setLoading(false);
      }
    };
    fetchReturns();
  }, []);

  const handleDecision = async (id: number, decision: 'APPROVED' | 'REJECTED' | 'OBJECTION') => {
    try {
      setProcessingId(id);
      await axios.post(`http://localhost:5000/api/fbr/decision/${id}`, { decision });
      // Update frontend state
      setReturns(prev =>
        prev.map(r => (r.id === id ? { ...r, status: decision } : r))
      );
    } catch (err) {
      console.error(err);
      alert('Failed to submit decision.');
    } finally {
      setProcessingId(null);
    }
  };

  const getDecisionIcon = (status: string) => {
    console.log(status)
    switch (status) {
      case 'APPROVED': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'REJECTED': return <XCircle className="w-4 h-4 text-destructive" />;
      case 'OBJECTION': return <AlertTriangle className="w-4 h-4 text-warning" />;
      default: return null;
    }
  };

  if (loading) return <DashboardLayout title="Final Approval"><div className="text-center py-20">Loading...</div></DashboardLayout>;
  if (error) return <DashboardLayout title="Final Approval"><div className="text-center py-20 text-destructive">{error}</div></DashboardLayout>;

  return (
    <DashboardLayout title="Final Approval" subtitle="Approve, Reject, or raise Objection on tax returns">
      <div className="space-y-4">
        {returns.map(r => (
          <Card key={r.id} className="flex justify-between items-center p-4">
            <div>
              <p className="font-medium">{r.clientName}</p>
              <p className="text-sm text-muted-foreground">{r.id} • Tax Year {r.taxYear}</p>
              <p className="text-sm">Tax Payable: {formatCurrency(r.totalTax)}</p>
              <div className="flex items-center gap-2 mt-1">
                {getDecisionIcon(r.fbrStatus)}
                <StatusBadge status={r.fbrStatus.toLowerCase()} />
              </div>
            </div>
            <div className="flex gap-2">
              {r.fbrStatus === 'SUBMITTED' || r.fbrStatus === 'UNDER_REVIEW' ? (
                <>
                  <Button
                    size="sm"
                    disabled={processingId === r.id}
                    onClick={() => handleDecision(r.id, 'APPROVED')}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={processingId === r.id}
                    onClick={() => handleDecision(r.id, 'REJECTED')}
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={processingId === r.id}
                    onClick={() => handleDecision(r.id, 'OBJECTION')}
                  >
                    Objection
                  </Button>
                </>
              ) : (
                <span className="text-muted-foreground">Decision finalized</span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Decision;
