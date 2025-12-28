import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard, StatusBadge } from '@/components/shared/StatCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Eye,
  Clock,
  BarChart3,
} from 'lucide-react';
import { mockTaxReturns, formatCurrency } from '@/lib/mockData';

const FBRDashboard = () => {
  const submittedReturns = mockTaxReturns.filter(r => 
    r.status === 'submitted' || r.status === 'under_review'
  );
  const approvedReturns = mockTaxReturns.filter(r => r.status === 'approved');
  const rejectedReturns = mockTaxReturns.filter(r => r.status === 'rejected');
  const objectionReturns = mockTaxReturns.filter(r => r.status === 'objection');

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

  const recentDecisions = [
    { id: 'D-001', returnId: 'TR-2024-002', client: 'Fatima Zahra', decision: 'approved', date: '2024-12-18', amount: 90000 },
    { id: 'D-002', returnId: 'TR-2024-005', client: 'Bilal Ahmed', decision: 'rejected', date: '2024-12-17', amount: 45000 },
    { id: 'D-003', returnId: 'TR-2024-004', client: 'Aisha Malik', decision: 'objection', date: '2024-12-16', amount: 280000 },
    { id: 'D-004', returnId: 'TR-2024-006', client: 'Hassan Shah', decision: 'approved', date: '2024-12-15', amount: 156000 },
  ];

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-destructive" />;
      case 'objection': return <AlertTriangle className="w-4 h-4 text-warning" />;
      default: return null;
    }
  };

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
              {submittedReturns.map((taxReturn) => (
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

          {/* Decision Log */}
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
                  {recentDecisions.map((decision) => (
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
          {/* Statistics */}
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

          {/* Priority Queue */}
          <Card className="card-elevated p-6">
            <h3 className="font-semibold mb-4">Priority Queue</h3>
            <div className="space-y-3">
              {mockTaxReturns
                .filter(r => r.totalTax > 100000)
                .slice(0, 3)
                .map((taxReturn) => (
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
