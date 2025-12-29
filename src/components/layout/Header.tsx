import { Bell, Search, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface Notification {
  id: number;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header = ({ title, subtitle }: HeaderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [visibleCount, setVisibleCount] = useState(3); // initially show 3 notifications

  const unreadCount = notifications.filter(n => !n.read).length;

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/notifications');
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: number) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: 'PUT',
      });
      setNotifications(n =>
        n.map(notif => (notif.id === id ? { ...notif, read: true } : notif))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const loadMore = () => {
    setVisibleCount(prev => prev + 3);
  };

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="w-64 pl-10 bg-secondary border-0"
          />
        </div>

        {/* Help */}
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <HelpCircle className="w-5 h-5" />
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-muted-foreground">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-3 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold">Notifications</h3>
              <Badge variant="secondary">{unreadCount} new</Badge>
            </div>

            {notifications.slice(0, visibleCount).map(notification => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start p-3 cursor-pointer"
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-center gap-2">
                  {!notification.read && <span className="w-2 h-2 bg-primary rounded-full" />}
                  <span className="font-medium text-sm">{notification.title}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {notification.message}
                </p>
                <span className="text-xs text-muted-foreground mt-1">{notification.createdAt}</span>
              </DropdownMenuItem>
            ))}

            {visibleCount < notifications.length && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-center"
                onClick={loadMore}
              >
                Load More
              </Button>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
