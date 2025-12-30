import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Shield,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Check,
  User,
  FileText,
  Lock,
} from 'lucide-react';
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
    role: 'client', // client | employee
  });

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!formData.cnicfront || !formData.cnicback) {
      alert('CNIC front & back are required');
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('cnic', formData.cnic);
    data.append('password', formData.password);
    data.append('role', formData.role);
    data.append('cnicfront', formData.cnicfront);
    data.append('cnicback', formData.cnicback);

    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/register',
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      sessionStorage.setItem('token', res.data.token);
      window.location.href = `/${res.data.role}/dashboard`;
    } catch (error: any) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  const handleFileUpload =
    (field: 'cnicfront' | 'cnicback') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        setFormData({ ...formData, [field]: e.target.files[0] });
      }
    };

  return (
    <div className="min-h-screen flex">
      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-2">Create your account</h2>
          <p className="text-muted-foreground mb-8">
            Complete the steps below to get started
          </p>

          {/* STEP INDICATOR */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = step.id === currentStep;
                const isComplete = step.id < currentStep;

                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center',
                          isComplete
                            ? 'bg-success text-success-foreground'
                            : isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {isComplete ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <span className="text-xs mt-2">{step.title}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-16 h-0.5 bg-muted mx-2" />
                    )}
                  </div>
                );
              })}
            </div>
            <Progress value={progress} className="h-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* STEP 1 */}
            {currentStep === 1 && (
              <>
                <Label>Full Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />

                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />

                <Label>Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />

                <Label>CNIC</Label>
                <Input
                  value={formData.cnic}
                  onChange={(e) =>
                    setFormData({ ...formData, cnic: e.target.value })
                  }
                />

                <Label>Role</Label>
                <select
                  className="w-full h-12 border rounded-md px-3"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <option value="client">Client</option>
                  <option value="employee">Employee</option>
                </select>
              </>
            )}

            {/* STEP 2 */}
            {currentStep === 2 && (
              <>
                <Label>CNIC Front</Label>
                <Input type="file" onChange={handleFileUpload('cnicfront')} />

                <Label>CNIC Back</Label>
                <Input type="file" onChange={handleFileUpload('cnicback')} />
              </>
            )}

            {/* STEP 3 */}
            {currentStep === 3 && (
              <>
                <Label>Password</Label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />

                <Label>Confirm Password</Label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                />

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />} Show password
                </Button>
              </>
            )}

            <div className="flex gap-3 pt-4">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep((p) => p - 1)}
                >
                  <ArrowLeft /> Back
                </Button>
              )}

              <Button type="submit" className="flex-1">
                {currentStep === totalSteps ? 'Create Account' : 'Continue'}
                <ArrowRight />
              </Button>
            </div>
          </form>

          <p className="text-center mt-6 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
