import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, Calculator, Download } from 'lucide-react';
import { useBackend } from '../hooks/useBackend';
import { useToast } from '@/components/ui/use-toast';

export default function DocumentAutomation() {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [landArea, setLandArea] = useState('');
  const [circleRate, setCircleRate] = useState('');
  const [extractedData, setExtractedData] = useState<any>(null);
  const [malkiyatData, setMalkiyatData] = useState<any>(null);
  
  const backend = useBackend();
  const { toast } = useToast();

  const handleFileUpload = async (file: File, documentType: string) => {
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        const response = await backend.documents.extractDocumentData({
          imageBase64: base64.split(',')[1],
          documentType: documentType as any,
        });
        
        setExtractedData(response.extractedData);
        toast({
          title: "Document Processed",
          description: `Data extracted with ${Math.round(response.confidence * 100)}% confidence`,
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('OCR Error:', error);
      toast({
        title: "Error",
        description: "Failed to process document",
        variant: "destructive",
      });
    }
  };

  const calculateMalkiyat = async () => {
    try {
      const response = await backend.documents.calculateMalkiyat({
        landArea: parseFloat(landArea),
        state: selectedState,
        district: selectedDistrict,
        circleRate: circleRate ? parseFloat(circleRate) : undefined,
      });
      
      setMalkiyatData(response);
      toast({
        title: "Malkiyat Calculated",
        description: `Land value: ₹${response.landValue.toLocaleString()}`,
      });
    } catch (error) {
      console.error('Malkiyat Error:', error);
      toast({
        title: "Error",
        description: "Failed to calculate malkiyat",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Smart Document Automation</h1>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Document
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Document Upload & OCR</CardTitle>
            <CardDescription>Upload documents for automatic data extraction</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="template">Select Template</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose document template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale-deed">Sale Deed</SelectItem>
                  <SelectItem value="rent-agreement">Rent Agreement</SelectItem>
                  <SelectItem value="power-attorney">Power of Attorney</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="state">State</Label>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="gujarat">Gujarat</SelectItem>
                    <SelectItem value="rajasthan">Rajasthan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="district">District</Label>
                <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="pune">Pune</SelectItem>
                    <SelectItem value="nashik">Nashik</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Upload Documents</Label>
              
              <div className="grid grid-cols-1 gap-3">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Buyer Aadhaar Card</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'aadhaar')}
                    className="hidden"
                    id="buyer-aadhaar"
                  />
                  <Button variant="outline" size="sm" className="mt-2" onClick={() => document.getElementById('buyer-aadhaar')?.click()}>
                    Upload
                  </Button>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Land Record</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'land_record')}
                    className="hidden"
                    id="land-record"
                  />
                  <Button variant="outline" size="sm" className="mt-2" onClick={() => document.getElementById('land-record')?.click()}>
                    Upload
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Malkiyat Calculator */}
        <Card>
          <CardHeader>
            <CardTitle>Malkiyat Calculator</CardTitle>
            <CardDescription>Calculate land value and associated charges</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="land-area">Land Area (in acres)</Label>
              <Input
                id="land-area"
                type="number"
                placeholder="Enter land area"
                value={landArea}
                onChange={(e) => setLandArea(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="circle-rate">Circle Rate (optional)</Label>
              <Input
                id="circle-rate"
                type="number"
                placeholder="Enter circle rate per acre"
                value={circleRate}
                onChange={(e) => setCircleRate(e.target.value)}
              />
            </div>

            <Button onClick={calculateMalkiyat} className="w-full">
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Malkiyat
            </Button>

            {malkiyatData && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Calculation Results</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Land Value:</span>
                    <span className="font-medium">₹{malkiyatData.landValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stamp Duty:</span>
                    <span className="font-medium">₹{malkiyatData.stampDuty.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registration Fee:</span>
                    <span className="font-medium">₹{malkiyatData.registrationFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">Total Charges:</span>
                    <span className="font-bold">₹{malkiyatData.totalCharges.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Extracted Data Display */}
      {extractedData && (
        <Card>
          <CardHeader>
            <CardTitle>Extracted Data</CardTitle>
            <CardDescription>Review and edit the extracted information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(extractedData).map(([key, value]) => (
                <div key={key}>
                  <Label htmlFor={key} className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                  <Input
                    id={key}
                    value={value as string}
                    onChange={(e) => setExtractedData({...extractedData, [key]: e.target.value})}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
