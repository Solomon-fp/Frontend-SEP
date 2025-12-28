import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard, StatusBadge } from "@/components/shared/StatCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, ClipboardCheck, MessageSquare, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import axios from "axios";
import { formatCurrency } from "@/lib/mockData";

const EmployeeDashboard = () => {
  const api_url = "http://localhost:5000/api/dashboard";
  const [stats, setStats] = useState<any>(null);
  const [returns, setReturns] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, returnsRes, requestsRes] = await Promise.all([
          axios.get(api_url),
          axios.get(`${api_url}/verify`),
          axios.get(`${api_url}/requests`),
        ]);

        console.log(statsRes.data)
        console.log(returnsRes.data)
        console.log(requestsRes.data)
        setStats(statsRes.data);
        setReturns(returnsRes.data);
        setRequests(requestsRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  const statCards = [
    { title: "Total Clients", value: stats.totalClients, subtitle: "Active", icon: Users },
    { title: "Pending Verification", value: stats.pendingVerification, subtitle: "Returns", icon: ClipboardCheck, variant: "accent" as const },
    { title: "Under Review", value: stats.underReview, subtitle: "In progress", icon: Clock },
    { title: "Info Requests", value: stats.infoRequests, subtitle: "Pending", icon: MessageSquare },
  ];

  console.log(statCards)

  return (
    <DashboardLayout title="Employee Dashboard" subtitle="Tax filing operations overview">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map(stat => <StatCard key={stat.title} {...stat} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Verifications */}
          <Card className="card-elevated overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between">
              <h3 className="font-semibold">Pending Verifications</h3>
              <Link to="/employee/verify">
                <Button variant="outline" size="sm">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="divide-y divide-border">
              {returns.map(r => (
                <Link key={r.id} to={`/employee/verify/${r.id}`} className="flex items-center justify-between p-4 hover:bg-secondary/50">
                  <div>
                    <p className="font-medium">{r.clientName}</p>
                    <p className="text-sm text-muted-foreground">Tax Year {r.taxYear}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:block text-right">
                      <p className="font-medium">{formatCurrency(r.totalIncome)}</p>
                      <p className="text-sm text-muted-foreground">Income</p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          {/* Info Requests */}
          <Card className="card-elevated overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="font-semibold">Information Requests</h3>
            </div>

            <div className="divide-y divide-border">
              {requests.map(req => (
                <div key={req.id} className="flex justify-between p-4">
                  <div>
                    <p className="font-medium">{req.subject}</p>
                    <p className="text-sm text-muted-foreground">{req.clientName}</p>
                  </div>
                  <StatusBadge status={req.status} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="card-elevated p-6">
            <h3 className="font-semibold mb-4">Today's Summary</h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-success/10 p-3 rounded-lg">
                <CheckCircle className="w-5 h-5 text-success" />
                <p className="font-medium">Returns Verified</p>
              </div>

              <div className="flex items-center gap-3 bg-warning/10 p-3 rounded-lg">
                <Clock className="w-5 h-5 text-warning" />
                <p className="font-medium">Pending Actions</p>
              </div>

              <div className="flex items-center gap-3 bg-info/10 p-3 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-info" />
                <p className="font-medium">High Priority</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
