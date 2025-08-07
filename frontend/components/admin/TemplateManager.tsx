import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, FileText, Edit } from 'lucide-react';
import { useBackend } from '../../hooks/useBackend';
import { useToast } from '@/components/ui/use-toast';

export default function TemplateManager() {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [content, setContent] = useState('');
  const [placeholders, setPlaceholders] = useState('');
  
  const backend = useBackend();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: templates, isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: () => backend.documents.listTemplates(),
  });

  const createTemplateMutation = useMutation({
    mutationFn: (data: any) => backend.documents.createTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      setName('');
      setType('');
      setContent('');
      setPlaceholders('');
      toast({
        title: "Success",
        description: "Template created successfully",
      });
    },
    onError: (error) => {
      console.error('Template error:', error);
      toast({
        title: "Error",
        description: "Failed to create template",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !type || !content) return;
    
    createTemplateMutation.mutate({
      name,
      type,
      content,
      placeholders: placeholders.split(',').map(p => p.trim()).filter(Boolean),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Template Management</CardTitle>
        <CardDescription>Create and manage legal document templates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                placeholder="Enter template name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="template-type">Template Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale-deed">Sale Deed</SelectItem>
                  <SelectItem value="rent-agreement">Rent Agreement</SelectItem>
                  <SelectItem value="power-attorney">Power of Attorney</SelectItem>
                  <SelectItem value="affidavit">Affidavit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="placeholders">Placeholders (comma-separated)</Label>
            <Input
              id="placeholders"
              placeholder="buyer_name, seller_name, land_area, etc."
              value={placeholders}
              onChange={(e) => setPlaceholders(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="template-content">Template Content</Label>
            <Textarea
              id="template-content"
              placeholder="Enter template content with placeholders like {{buyer_name}}"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
            />
          </div>
          
          <Button type="submit" disabled={createTemplateMutation.isPending}>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </form>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            templates?.templates?.map((template) => (
              <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium">{template.name}</p>
                    <p className="text-sm text-gray-600">{template.type}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
