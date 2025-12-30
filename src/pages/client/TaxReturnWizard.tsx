import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Calendar,
  Briefcase,
  Upload,
  FileCheck,
  Plus,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { taxYears, incomeCategories, formatCurrency } from '@/lib/mockData';

const steps = [
  { id: 1, title: 'Tax Year', icon: Calendar },
  { id: 2, title: 'Income', icon: Briefcase },
  { id: 3, title: 'Documents', icon: Upload },
  { id: 4, title: 'Review', icon: FileCheck },
];

interface IncomeEntry {
  category: string;
  amount: number;
  description: string;
}

const TaxReturnWizard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [taxYear, setTaxYear] = useState('2024');
  const [incomes, setIncomes] = useState<IncomeEntry[]>([
    { category: 'Salary', amount: 0, description: '' },
  ]);
  const [documents, setDocuments] = useState<File[]>([]);
  const [agreed, setAgreed] = useState(false);

  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const progress = (currentStep / steps.length) * 100;

  const handleNext = async () => {
    console.log(user)
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      const data = new FormData();
      const date = new Date().toISOString();
      console.log(date)

      data.append("clientId", user.id);
      data.append("clientName", user.name);
      data.append("taxYear", taxYear.toString());
      data.append("status", "IN_REVIEW");
      data.append("fbrStatus", "UNDER_REVIEW")
      data.append("submittedDate", date);
      data.append("totalIncome", totalIncome.toString());
      data.append("totalTax", "0"); // No deductions
      data.append("lastUpdated", date);
        console.log(data)

      if (documents.length > 0) {
        data.append("documents", documents[0]);
      }

      try {
        console.log(Object.fromEntries(data));
        const response = await axios.post("http://localhost:5000/api/client/returns", data);
        const result = response.data;
        if (result.success) {
          setCurrentStep(1);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const addIncome = () => setIncomes([...incomes, { category: '', amount: 0, description: '' }]);
  const removeIncome = (index: number) => setIncomes(incomes.filter((_, i) => i !== index));
  const updateIncome = (index: number, field: keyof IncomeEntry, value: string | number) => {
    const updated = [...incomes];
    updated[index] = { ...updated[index], [field]: value };
    setIncomes(updated);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setDocuments([...documents, ...Array.from(e.target.files)]);
  };
  const removeDocument = (index: number) => setDocuments(documents.filter((_, i) => i !== index));

  



  return (
    <DashboardLayout title="File Tax Return" subtitle="Complete all steps to submit your return">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <Card className="card-elevated p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isComplete = step.id < currentStep;

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                      isComplete ? 'bg-success text-success-foreground' :
                      isActive ? 'bg-primary text-primary-foreground' :
                      'bg-muted text-muted-foreground'
                    )}>
                      {isComplete ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className={cn(
                      'text-xs mt-2 font-medium hidden sm:block',
                      isActive ? 'text-foreground' : 'text-muted-foreground'
                    )}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      'w-8 sm:w-16 lg:w-24 h-0.5 mx-2',
                      step.id < currentStep ? 'bg-success' : 'bg-muted'
                    )} />
                  )}
                </div>
              );
            })}
          </div>
          <Progress value={progress} className="h-1" />
        </Card>

        {/* Auto-save indicator */}
        <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          Draft auto-saved
        </div>

        {/* Step Content */}
        <Card className="card-elevated p-6">
          {/* Step 1: Tax Year */}
          {currentStep === 1 && (
            <div className="animate-fade-in space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Select Tax Year</h2>
                <p className="text-muted-foreground">Choose the tax year for which you want to file a return</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {taxYears.map((year) => (
                  <button
                    key={year}
                    onClick={() => setTaxYear(year)}
                    className={cn(
                      'p-6 rounded-xl border-2 transition-all duration-200 text-center',
                      taxYear === year ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                    )}
                  >
                    <span className="text-2xl font-bold">{year}</span>
                    <p className="text-sm text-muted-foreground mt-1">
                      Jul {parseInt(year) - 1} - Jun {year}
                    </p>
                  </button>
                ))}
              </div>
              <div className="p-4 bg-info/10 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-info mt-0.5" />
                <div>
                  <p className="font-medium text-info">Important Notice</p>
                  <p className="text-sm text-muted-foreground">
                    The deadline for filing tax year {taxYear} returns is September 30, {parseInt(taxYear) + 1}.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Income */}
          {currentStep === 2 && (
            <div className="animate-fade-in space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Income Sources</h2>
                <p className="text-muted-foreground">Add all your income sources for tax year {taxYear}</p>
              </div>
              <div className="space-y-4">
                {incomes.map((income, index) => (
                  <div key={index} className="p-4 bg-secondary/50 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Income Source {index + 1}</span>
                      {incomes.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeIncome(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Category</Label>
                        <Select
                          value={income.category}
                          onValueChange={(value) => updateIncome(index, 'category', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {incomeCategories.map((cat) => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Amount (PKR)</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={income.amount || ''}
                          onChange={(e) => updateIncome(index, 'amount', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Input
                          placeholder="Brief description"
                          value={income.description}
                          onChange={(e) => updateIncome(index, 'description', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" onClick={addIncome}>
                <Plus className="w-4 h-4 mr-2" /> Add Income Source
              </Button>
              <div className="p-4 bg-primary/5 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total Income</span>
                  <span className="text-2xl font-bold">{formatCurrency(totalIncome)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Documents */}
          {currentStep === 3 && (
            <div className="animate-fade-in space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Upload Documents</h2>
                <p className="text-muted-foreground">Upload supporting documents for your tax return</p>
              </div>
              <label className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl cursor-pointer hover:border-primary/50 hover:bg-secondary/50 transition-all">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="font-medium">Drop files here or click to upload</p>
                <p className="text-sm text-muted-foreground mt-1">PDF, JPG, PNG (max 10MB each)</p>
              </label>
              {documents.length > 0 && (
                <div className="space-y-2">
                  <p className="font-medium">Uploaded Documents ({documents.length})</p>
                  {documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileCheck className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(doc.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeDocument(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <div className="p-4 bg-warning/10 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Required documents:</strong> Salary certificate, bank statements, investment proofs, donation receipts
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="animate-fade-in space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Review & Submit</h2>
                <p className="text-muted-foreground">Review your return before final submission</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-secondary/50 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-2">Tax Year</p>
                    <p className="text-xl font-bold">{taxYear}</p>
                  </div>
                  <div className="p-4 bg-secondary/50 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-2">Total Income</p>
                    <p className="text-xl font-bold">{formatCurrency(totalIncome)}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-secondary/50 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-2">Documents Attached</p>
                    <p className="text-xl font-bold">{documents.length} files</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-warning/10 rounded-lg">
                <Checkbox
                  id="agree"
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(checked as boolean)}
                />
                <label htmlFor="agree" className="text-sm leading-relaxed cursor-pointer">
                  I declare that the information provided is true and complete to the best of my knowledge.
                  I understand that any false statement may result in penalties under the Income Tax Ordinance 2001.
                </label>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={currentStep === 4 && !agreed}
            >
              {currentStep === 4 ? 'Submit Return' : 'Continue'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TaxReturnWizard;
