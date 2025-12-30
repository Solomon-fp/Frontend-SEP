import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const FbrRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cnic: '',
    password: '',
    confirmPassword: '',
    cnicfront: null as File | null,
    cnicback: null as File | null,
  });

  const handleFile =
    (field: 'cnicfront' | 'cnicback') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        setFormData({ ...formData, [field]: e.target.files[0] });
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return alert('Passwords do not match');
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('cnic', formData.cnic);
    data.append('password', formData.password);

    // 🔥 HARD CODE ROLE
    data.append('role', 'fbr');

    if (formData.cnicfront) data.append('cnicfront', formData.cnicfront);
    if (formData.cnicback) data.append('cnicback', formData.cnicback);

    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/register',
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      sessionStorage.setItem('token', res.data.token);
      window.location.href = '/fbr/dashboard';
    } catch (err: any) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 border p-6 rounded-xl"
      >
        <h2 className="text-2xl font-bold text-center">
          FBR Officer Registration
        </h2>

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

        <Label>CNIC Front</Label>
        <Input type="file" onChange={handleFile('cnicfront')} />

        <Label>CNIC Back</Label>
        <Input type="file" onChange={handleFile('cnicback')} />

        <Label>Password</Label>
        <Input
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        <Label>Confirm Password</Label>
        <Input
          type="password"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
        />

        <Button type="submit" className="w-full">
          Register as FBR Officer
        </Button>

        <p className="text-center text-sm">
          Already registered?{' '}
          <Link to="/login" className="text-primary">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default FbrRegister;
