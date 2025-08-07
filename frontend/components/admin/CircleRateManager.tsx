import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useBackend } from '../../hooks/useBackend';
import { useToast } from '@/components/ui/use-toast';

export default function CircleRateManager() {
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [circleRate, setCircleRate] = useState('');
  
  const backend = useBackend();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: rates, isLoading } = useQuery({
    queryKey: ['circle-rates'],
    queryFn: () => backend.admin.listCircleRates(),
  });

  const createRateMutation = useMutation({
    mutationFn: (data: { state: string; district: string; circleRate: number }) =>
      backend.admin.createCircleRate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['circle-rates'] });
      setState('');
      setDistrict('');
      setCircleRate('');
      toast({
        title: "Success",
        description: "Circle rate added successfully",
      });
    },
    onError: (error) => {
      console.error('Circle rate error:', error);
      toast({
        title: "Error",
        description: "Failed to add circle rate",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!state || !district || !circleRate) return;
    
    createRateMutation.mutate({
      state,
      district,
      circleRate: parseFloat(circleRate),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Circle Rate Management</CardTitle>
        <CardDescription>Manage circle rates for different states and districts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="state">State</Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="gujarat">Gujarat</SelectItem>
                  <SelectItem value="rajasthan">Rajasthan</SelectItem>
                  <SelectItem value="karnataka">Karnataka</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="district">District</Label>
              <Input
                id="district"
                placeholder="Enter district name"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="circle-rate">Circle Rate (₹ per acre)</Label>
            <Input
              id="circle-rate"
              type="number"
              placeholder="Enter circle rate"
              value={circleRate}
              onChange={(e) => setCircleRate(e.target.value)}
            />
          </div>
          
          <Button type="submit" disabled={createRateMutation.isPending}>
            <Plus className="h-4 w-4 mr-2" />
            Add Circle Rate
          </Button>
        </form>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            rates?.rates?.map((rate) => (
              <div key={rate.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{rate.state} - {rate.district}</p>
                  <p className="text-sm text-gray-600">₹{rate.circleRate.toLocaleString()} per acre</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
