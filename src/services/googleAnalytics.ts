
interface GAEvent {
  action: string;
  category?: string;
  label?: string;
  value?: number;
}

export const ga = {
  event({ action, category = "general", label, value }: GAEvent) {
    try {
      if (typeof window.gtag !== 'undefined') {
        console.log('🔍 Tracking GA Event:', { action, category, label, value });
        window.gtag('event', action, {
          event_category: category,
          event_label: label,
          value: value
        });
        return true;
      } else {
        console.warn('🚫 Google Analytics (gtag) is not loaded');
        this.checkGtagAvailability();
        return false;
      }
    } catch (error) {
      console.error('❌ Google Analytics tracking error:', error);
      return false;
    }
  },

  pageview(page_path: string) {
    try {
      if (typeof window.gtag !== 'undefined') {
        console.log('🔍 Tracking GA Pageview:', page_path);
        window.gtag('config', 'G-MDX57W8SXM', {
          page_path: page_path
        });
        return true;
      } else {
        console.warn('🚫 Google Analytics (gtag) is not loaded on pageview');
        this.checkGtagAvailability();
        return false;
      }
    } catch (error) {
      console.error('❌ Google Analytics pageview tracking error:', error);
      return false;
    }
  },
  
  checkGtagAvailability() {
    console.log('🔍 Checking GA availability:');
    console.log('- window.gtag exists:', typeof window.gtag !== 'undefined');
    console.log('- window.dataLayer exists:', typeof window.dataLayer !== 'undefined');
    console.log('- GA script in document:', !!document.querySelector('script[src*="googletagmanager.com/gtag"]'));
    
    // Check if GA script is loaded but blocked
    const gaScript = document.querySelector('script[src*="googletagmanager.com/gtag"]');
    if (gaScript) {
      // @ts-ignore - Property 'async' exists on HTMLScriptElement
      console.log('- GA script async:', gaScript.async);
    }
    
    // Debug help
    if (typeof window.gtag === 'undefined') {
      console.log('💡 Troubleshooting steps: Check for ad blockers, privacy extensions, or consent management tools.');
    }
  }
};

// We're removing this declaration as it conflicts with the one in vite-env.d.ts
// The declaration in vite-env.d.ts will be used instead
