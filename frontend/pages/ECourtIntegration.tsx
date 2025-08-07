import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Gavel, FileText, Mic, Upload, CheckCircle } from 'lucide-react';
import { useBackend } from '../hooks/useBackend';
import { useToast } from '@/components/ui/use-toast';

export default function ECourtIntegration() {
  const [selectedCase, setSelectedCase] = useState('');
  const [draftType, setDraftType] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [draft, setDraft] = useState<any>(null);
  
  const backend = useBackend();
  const { toast } = useToast();

  const { data: cases, isLoading } = useQuery({
    queryKey: ['ecourt-cases'],
    queryFn: () => backend.ecourt.listCases({ crnNumber: 'CRN123' }),
  });

  const createDraft = async () => {
    try {
      const response = await backend.ecourt.createDraft({
        caseId: selectedCase,
        draftType,
        manualInput,
      });
      
      setDraft(response);
      toast({
        title: "Draft Created",
        description: "AI-powered draft has been generated successfully",
      });
    } catch (error) {
      console.error('Draft Error:', error);
      toast({
        title: "Error",
        description: "Failed to create draft",
        variant: "destructive",
      });
    }
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    // Implement voice recording logic
    setTimeout(() => {
      setIsRecording(false);
      setManualInput("Voice input converted to text...");
      toast({
        title: "Voice Recorded",
        description: "Speech has been converted to text",
      });
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">eCourt Integration & AI Legal Co-Pilot</h1>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Case File
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Case Management */}
        <Card>
          <CardHeader>
            <CardTitle>Live Case Data</CardTitle>
            <CardDescription>Real-time case information from eCourt system</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {cases?.cases?.map((case_) => (
                  <div 
                    key={case_.id} 
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedCase === case_.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedCase(case_.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{case_.title}</h3>
                        <p className="text-sm text-gray-600">{case_.caseNumber}</p>
                        <p className="text-sm text-gray-500">Judge: {case_.judgeName}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          case_.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {case_.status}
                        </span>
                        <p className="text-sm text-gray-600 mt-1">
                          Next: {new Date(case_.nextHearingDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Draft Creation */}
        <Card>
          <CardHeader>
            <CardTitle>AI Draft Generator</CardTitle>
            <CardDescription>Create legal drafts with AI assistance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="draft-type">Draft Type</Label>
              <Select value={draftType} onValueChange={setDraftType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select draft type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="application">Application</SelectItem>
                  <SelectItem value="petition">Petition</SelectItem>
                  <SelectItem value="affidavit">Affidavit</SelectItem>
                  <SelectItem value="notice">Notice</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="manual-input">Draft Content</Label>
              <Textarea
                id="manual-input"
                placeholder="Enter draft content or use voice input..."
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                rows={6}
              />
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={startVoiceRecording}
                disabled={isRecording}
                className="flex-1"
              >
                <Mic className={`h-4 w-4 mr-2 ${isRecording ? 'text-red-500' : ''}`} />
                {isRecording ? 'Recording...' : 'Voice Input'}
              </Button>
              
              <Button onClick={createDraft} disabled={!selectedCase || !draftType} className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Generate Draft
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generated Draft */}
      {draft && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Draft</CardTitle>
            <CardDescription>AI-generated legal draft with compliance checking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm">{draft.content}</pre>
            </div>

            {draft.complianceIssues?.length > 0 && (
              <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Compliance Issues</h4>
                <ul className="list-disc list-inside text-sm text-yellow-700">
                  {draft.complianceIssues.map((issue: string, index: number) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {draft.suggestions?.length > 0 && (
              <div className="border-l-4 border-blue-400 bg-blue-50 p-4">
                <h4 className="font-semibold text-blue-800 mb-2">AI Suggestions</h4>
                <ul className="list-disc list-inside text-sm text-blue-700">
                  {draft.suggestions.map((suggestion: string, index: number) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex space-x-2">
              <Button variant="outline">
                Edit Draft
              </Button>
              <Button>
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve & Export
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
