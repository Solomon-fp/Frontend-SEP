import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Eye, EyeOff, ArrowRight, ArrowLeft, Upload, Check, User, FileText, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import axios from 'axios';

const steps = [
  { id: 1, title: 'Personal Info', icon: User },
  { id: 2, title: 'Documents', icon: FileText },
  { id: 3, title: 'Security', icon: Lock },
];

const Register = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cnic: '',
    password: '',
    confirmPassword: '',
    cnicfront: null as File | null,
    cnicback: null as File | null,
    role: 'client', // default role
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      if (formData.password === formData.confirmPassword) {
        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("phone", formData.phone);
        data.append("cnic", formData.cnic);
        data.append("password", formData.password);
        data.append("role", formData.role);

        if (formData.cnicfront) data.append("cnicfront", formData.cnicfront);
        if (formData.cnicback) data.append("cnicback", formData.cnicback);

        const res = await axios.post("http://localhost:5000/api/auth/register", data);

        sessionStorage.setItem("token", res.data.token);
        window.location.href = `${res.data.role}/dashboard`;
      } else {
        alert("Password Must Match");
      }
    }
  };

  const handleFileUpload = (field: 'cnicfront' | 'cnicback') => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData({ ...formData, [field]: e.target.files[0] });
    }
  };

  const progress = (currentStep / 3) * 100;

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,...')] opacity-50" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center backdrop-blur-sm">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">TaxFile Pakistan</h1>
              <p className="text-sm opacity-80">Digital Tax Filing System</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight">
              Start Your<br />
              Tax Journey
            </h2>
            <p className="text-lg opacity-80 max-w-md">
              Register today and experience hassle-free tax filing with our modern digital platform.
            </p>
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
                <p className="text-sm">Quick 3-step registration process</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
                <p className="text-sm">Secure document verification</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
                <p className="text-sm">Instant account activation</p>
              </div>
            </div>
          </div>
          <p className="text-sm opacity-60">© 2024 TaxFile Pakistan. All rights reserved.</p>
        </div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-lg animate-fade-in">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">TaxFile Pakistan</h1>
          </div>

          <div className="space-y-2 mb-8">
            <h2 className="text-2xl font-bold">Create your account</h2>
            <p className="text-muted-foreground">Complete the steps below to get started</p>
          </div>

          <div className="mb-8">
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
                        'text-xs mt-2 font-medium',
                        isActive ? 'text-foreground' : 'text-muted-foreground'
                      )}>{step.title}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={cn(
                        'w-16 md:w-24 h-0.5 mx-2',
                        step.id < currentStep ? 'bg-success' : 'bg-muted'
                      )} />
                    )}
                  </div>
                );
              })}
            </div>
            <Progress value={progress} className="h-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-fade-in">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Ahmed Hassan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+92 300 1234567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="h-12"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ahmed.hassan@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnic">CNIC Number</Label>
                  <Input
                    id="cnic"
                    placeholder="35201-1234567-8"
                    value={formData.cnic}
                    onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                    className="h-12"
                  />
                  <p className="text-xs text-muted-foreground">Format: XXXXX-XXXXXXX-X</p>
                </div>

                {/* Role Selection */}
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="h-12 w-full border rounded-lg px-3"
                  >
                    <option value="client">Client</option>
                    <option value="employee">Employee</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Documents */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-fade-in">
                {/* CNIC front/back upload fields unchanged */}
              </div>
            )}

            {/* Step 3: Security */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-fade-in">
                {/* Password fields unchanged */}
              </div>
            )}

            <div className="flex items-center gap-4 pt-4">
              {currentStep > 1 && (
                <Button type="button" variant="outline" size="lg" onClick={() => setCurrentStep(currentStep - 1)} className="flex-1">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
              )}
              <Button type="submit" size="lg" className={cn('flex-1', currentStep === 1 && 'w-full')}>
                {currentStep === 3 ? 'Create Account' : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
