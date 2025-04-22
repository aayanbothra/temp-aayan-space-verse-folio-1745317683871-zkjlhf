
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type FormValues = z.infer<typeof formSchema>;

const NewsletterPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    }
  });

  useEffect(() => {
    // For development purposes, clear localStorage to ensure popup appears
    // Remove this in production
    // localStorage.removeItem('newsletter_popup_closed');
    // localStorage.removeItem('newsletter_subscribed');
    
    const hasClosedPopup = localStorage.getItem('newsletter_popup_closed');
    const hasSubscribed = localStorage.getItem('newsletter_subscribed');
    
    console.log('Newsletter popup check:', { hasClosedPopup, hasSubscribed });
    
    if (!hasClosedPopup && !hasSubscribed) {
      console.log('Setting timer for newsletter popup');
      const timer = setTimeout(() => {
        console.log('Timer completed - showing newsletter popup');
        setIsVisible(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email: data.email });

      if (error) throw error;
      
      localStorage.setItem('newsletter_subscribed', 'true');
      setIsVisible(false);
      
      toast({
        title: "Successfully subscribed!",
        description: "Thank you for joining our newsletter.",
      });
      
      form.reset();
    } catch (error: any) {
      toast({
        title: "Something went wrong",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('newsletter_popup_closed', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 25
              }
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.95, 
              y: 20,
              transition: {
                duration: 0.2
              }
            }}
            className="w-[400px] max-w-[90vw] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass-panel p-6 bg-background/95 shadow-xl border border-border/50">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 hover:bg-background/80"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
              
              <h3 className="text-xl font-bold mb-2 title-gradient">Join Our Newsletter</h3>
              <p className="text-sm mb-4">Stay updated with our latest projects and announcements!</p>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            placeholder="Enter your email" 
                            type="email"
                            className="bg-background/50"
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
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Subscribing..." : "Subscribe"}
                  </Button>
                </form>
              </Form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewsletterPopup;
