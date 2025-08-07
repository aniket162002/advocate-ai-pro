import React from 'react';
import { UserButton, useUser } from '@clerk/clerk-react';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Header() {
  const { user } = useUser();
  const userRole = user?.publicMetadata?.role as string || 'user';

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center flex-1">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search cases, documents, or templates..."
              className="pl-10 w-96"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Bell className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 capitalize">{userRole}</p>
            </div>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: 'h-8 w-8'
                }
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
