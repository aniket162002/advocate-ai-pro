import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Mail, Phone, Calendar, Send, Bell } from 'lucide-react';
import { useBackend } from '../hooks/useBackend';
import { useToast } from '@/components/ui/use-toast';

export default function ProductivityTools() {
  const [recipientId, setRecipientId] = useState('');
  const [message, setMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'sms' | 'email' | 'whatsapp'>('sms');
  const [isUrgent, setIsUrgent] = useState(false);
  
  const backend = useBackend();
  const { toast } = useToast();

  const sendNotification = async () => {
    try {
      const response = await backend.notifications.sendNotification({
        recipientId,
        message,
        type: notificationType,
        urgent: isUrgent,
      });
      
      toast({
        title: "Message Sent",
        description: `${notificationType.toUpperCase()} sent successfully`,
      });
      
      setMessage('');
      setRecipientId('');
    } catch (error) {
      console.error('Notification Error:', error);
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Productivity Tools</h1>
        <Button>
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Reminder
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Communication Center */}
        <Card>
          <CardHeader>
            <CardTitle>Client Communication</CardTitle>
            <CardDescription>Send real-time updates via SMS, email, or WhatsApp</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="recipient">Recipient ID</Label>
              <Input
                id="recipient"
                placeholder="Enter client ID or phone number"
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="notification-type">Communication Type</Label>
              <Select value={notificationType} onValueChange={(value: any) => setNotificationType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select communication method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Enter your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="urgent"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="urgent">Mark as urgent</Label>
            </div>

            <Button onClick={sendNotification} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Send {notificationType.toUpperCase()}
            </Button>
          </CardContent>
        </Card>

        {/* Quick Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Message Templates</CardTitle>
            <CardDescription>Pre-defined templates for common communications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setMessage("Your case hearing is scheduled for [DATE] at [TIME]. Please arrive 30 minutes early with all required documents.")}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Hearing Reminder
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setMessage("Your document has been prepared and is ready for review. Please visit our office at your earliest convenience.")}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Document Ready
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setMessage("Case update: [BRIEF_UPDATE]. We will keep you informed of any further developments.")}
            >
              <Bell className="h-4 w-4 mr-2" />
              Case Update
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setMessage("Payment reminder: Your legal fees of ₹[AMOUNT] are due by [DATE]. Please make the payment to avoid any delays.")}
            >
              <Mail className="h-4 w-4 mr-2" />
              Payment Reminder
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setMessage("Congratulations! We have successfully [OUTCOME] in your case. Thank you for trusting us with your legal matter.")}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Success Notification
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Communication History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Communications</CardTitle>
          <CardDescription>History of sent messages and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium">SMS to +91-9876543210</p>
                  <p className="text-sm text-gray-600">Hearing reminder sent</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Delivered</span>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium">Email to client@example.com</p>
                  <p className="text-sm text-gray-600">Document ready notification</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Read</span>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium">WhatsApp to +91-9876543210</p>
                  <p className="text-sm text-gray-600">Case update notification</p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Delivered</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
