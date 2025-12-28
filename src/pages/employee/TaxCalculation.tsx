import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calculator, Save } from "lucide-react";
import { formatCurrency } from "@/lib/mockData";

interface TaxReturn {
  id: string;
  clientName: string;
  taxYear: string;
}

const TaxCalculationPage = () => {
  const [returns, setReturns] = useState<TaxReturn[]>([]);
  const [selectedReturn, setSelectedReturn] = useState<string>("");

  const [tax, setTax] = useState({
    totalIncome: 0,
    exemptions: 0,
    taxableIncome: 0,
    taxRate: 5,
    grossTax: 0,
    taxCredits: 0,
    netTax: 0,
  });

  /* Fetch all returns */
  useEffect(() => {
    fetch("http://localhost:5000/api/calculation")
      .then(res => res.json())
      .then(data => setReturns(data));
  }, []);

  /* Fetch tax calculation for selected return */
  useEffect(() => {
    if (!selectedReturn) return;

    fetch(`http://localhost:5000/api/calculation/${selectedReturn}/tax`)
      .then(res => res.json())
      .then(data => setTax(data));
  }, [selectedReturn]);

  const recalculate = () => {
    const taxableIncome = tax.totalIncome - tax.exemptions;
    const grossTax = (taxableIncome * tax.taxRate) / 100;
    const netTax = grossTax - tax.taxCredits;

    setTax({
      ...tax,
      taxableIncome,
      grossTax,
      netTax,
    });
  };

  const saveCalculation = async () => {
    if (!selectedReturn) return alert("Select a return first");

    await fetch(`http://localhost:5000/api/calculation/${selectedReturn}/tax`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tax),
    });

    alert("Tax calculation saved");
  };

  return (
    <DashboardLayout title="Tax Calculation">
      <Link
        to="/employee/verify"
        className="inline-flex items-center gap-2 mb-6 text-muted-foreground"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      {/* Select Return */}
      <Card className="card-elevated p-6 mb-6">
        <Label>Select Tax Return</Label>
        <select
          className="w-full mt-2 p-2 border rounded-md"
          value={selectedReturn}
          onChange={(e) => setSelectedReturn(e.target.value)}
        >
          <option value="">-- Select Return --</option>
          {returns.map(r => (
            <option key={r.id} value={r.id}>
              {r.clientName} — {r.taxYear}
            </option>
          ))}
        </select>
      </Card>

      {selectedReturn && (
        <Card className="card-elevated p-6">
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Tax Calculation</h2>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Total Income</Label>
                <Input
                  type="number"
                  value={tax.totalIncome}
                  onChange={(e) =>
                    setTax({ ...tax, totalIncome: +e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Exemptions</Label>
                <Input
                  type="number"
                  value={tax.exemptions}
                  onChange={(e) =>
                    setTax({ ...tax, exemptions: +e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Taxable Income</Label>
                <Input value={formatCurrency(tax.taxableIncome)} disabled />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Tax Rate (%)</Label>
                <Input
                  type="number"
                  value={tax.taxRate}
                  onChange={(e) =>
                    setTax({ ...tax, taxRate: +e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Tax Credits</Label>
                <Input
                  type="number"
                  value={tax.taxCredits}
                  onChange={(e) =>
                    setTax({ ...tax, taxCredits: +e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Net Tax Payable</Label>
                <div className="p-3 bg-primary/10 border-2 border-primary rounded-lg">
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(tax.netTax)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button onClick={recalculate} variant="outline">
              <Calculator className="w-4 h-4 mr-2" /> Recalculate
            </Button>
            <Button onClick={saveCalculation}>
              <Save className="w-4 h-4 mr-2" /> Save
            </Button>
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default TaxCalculationPage;
