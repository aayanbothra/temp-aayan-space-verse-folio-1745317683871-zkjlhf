
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Import the admin email constant from AuthContext
import { ADMIN_EMAIL } from '@/context/AuthContext';

const authSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type AuthFormValues = z.infer<typeof authSchema>;

const Auth = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authError, setAuthError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: ADMIN_EMAIL,
      password: "",
    },
  });

  const onSubmit = async (data: AuthFormValues) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      console.log(`Attempting to ${authMode} with email: ${data.email}`);
      
      // Only allow the admin email to log in/sign up
      if (data.email !== ADMIN_EMAIL) {
        setAuthError("Only the administrator can access this area.");
        setIsLoading(false);
        return;
      }

      if (authMode === 'signin') {
        // Sign in
        const { data: signInData, error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (error) {
          console.error("Sign in error:", error);
          
          // If it's an invalid credentials error, suggest creating an admin account
          if (error.message.includes("Invalid login credentials")) {
            setAuthError("Admin account not found. Please use the Sign Up tab to create your admin account first.");
            setAuthMode('signup');
          } else {
            setAuthError(error.message);
          }
        } else if (signInData.user) {
          console.log("Successfully logged in as:", signInData.user.email);
          toast({
            title: "Welcome back!",
            description: "You've been successfully logged in.",
          });
          navigate('/admin');
        }
      } else {
        // Sign up
        const { data: signUpData, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        });

        if (error) {
          console.error("Sign up error:", error);
          setAuthError(error.message);
          
          // Check if the user already exists
          if (error.message.includes("User already registered")) {
            setAuthError("This admin account already exists. Please sign in instead.");
            setAuthMode('signin');
          }
        } else if (signUpData.user) {
          console.log("Successfully created account for:", signUpData.user.email);
          
          // Check if email confirmation is required
          if (signUpData.session) {
            toast({
              title: "Account Created",
              description: "Your admin account has been successfully created. You are now logged in.",
            });
            navigate('/admin');
          } else {
            setAuthError("Your account has been created but requires email verification. Please check your inbox.");
            setDebugInfo("If you're in development, you may want to disable email confirmation in the Supabase dashboard.");
          }
        }
      }
    } catch (error: any) {
      console.error(`${authMode} failed:`, error);
      setAuthError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container relative min-h-screen flex items-center justify-center bg-space-blue-dark">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-space-purple/20 bg-space-blue-dark/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Admin Access</CardTitle>
            <CardDescription className="text-gray-300">
              {authMode === 'signin' 
                ? "Sign in to access the admin dashboard" 
                : "Create your admin account"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {authError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Authentication Error</AlertTitle>
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}
            
            {debugInfo && (
              <Alert className="mb-4 bg-blue-500/20 border-blue-500/40">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Debug Info</AlertTitle>
                <AlertDescription>{debugInfo}</AlertDescription>
              </Alert>
            )}
            
            <Tabs 
              value={authMode} 
              onValueChange={(value) => {
                setAuthMode(value as 'signin' | 'signup');
                setAuthError(null);
              }}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Email</FormLabel>
                        <FormControl>
                          <Input 
                            className="bg-space-blue-light/10 border-space-purple/20 text-white" 
                            placeholder="admin@example.com" 
                            {...field} 
                            disabled 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            className="bg-space-blue-light/10 border-space-purple/20 text-white" 
                            placeholder="••••••••" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-space-purple hover:bg-space-purple/80"
                    disabled={isLoading}
                  >
                    {isLoading 
                      ? (authMode === 'signin' ? "Signing in..." : "Creating account...") 
                      : (authMode === 'signin' ? "Sign In" : "Create Account")
                    }
                  </Button>
                  <div className="text-sm text-center text-gray-400 mt-4">
                    <p>This page is restricted to administrator access only</p>
                  </div>
                </form>
              </Form>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
