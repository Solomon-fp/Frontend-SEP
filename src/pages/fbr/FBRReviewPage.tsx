import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatusBadge } from '@/components/shared/StatCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Download,
  User,
  Calendar,
  DollarSign,
  Building,
} from 'lucide-react';
import { mockTaxReturns, formatCurrency } from '@/lib/mockData';

const FBRReviewPage = () => {
  const { returnId } = useParams();
  const [decision, setDecision] = useState<'approve' | 'reject' | 'objection' | null>(null);
  const [remarks, setRemarks] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const taxReturn = mockTaxReturns.find(r => r.id === returnId) || mockTaxReturns[0];

  const clientDetails = {
    name: taxReturn.clientName,
    cnic: '35201-1234567-8',
    email: 'client@email.com',
    phone: '+92 300 1234567',
    ntn: 'NTN-12345678',
    address: 'House 123, Street 45, Islamabad',
  };

  const incomeBreakdown = [
    { category: 'Salary Income', amount: 1800000 },
    { category: 'Business Income', amount: 500000 },
    { category: 'Rental Income', amount: 200000 },
  ];

  const deductionsBreakdown = [
    { category: 'Zakat Paid', amount: 45000 },
    { category: 'Donations', amount: 30000 },
    { category: 'Insurance Premium', amount: 25000 },
  ];

  const documents = [
    { name: 'Salary Certificate.pdf', size: '2.3 MB' },
    { name: 'Bank Statement.pdf', size: '4.1 MB' },
    { name: 'Investment Proof.pdf', size: '1.8 MB' },
    { name: 'Zakat Receipt.pdf', size: '0.5 MB' },
  ];

  const handleDecision = (type: 'approve' | 'reject' | 'objection') => {
    setDecision(type);
    setShowConfirm(true);
  };

  const confirmDecision = () => {
    // In real app, this would submit the decision
    setShowConfirm(false);
    // Navigate back or show success
  };

  return (
    <DashboardLayout title="Review Tax Return" subtitle={`Return ID: ${taxReturn.id}`}>
      {/* Back Button */}
      <Link to="/fbr/returns" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Returns
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Information */}
          <Card className="card-elevated p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Client Information</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{clientDetails.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CNIC</p>
                <p className="font-medium">{clientDetails.cnic}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">NTN</p>
                <p className="font-medium">{clientDetails.ntn}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{clientDetails.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{clientDetails.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{clientDetails.address}</p>
              </div>
            </div>
          </Card>

          {/* Income Breakdown */}
          <Card className="card-elevated p-6">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Income Breakdown</h2>
            </div>
            <div className="space-y-3">
              {incomeBreakdown.map((item) => (
                <div key={item.category} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <span>{item.category}</span>
                  <span className="font-medium">{formatCurrency(item.amount)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border-2 border-primary">
                <span className="font-semibold">Total Income</span>
                <span className="text-xl font-bold text-primary">{formatCurrency(taxReturn.totalIncome)}</span>
              </div>
            </div>
          </Card>

          {/* Deductions */}
          <Card className="card-elevated p-6">
            <div className="flex items-center gap-3 mb-6">
              <Building className="w-5 h-5 text-success" />
              <h2 className="text-lg font-semibold">Deductions Claimed</h2>
            </div>
            <div className="space-y-3">
              {deductionsBreakdown.map((item) => (
                <div key={item.category} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <span>{item.category}</span>
                  <span className="font-medium text-success">-{formatCurrency(item.amount)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg">
                <span className="font-semibold">Total Deductions</span>
                <span className="text-xl font-bold text-success">-{formatCurrency(100000)}</span>
              </div>
            </div>
          </Card>

          {/* Documents */}
          <Card className="card-elevated p-6">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Attached Documents</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.size}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar - Decision Panel */}
        <div className="space-y-6">
          {/* Summary */}
          <Card className="card-elevated p-6">
            <h3 className="font-semibold mb-4">Return Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-muted-foreground">Tax Year</span>
                <span className="font-medium">{taxReturn.taxYear}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-muted-foreground">Submitted</span>
                <span className="font-medium">{taxReturn.submittedDate}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-muted-foreground">Total Income</span>
                <span className="font-medium">{formatCurrency(taxReturn.totalIncome)}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-muted-foreground">Taxable Income</span>
                <span className="font-medium">{formatCurrency(taxReturn.totalIncome - 100000)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tax Payable</span>
                <span className="text-xl font-bold text-primary">{formatCurrency(taxReturn.totalTax)}</span>
              </div>
            </div>
          </Card>

          {/* Decision Actions */}
          <Card className="card-elevated p-6">
            <h3 className="font-semibold mb-4">Take Action</h3>
            <div className="space-y-3">
              <Button
                className="w-full justify-start bg-success hover:bg-success/90"
                onClick={() => handleDecision('approve')}
              >
                <CheckCircle className="w-4 h-4 mr-3" />
                Approve Return
              </Button>
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={() => handleDecision('reject')}
              >
                <XCircle className="w-4 h-4 mr-3" />
                Reject Return
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-warning text-warning hover:bg-warning/10"
                onClick={() => handleDecision('objection')}
              >
                <AlertTriangle className="w-4 h-4 mr-3" />
                Raise Objection
              </Button>
            </div>
          </Card>

          {/* Current Status */}
          <Card className="card-elevated p-6">
            <h3 className="font-semibold mb-4">Current Status</h3>
            <div className="flex items-center gap-3">
              <StatusBadge status={taxReturn.status} />
              <span className="text-sm text-muted-foreground">
                Last updated: {taxReturn.lastUpdated}
              </span>
            </div>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {decision === 'approve' && 'Approve Tax Return'}
              {decision === 'reject' && 'Reject Tax Return'}
              {decision === 'objection' && 'Raise Objection'}
            </DialogTitle>
            <DialogDescription>
              {decision === 'approve' && 'This will approve the tax return and notify the taxpayer.'}
              {decision === 'reject' && 'This will reject the tax return. Please provide a reason.'}
              {decision === 'objection' && 'This will raise an objection and request clarification.'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="remarks">Remarks (Optional)</Label>
            <Textarea
              id="remarks"
              placeholder="Enter your remarks or reason..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="mt-2"
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmDecision}
              className={
                decision === 'approve' ? 'bg-success hover:bg-success/90' :
                decision === 'reject' ? 'bg-destructive' :
                'bg-warning hover:bg-warning/90'
              }
            >
              Confirm {decision === 'approve' ? 'Approval' : decision === 'reject' ? 'Rejection' : 'Objection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default FBRReviewPage;
