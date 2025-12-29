import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatCard';
import { CreditCard, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Bill {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
}

const formatCurrency = (n: number) => `Rs ${n.toLocaleString()}`;

export default function BillingPage() {
  const { user } = useAuth();
  const [bills, setBills] = useState<Bill[]>([]);

  useEffect(() => {
  const fetchBills = async () => {
    const res = await fetch(`http://localhost:5000/api/billing/client?clientId=${user.id}`);
    const data = await res.json();
    setBills(data);
  };

  fetchBills();
}, []);


  const payNow = async (id: string) => {
    await fetch(`http://localhost:5000/api/billing/${id}/pay`, {
      method: 'POST',
    });

    setBills(b =>
      b.map(i => (i.id === id ? { ...i, status: 'PAID' } : i))
    );
  };

  const pending = bills.filter(b => b.status === 'PENDING');
  const paid = bills.filter(b => b.status === 'PAID');

  return (
    <DashboardLayout title="Billing & Payments">
      {/* SUMMARY */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <Clock className="text-warning mb-2" />
          <p>Pending</p>
          <h2 className="text-2xl font-bold">
            {formatCurrency(pending.reduce((s, b) => s + b.amount, 0))}
          </h2>
        </Card>

        <Card className="p-6">
          <CheckCircle className="text-success mb-2" />
          <p>Paid</p>
          <h2 className="text-2xl font-bold">
            {formatCurrency(paid.reduce((s, b) => s + b.amount, 0))}
          </h2>
        </Card>

        <Card className="p-6">
          <CreditCard className="text-primary mb-2" />
          <p>Total Invoices</p>
          <h2 className="text-2xl font-bold">{bills.length}</h2>
        </Card>
      </div>

      {/* PENDING BILLS */}
      {pending.map(bill => (
        <Card key={bill.id} className="p-6 mb-4 border-l-4 border-warning">
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold">{bill.description}</h3>
              <p className="text-sm">Due: {bill.dueDate}</p>
              <StatusBadge status={bill.status} />
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold">
                {formatCurrency(bill.amount)}
              </h2>
              <Button onClick={() => payNow(bill.id)}>Pay Now</Button>
            </div>
          </div>
        </Card>
      ))}

      {/* HISTORY */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Payment History</h3>
        {bills.map(bill => (
          <div key={bill.id} className="flex justify-between border-b py-2">
            <span>{bill.description}</span>
            <span>{formatCurrency(bill.amount)}</span>
            <StatusBadge status={bill.status} />
          </div>
        ))}
      </Card>
    </DashboardLayout>
  );
}
