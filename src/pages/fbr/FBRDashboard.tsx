import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard, StatusBadge } from '@/components/shared/StatCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Eye,
  Clock,
  BarChart3,
} from 'lucide-react';
import { formatCurrency } from '@/lib/mockData';

interface TaxReturn {
  id: number;
  clientName: string;
  taxYear: string;
  status: 'submitted' | 'under_review' | 'APPROVED' | 'REJECTED' | 'OBJECTION';
  totalTax: number;
  lastUpdated?: string;
}

interface Decision {
  id: string;
  returnId: string;
  client: string;
  decision: 'approved' | 'rejected' | 'objection';
  date: string;
  amount: number;
}

const FBRDashboard = () => {
  const [taxReturns, setTaxReturns] = useState<TaxReturn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/fbr/dashboard/returns');
        const formatted = res.data.map(r => ({
          ...r,
          totalTax: Number(r.totalTax),
        }));

        setTaxReturns(formatted);

      } catch (err) {
        console.error(err);
        setError('Failed to fetch tax returns.');
      } finally {
        setLoading(false);
      }
    };

    fetchReturns();
  }, []);

  const submittedReturns = taxReturns.filter(r =>
    r.status === 'submitted' || r.status === 'under_review'
  );
  const approvedReturns = taxReturns.filter(r => r.status === 'APPROVED');
  const rejectedReturns = taxReturns.filter(r => r.status === 'REJECTED');
  const objectionReturns = taxReturns.filter(r => r.status === 'OBJECTION');

  const stats = [
    {
      title: 'Pending Review',
      value: submittedReturns.length,
      subtitle: 'Awaiting decision',
      icon: Clock,
      variant: 'primary' as const,
    },
    {
      title: 'Approved',
      value: approvedReturns.length,
      subtitle: 'This quarter',
      icon: CheckCircle,
      variant: 'success' as const,
    },
    {
      title: 'Rejected',
      value: rejectedReturns.length,
      subtitle: 'This quarter',
      icon: XCircle,
    },
    {
      title: 'Objections',
      value: objectionReturns.length,
      subtitle: 'Raised',
      icon: AlertTriangle,
      variant: 'warning' as const,
    },
  ];

  const recentDecisions: Decision[] = taxReturns
    .filter(r => ['APPROVED', 'REJECTED', 'OBJECTION'].includes(r.status))
    .sort((a, b) => (b.lastUpdated || '').localeCompare(a.lastUpdated || ''))
    .slice(0, 4)
    .map(r => ({
      id: r.id.toString(),
      returnId: `TR-${r.id}`,
      client: r.clientName,
      decision: r.status.toLowerCase() as 'approved' | 'rejected' | 'objection',
      date: r.lastUpdated?.split('T')[0] || '',
      amount: Number(r.totalTax),
    }));

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-destructive" />;
      case 'objection':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="FBR Officer Dashboard" subtitle="Tax return review and decisions">
        <div className="text-center py-20 text-muted-foreground">Loading dashboard data...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="FBR Officer Dashboard" subtitle="Tax return review and decisions">
        <div className="text-center py-20 text-destructive">{error}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="FBR Officer Dashboard" subtitle="Tax return review and decisions">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={stat.title} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Returns */}
          <Card className="card-elevated overflow-hidden">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Returns Awaiting Review</h3>
                  <p className="text-sm text-muted-foreground">Take action on submitted returns</p>
                </div>
                <Link to="/fbr/returns">
                  <Button variant="outline" size="sm">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="divide-y divide-border">
              {submittedReturns.map(taxReturn => (
                <div key={taxReturn.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                      {taxReturn.clientName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium">{taxReturn.clientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {taxReturn.id} • Tax Year {taxReturn.taxYear}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="font-medium">{formatCurrency(taxReturn.totalTax)}</p>
                      <p className="text-sm text-muted-foreground">Tax Payable</p>
                    </div>
                    <Link to={`/fbr/review/${taxReturn.id}`}>
                      <Button size="sm">
                        <Eye className="w-4 h-4 mr-1" /> Review
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Decisions */}
          <Card className="card-elevated overflow-hidden">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Recent Decisions</h3>
                  <p className="text-sm text-muted-foreground">Your decision history</p>
                </div>
                <Link to="/fbr/decisions">
                  <Button variant="outline" size="sm">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Return ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Client</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Decision</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentDecisions.map(decision => (
                    <tr key={decision.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium">{decision.returnId}</td>
                      <td className="px-4 py-3 text-sm">{decision.client}</td>
                      <td className="px-4 py-3 text-sm">{formatCurrency(decision.amount)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getDecisionIcon(decision.decision)}
                          <StatusBadge status={decision.decision} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{decision.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="card-elevated p-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Quarterly Statistics</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-success/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Approval Rate</span>
                  <span className="text-2xl font-bold text-success">78%</span>
                </div>
                <div className="w-full h-2 bg-success/20 rounded-full">
                  <div className="w-[78%] h-full bg-success rounded-full" />
                </div>
              </div>
              <div className="p-4 rounded-lg bg-secondary">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg Review Time</span>
                  <span className="text-xl font-bold">3.2 days</span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-secondary">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Revenue</span>
                  <span className="text-xl font-bold">{formatCurrency(45600000)}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="card-elevated p-6">
            <h3 className="font-semibold mb-4">Priority Queue</h3>
            <div className="space-y-3">
              {taxReturns
                .filter(r => r.totalTax > 100000)
                .slice(0, 3)
                .map(taxReturn => (
                  <Link
                    key={taxReturn.id}
                    to={`/fbr/review/${taxReturn.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-warning/10 hover:bg-warning/20 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-warning/20 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-warning" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{taxReturn.clientName}</p>
                      <p className="text-xs text-muted-foreground">{formatCurrency(taxReturn.totalTax)}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FBRDashboard;
