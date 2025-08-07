import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Scale, 
  FileText, 
  Gavel, 
  Brain, 
  TrendingUp, 
  Settings, 
  BarChart3,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '../../contexts/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard/lawyer', icon: BarChart3, roles: ['lawyer', 'user'] },
  { name: 'Admin Dashboard', href: '/dashboard/admin', icon: Settings, roles: ['admin'] },
  { name: 'Document Automation', href: '/dashboard/documents', icon: FileText, roles: ['lawyer', 'admin'] },
  { name: 'eCourt Integration', href: '/dashboard/ecourt', icon: Gavel, roles: ['lawyer'] },
  { name: 'Argument Genius', href: '/dashboard/arguments', icon: Brain, roles: ['lawyer'] },
  { name: 'Win Predictor', href: '/dashboard/predictor', icon: TrendingUp, roles: ['lawyer'] },
  { name: 'Productivity Tools', href: '/dashboard/tools', icon: MessageSquare, roles: ['lawyer', 'admin'] },
];

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const userRole = user?.role || 'user';

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <div className="w-64 bg-white shadow-lg h-screen">
      <div className="p-6">
        <Link to="/" className="flex items-center">
          <Scale className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">Advocate AI Pro</span>
        </Link>
      </div>
      
      <nav className="mt-6">
        <div className="px-3">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 transition-colors',
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5',
                    isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
