import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatusBadge } from '@/components/shared/StatCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  FileText,
  Plus,
  Download,
  Eye,
  ArrowRight,
} from 'lucide-react';
import { mockTaxReturns, formatCurrency } from '@/lib/mockData';

const TaxReturnsListPage = () => {
  const [clientReturns, setReturns] = useState([])
  const {user} = useAuth();

  useEffect(() => {
  const fetchReturns = async () => {
    if (!user?.id) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/client/dashboard/returns?clientId=${user.id}`
      );

      if (!res.ok) {
        throw new Error('Failed to fetch returns');
      }

      const data = await res.json();

      setReturns(
        data.map((r: any) => ({
          ...r,
          totalIncome: r.totalIncome ? Number(r.totalIncome) : 0,
          totalTax: r.totalTax ? Number(r.totalTax) : 0,
        }))
      );
    } catch (error) {
      console.error('Error fetching tax returns:', error);
      setReturns([]);
    }
  };

  fetchReturns();
}, [user]);

  return (
    <DashboardLayout title="Tax Returns" subtitle="Manage your tax filings">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-muted-foreground">
            You have {clientReturns.length} tax returns on file
          </p>
        </div>
        <Link to="/client/tax-return/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" /> File New Return
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {clientReturns.map((taxReturn) => (
          <Card key={taxReturn.id} className="card-elevated p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">Tax Year {taxReturn.taxYear}</h3>
                    <StatusBadge status={taxReturn.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {taxReturn.submittedDate ? `Submitted: ${taxReturn.submittedDate}` : 'Not submitted'} • {taxReturn.documents} documents
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right hidden md:block">
                  <p className="text-sm text-muted-foreground">Total Income</p>
                  <p className="font-semibold">{formatCurrency(taxReturn.totalIncome)}</p>
                </div>
                <div className="text-right hidden md:block">
                  <p className="text-sm text-muted-foreground">Tax Payable</p>
                  <p className="font-semibold text-primary">{formatCurrency(taxReturn.totalTax)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/client/tax-return/${taxReturn.taxYear}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" /> View
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default TaxReturnsListPage;
