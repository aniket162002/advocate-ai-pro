import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, MessageSquare, Calendar, User } from 'lucide-react';

export default function UserDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
        <Button>
          Contact Lawyer
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              My Documents
            </CardTitle>
            <CardDescription>View and manage your legal documents</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">View Documents</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Messages
            </CardTitle>
            <CardDescription>Communicate with your lawyer</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Open Messages</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Appointments
            </CardTitle>
            <CardDescription>Schedule and manage appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">View Calendar</Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your recent interactions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center p-4 border rounded-lg">
              <User className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h3 className="font-semibold">Document Review Completed</h3>
                <p className="text-sm text-gray-600">Your sale deed has been reviewed and approved</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 border rounded-lg">
              <MessageSquare className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h3 className="font-semibold">New Message from Lawyer</h3>
                <p className="text-sm text-gray-600">Updates on your case proceedings</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
