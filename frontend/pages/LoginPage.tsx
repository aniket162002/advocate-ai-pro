import React from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Scale, Brain, FileText, Gavel } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start mb-6">
            <Scale className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Advocate AI Pro</h1>
          </div>
          
          <p className="text-xl text-gray-600 mb-8">
            Revolutionizing legal practice with AI-powered tools for document automation, 
            case analysis, and court preparation.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
              <FileText className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h3 className="font-semibold">Smart Documents</h3>
                <p className="text-sm text-gray-600">AI-powered automation</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
              <Brain className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h3 className="font-semibold">AI Analysis</h3>
                <p className="text-sm text-gray-600">Case insights & predictions</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
              <Gavel className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h3 className="font-semibold">eCourt Integration</h3>
                <p className="text-sm text-gray-600">Real-time case tracking</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
              <Scale className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <h3 className="font-semibold">Argument Genius</h3>
                <p className="text-sm text-gray-600">Strategic case preparation</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Authentication */}
        <div className="w-full max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Advocate AI Pro</CardTitle>
              <CardDescription>
                Sign in to access your legal AI assistant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin" className="mt-6">
                  <SignIn 
                    appearance={{
                      elements: {
                        formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
                        card: 'shadow-none border-0',
                      }
                    }}
                    redirectUrl="/lawyer"
                  />
                </TabsContent>
                
                <TabsContent value="signup" className="mt-6">
                  <SignUp 
                    appearance={{
                      elements: {
                        formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
                        card: 'shadow-none border-0',
                      }
                    }}
                    redirectUrl="/lawyer"
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
