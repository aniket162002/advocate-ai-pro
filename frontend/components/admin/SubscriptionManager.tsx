import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Crown, Users, Building, User } from 'lucide-react';

const subscriptionPlans = [
  {
    id: 'free',
    name: 'Free Trial',
    price: 0,
    duration: 'weekly',
    features: ['5 documents/month', 'Basic templates', 'Email support'],
    userType: 'user',
    icon: User,
  },
  {
    id: 'lawyer-basic',
    name: 'Lawyer Basic',
    price: 2999,
    duration: 'monthly',
    features: ['50 documents/month', 'All templates', 'OCR processing', 'Priority support'],
    userType: 'lawyer',
    icon: Users,
  },
  {
    id: 'lawyer-pro',
    name: 'Lawyer Pro',
    price: 4999,
    duration: 'monthly',
    features: ['Unlimited documents', 'AI features', 'eCourt integration', 'Phone support'],
    userType: 'lawyer',
    icon: Crown,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 19999,
    duration: 'monthly',
    features: ['Multi-user access', 'Custom templates', 'API access', 'Dedicated support'],
    userType: 'enterprise',
    icon: Building,
  },
];

export default function SubscriptionManager() {
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [discount, setDiscount] = useState('');

  const handleUpdateSubscription = () => {
    // Implementation for updating subscription
    console.log('Updating subscription:', { selectedUser, selectedPlan, discount });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Management</CardTitle>
        <CardDescription>Manage user subscriptions and pricing plans</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Subscription Plans */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Available Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {subscriptionPlans.map((plan) => {
              const IconComponent = plan.icon;
              return (
                <div key={plan.id} className="border rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <IconComponent className="h-5 w-5 mr-2" />
                    <h4 className="font-semibold">{plan.name}</h4>
                  </div>
                  <div className="text-2xl font-bold mb-2">
                    ₹{plan.price.toLocaleString()}
                    <span className="text-sm font-normal text-gray-600">/{plan.duration}</span>
                  </div>
                  <Badge variant="outline" className="mb-3">
                    {plan.userType}
                  </Badge>
                  <ul className="text-sm space-y-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="text-gray-600">• {feature}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Update User Subscription */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Update User Subscription</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="user-select">Select User</Label>
              <Input
                id="user-select"
                placeholder="Enter user ID or email"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="plan-select">Select Plan</Label>
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose plan" />
                </SelectTrigger>
                <SelectContent>
                  {subscriptionPlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name} - ₹{plan.price.toLocaleString()}/{plan.duration}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="discount">Discount (%)</Label>
              <Input
                id="discount"
                type="number"
                placeholder="Enter discount percentage"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>
          </div>
          
          <Button onClick={handleUpdateSubscription} className="mt-4">
            Update Subscription
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
