import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  CreditCard,
  Search,
  ClipboardCheck,
  Calculator,
  Users,
  LogOut,
  Shield,
  ChevronDown,
  Building2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserRole } from '@/lib/mockData';

const clientNavItems = [
  { path: '/client/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/client/tax-return', label: 'Tax Returns', icon: FileText },
  { path: '/client/requests', label: 'Info Requests', icon: MessageSquare },
  { path: '/client/bills', label: 'Billing & Payments', icon: CreditCard },
  { path: '/tracking', label: 'Track Filing', icon: Search },
];

const employeeNavItems = [
  { path: '/employee/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  // { path: '/employee/clients', label: 'Clients', icon: Users },
  { path: '/employee/verify', label: 'Verification', icon: ClipboardCheck },
  { path: '/employee/calculation', label: 'Tax Calculation', icon: Calculator },
  { path: '/employee/requests', label: 'Info Requests', icon: MessageSquare },
  { path: '/employee/generateBill', label: 'Generate bill', icon: FileText },


];

const fbrNavItems = [
  { path: '/fbr/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/fbr/returns', label: 'Review Returns', icon: FileText },
  { path: '/fbr/decisions', label: 'Decision Log', icon: ClipboardCheck },
];

const roleLabels: Record<UserRole, string> = {
  client: 'Client Portal',
  employee: 'Employee Portal',
  fbr: 'FBR Officer Portal',
};

const roleIcons: Record<UserRole, React.ElementType> = {
  client: Users,
  employee: Building2,
  fbr: Shield,
};

export const Sidebar = () => {
  const location = useLocation();
  const { user, role, logout } = useAuth();

  const navItems = role === 'client' ? clientNavItems : role === 'employee' ? employeeNavItems : fbrNavItems;
  const RoleIcon = roleIcons[role];

  return (
    <aside className="w-64 bg-sidebar min-h-screen flex flex-col border-r border-sidebar-border">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
            <Shield className="w-6 h-6 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-sidebar-foreground">TaxFile</h1>
            <p className="text-xs text-sidebar-muted">Pakistan</p>
          </div>
        </div>
      </div>

      {/* Role Switcher */}
      <div className="p-4 border-b border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full flex items-center justify-between p-3 rounded-lg bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80 transition-colors">
            <div className="flex items-center gap-3">
              <RoleIcon className="w-5 h-5 text-sidebar-primary" />
              <span className="text-sm font-medium">{roleLabels[role]}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-sidebar-muted" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem onClick={() => switchRole('client')} className="cursor-pointer">
              <Users className="w-4 h-4 mr-2" />
              Client Portal
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => switchRole('employee')} className="cursor-pointer">
              <Building2 className="w-4 h-4 mr-2" />
              Employee Portal
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => switchRole('fbr')} className="cursor-pointer">
              <Shield className="w-4 h-4 mr-2" />
              FBR Officer Portal
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn('nav-item', isActive && 'active')}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-sidebar-accent/50">
          <div className="w-10 h-10 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-medium">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
            <p className="text-xs text-sidebar-muted truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-destructive transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
