import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { TrendingUp, Upload, AlertTriangle, CheckCircle, Target } from 'lucide-react';
import { useBackend } from '../hooks/useBackend';
import { useToast } from '@/components/ui/use-toast';

export default function WinPredictor() {
  const [caseDetails, setCaseDetails] = useState('');
  const [caseType, setCaseType] = useState('');
  const [judgeId, setJudgeId] = useState('');
  const [evidenceStrength, setEvidenceStrength] = useState([7]);
  const [precedentSupport, setPrecedentSupport] = useState([6]);
  const [prediction, setPrediction] = useState<any>(null);
  
  const backend = useBackend();
  const { toast } = useToast();

  const predictWinChance = async () => {
    try {
      const response = await backend.predictor.predictWinChance({
        caseDetails,
        caseType,
        judgeId,
        evidenceStrength: evidenceStrength[0] / 10,
        precedentSupport: precedentSupport[0] / 10,
      });
      
      setPrediction(response);
      toast({
        title: "Prediction Complete",
        description: `Win probability: ${Math.round(response.winProbability * 100)}%`,
      });
    } catch (error) {
      console.error('Prediction Error:', error);
      toast({
        title: "Error",
        description: "Failed to predict win chance",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Win Predictor</h1>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Case Files
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Case Analysis Input</CardTitle>
            <CardDescription>Provide case details for AI-powered win prediction</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
                  <SelectItem value="constitutional">Constitutional</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
              <Label htmlFor="case-details">Case Details</Label>
              <Textarea
                id="case-details"
                placeholder="Describe the case facts, legal issues, and current status..."
                value={caseDetails}
                onChange={(e) => setCaseDetails(e.target.value)}
                rows={6}
              />
            </div>

            <div>
              <Label>Evidence Strength: {evidenceStrength[0]}/10</Label>
              <Slider
                value={evidenceStrength}
                onValueChange={setEvidenceStrength}
                max={10}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Precedent Support: {precedentSupport[0]}/10</Label>
              <Slider
                value={precedentSupport}
                onValueChange={setPrecedentSupport}
                max={10}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>

            <Button onClick={predictWinChance} className="w-full">
              <TrendingUp className="h-4 w-4 mr-2" />
              Predict Win Chance
            </Button>
          </CardContent>
        </Card>

        {/* Prediction Results */}
        <Card>
          <CardHeader>
            <CardTitle>Prediction Results</CardTitle>
            <CardDescription>AI-powered analysis of your case's success probability</CardDescription>
          </CardHeader>
          <CardContent>
            {prediction ? (
              <div className="space-y-4">
                {/* Win Probability */}
                <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                  <Target className="h-12 w-12 mx-auto text-blue-600 mb-2" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    {Math.round(prediction.winProbability * 100)}%
                  </h3>
                  <p className="text-gray-600">Win Probability</p>
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${prediction.winProbability * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Risk Factors */}
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    <h4 className="font-semibold text-red-800">Risk Factors</h4>
                  </div>
                  <ul className="text-sm text-red-700 space-y-1">
                    {prediction.riskFactors.map((risk: string, index: number) => (
                      <li key={index}>• {risk}</li>
                    ))}
                  </ul>
                </div>

                {/* Success Factors */}
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <h4 className="font-semibold text-green-800">Key Success Factors</h4>
                  </div>
                  <ul className="text-sm text-green-700 space-y-1">
                    {prediction.keySuccessFactors.map((factor: string, index: number) => (
                      <li key={index}>• {factor}</li>
                    ))}
                  </ul>
                </div>

                {/* Mitigation Strategies */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Mitigation Strategies</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    {prediction.mitigationStrategies.map((strategy: string, index: number) => (
                      <li key={index}>• {strategy}</li>
                    ))}
                  </ul>
                </div>

                {/* Recommended Actions */}
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Recommended Actions</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {prediction.recommendedActions.map((action: string, index: number) => (
                      <li key={index}>• {action}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Enter case details to get AI-powered win prediction</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Historical Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Historical Case Analysis</CardTitle>
          <CardDescription>Similar cases and their outcomes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Similar Cases Won</h3>
              <div className="text-2xl font-bold text-green-600">68%</div>
              <p className="text-sm text-gray-600">Based on 45 similar cases</p>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Average Duration</h3>
              <div className="text-2xl font-bold text-blue-600">18 months</div>
              <p className="text-sm text-gray-600">From filing to judgment</p>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Settlement Rate</h3>
              <div className="text-2xl font-bold text-orange-600">32%</div>
              <p className="text-sm text-gray-600">Cases settled out of court</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
