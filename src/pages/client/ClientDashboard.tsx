import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard, StatusBadge, TimelineItem } from '@/components/shared/StatCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import {
  FileText,
  CreditCard,
  Clock,
  CheckCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  Search,
} from 'lucide-react';
import { formatCurrency } from '@/lib/mockData';

const ClientDashboard = () => {
  const { user } = useAuth();
  const CLIENT_ID = user.id;

  const [returns, setReturns] = useState<any[]>([]);
  const [filteredReturns, setFilteredReturns] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  // ===============================
  // FETCH RETURNS
  // ===============================
  useEffect(() => {
    const fetchReturns = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5000/api/client/dashboard/returns');
        const data = await res.json();
        const clientReturns = data.filter((r: any) => Number(r.clientId) === Number(CLIENT_ID));
        setReturns(clientReturns);
        setFilteredReturns(clientReturns);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReturns();
  }, []);

  // ===============================
  // SEARCH FILTER
  // ===============================
  useEffect(() => {
    if (!search) {
      setFilteredReturns(returns);
      return;
    }

    setFilteredReturns(
      returns.filter(
        r =>
          r.id.toLowerCase().includes(search.toLowerCase()) ||
          r.taxYear.includes(search)
      )
    );
  }, [search, returns]);

  const latestReturn = returns[0];

  // ===============================
  // STATS
  // ===============================
  const stats = [
    {
      title: 'Total Filed',
      value: returns.length,
      subtitle: 'Tax returns',
      icon: FileText,
      variant: 'primary' as const,
    },
    {
      title: 'Under Review',
      value: returns.filter(
        r => r.status === 'IN_REVIEW' || r.status === 'APPROVED'
      ).length,
      subtitle: 'Returns',
      icon: Clock,
    },
    {
      title: 'Approved',
      value: returns.filter(r => r.status === 'APPROVED').length,
      subtitle: 'Returns',
      icon: CheckCircle,
    },
  ];

  // ===============================
  // FETCH NOTIFICATIONS
  // ===============================
  const fetchNotifications = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/notifications');
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // MARK NOTIFICATION AS READ
  const markAsRead = async (id: number) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: 'PUT',
      });
      setNotifications(n =>
        n.map((notif: any) =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const timelineSteps = [
    { title: 'Return Created', date: 'Completed', status: 'completed' as const },
    { title: 'Documents Uploaded', date: 'Completed', status: 'completed' as const },
    { title: 'Verification', date: 'In Progress', status: 'current' as const },
    { title: 'Final Approval', date: 'Pending', status: 'pending' as const },
  ];

  return (
    <DashboardLayout title="Dashboard" subtitle={`Welcome back, ${user.name}`}>
      {/* SEARCH BAR */}
      <Card className="p-5 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by Return ID or Tax Year"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-12 h-12"
          />
        </div>
      </Card>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SECTION */}
        <div className="lg:col-span-2 space-y-6">
          {/* ACTIONS */}
          <div className="grid md:grid-cols-2 gap-4">
            <ActionCard
              to="/client/tax-return/new"
              icon={<Plus />}
              title="File New Return"
              subtitle="Start tax filing"
            />
            <ActionCard
              to={latestReturn ? `/tracking/${latestReturn.id}` : '#'}
              icon={<TrendingUp />}
              title="Track Return"
              subtitle="Monitor filing status"
            />
          </div>

          {/* RECENT RETURNS */}
          <Card className="card-elevated">
            <div className="p-6 border-b">
              <h3 className="font-semibold">Recent Tax Returns</h3>
            </div>

            {loading ? (
              <p className="p-6 text-muted-foreground">Loading...</p>
            ) : (
              filteredReturns.slice(0, 5).map(r => (
                <Link
                  key={r.id}
                  to={`/tracking/${r.id}`}
                  className="flex items-center justify-between p-4 hover:bg-secondary/50"
                >
                  <div className="flex items-center gap-4">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Tax Year {r.taxYear}</p>
                      <p className="text-sm text-muted-foreground">{r.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="hidden sm:block font-medium">
                      {formatCurrency(r.totalTax)}
                    </span>
                    <StatusBadge status={r.status} />
                  </div>
                </Link>
              ))
            )}
          </Card>
        </div>

        {/* RIGHT SECTION */}
        <div className="space-y-6">
          {/* LATEST RETURN */}
          {latestReturn && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Latest Return Status</h3>
              <StatusBadge status={latestReturn.status} />
              <p className="text-2xl font-bold mt-2">
                {formatCurrency(latestReturn.totalTax)}
              </p>

              {timelineSteps.map((step, i) => (
                <TimelineItem
                  key={i}
                  {...step}
                  isLast={i === timelineSteps.length - 1}
                />
              ))}
            </Card>
          )}

          {/* NOTIFICATIONS PANEL */}
          {/* <Card className="p-6">
            <h3 className="font-semibold mb-4">Notifications</h3>
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground">No notifications</p>
            ) : (
              <ul className="space-y-2">
                {notifications.map(n => (
                  <li
                    key={n.id}
                    className={`p-2 rounded-md cursor-pointer ${
                      n.read ? 'bg-gray-100 text-gray-500' : 'bg-blue-50 text-black'
                    }`}
                    onClick={() => markAsRead(n.id)}
                  >
                    <strong>{n.title}:</strong> {n.message}
                    <span className="text-xs block mt-1 text-muted-foreground">
                      {n.createdAt}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card> */}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientDashboard;

/* ===============================
   REUSABLE ACTION CARD
   =============================== */
const ActionCard = ({ to, icon, title, subtitle }: any) => (
  <Card className="p-6 card-elevated group">
    <Link to={to} className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <ArrowRight className="w-5 h-5 text-muted-foreground" />
    </Link>
  </Card>
);
