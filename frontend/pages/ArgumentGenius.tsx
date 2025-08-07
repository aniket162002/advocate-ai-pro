import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Upload, Play, FileText, AlertTriangle } from 'lucide-react';
import { useBackend } from '../hooks/useBackend';
import { useToast } from '@/components/ui/use-toast';

export default function ArgumentGenius() {
  const [judgeId, setJudgeId] = useState('');
  const [caseType, setCaseType] = useState('');
  const [argument, setArgument] = useState('');
  const [judgeProfile, setJudgeProfile] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [simulatorResult, setSimulatorResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const backend = useBackend();
  const { toast } = useToast();

  const analyzeJudge = async () => {
    if (!judgeId || !caseType) {
      toast({
        title: "Missing Information",
        description: "Please enter judge ID and select case type",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await backend.arguments.analyzeJudge({
        judgeId,
        caseType,
      });
      
      setAnalysis(response);
      toast({
        title: "Judge Analysis Complete",
        description: "AI has analyzed judge patterns and preferences",
      });
    } catch (error) {
      console.error('Analysis Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze judge patterns",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const simulateArgument = async () => {
    if (!argument || !caseType || !judgeProfile) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await backend.arguments.simulateArgument({
        argument,
        caseType,
        judgeProfile,
      });
      
      setSimulatorResult(response);
      toast({
        title: "Simulation Complete",
        description: `Argument scored ${response.score}/10`,
      });
    } catch (error) {
      console.error('Simulation Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to simulate argument",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Argument Genius</h1>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Case File
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Judge Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Judge Pattern Analysis</CardTitle>
            <CardDescription>AI analysis of judge's historical decisions and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="judge-id">Judge ID</Label>
              <Input
                id="judge-id"
                placeholder="Enter judge identifier"
                value={judgeId}
                onChange={(e) => setJudgeId(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="case-type">Case Type</Label>
              <Select value={caseType} onValueChange={setCaseType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select case type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="criminal">Criminal</SelectItem>
                  <SelectItem value="civil">Civil</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={analyzeJudge} className="w-full" disabled={loading}>
              <Brain className="h-4 w-4 mr-2" />
              {loading ? "Analyzing..." : "Analyze Judge Patterns"}
            </Button>

            {analysis && (
              <div className="mt-4 space-y-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Successful Arguments</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    {analysis.successfulArguments.map((arg: string, index: number) => (
                      <li key={index}>• {arg}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-red-50 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Points to Avoid</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    {analysis.avoidancePoints.map((point: string, index: number) => (
                      <li key={index}>• {point}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Suggested Strategy</h4>
                  <p className="text-sm text-blue-700">{analysis.suggestedStrategy}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Argument Simulator */}
        <Card>
          <CardHeader>
            <CardTitle>Argument Simulator</CardTitle>
            <CardDescription>Practice your arguments with AI judge feedback</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="judge-profile">Judge Profile</Label>
              <Select value={judgeProfile} onValueChange={setJudgeProfile}>
                <SelectTrigger>
                  <SelectValue placeholder="Select judge profile" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strict">Strict & Procedural</SelectItem>
                  <SelectItem value="liberal">Liberal & Progressive</SelectItem>
                  <SelectItem value="conservative">Conservative & Traditional</SelectItem>
                  <SelectItem value="pragmatic">Pragmatic & Balanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="argument">Your Argument</Label>
              <Textarea
                id="argument"
                placeholder="Enter your argument for simulation..."
                value={argument}
                onChange={(e) => setArgument(e.target.value)}
                rows={6}
              />
            </div>

            <Button onClick={simulateArgument} className="w-full" disabled={loading}>
              <Play className="h-4 w-4 mr-2" />
              {loading ? "Simulating..." : "Simulate Argument"}
            </Button>

            {simulatorResult && (
              <div className="mt-4 space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Judge Response</h4>
                  <p className="text-sm text-gray-700">{simulatorResult.judgeResponse}</p>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Score: {simulatorResult.score}/10
                  </h4>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${simulatorResult.score * 10}%` }}
                    ></div>
                  </div>
                </div>

                <div className="p-3 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Improvement Suggestions</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {simulatorResult.improvementSuggestions.map((suggestion: string, index: number) => (
                      <li key={index}>• {suggestion}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Risk Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Risk & Contradiction Analysis</CardTitle>
          <CardDescription>AI-powered analysis of potential risks and contradictions in your case</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                <h3 className="font-semibold">Contradictions</h3>
              </div>
              <p className="text-sm text-gray-600">
                AI detected 2 potential contradictions in witness statements
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center mb-2">
                <FileText className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="font-semibold">Missing Arguments</h3>
              </div>
              <p className="text-sm text-gray-600">
                Consider adding constitutional grounds and precedent citations
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center mb-2">
                <Brain className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="font-semibold">Strength Score</h3>
              </div>
              <p className="text-sm text-gray-600">
                Current argument strength: 7.5/10
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
