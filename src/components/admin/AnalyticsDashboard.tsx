
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface PageData {
  page: string;
  total_views: number;
}

const AnalyticsDashboard: React.FC = () => {
  const { data: pageData, isLoading } = useQuery<PageData[]>({
    queryKey: ['analytics'],
    queryFn: async () => {
      // Use a simple select query to get all analytics entries
      const { data, error } = await supabase
        .from('analytics')
        .select('page, views');
      
      if (error) throw error;
      
      // Aggregate the data manually
      const aggregatedData = data.reduce<Record<string, number>>((acc, item) => {
        if (!acc[item.page]) {
          acc[item.page] = 0;
        }
        acc[item.page] += item.views || 1;
        return acc;
      }, {});
      
      // Convert to array format for the chart and sort by views (descending)
      const result = Object.entries(aggregatedData)
        .map(([page, total_views]) => ({ page, total_views }))
        .sort((a, b) => b.total_views - a.total_views);
      
      return result;
    }
  });

  const totalViews = React.useMemo(() => {
    if (!pageData) return 0;
    return pageData.reduce((sum, entry) => sum + entry.total_views, 0);
  }, [pageData]);

  // Format page names for display
  const formatPageName = (page: string) => {
    return page === '/' ? 'Home' : page.slice(1).charAt(0).toUpperCase() + page.slice(2);
  };

  // Prepare chart data
  const chartData = React.useMemo(() => {
    if (!pageData) return [];
    return pageData.map(entry => ({
      name: formatPageName(entry.page),
      views: entry.total_views
    }));
  }, [pageData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Page Views</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalViews.toLocaleString()}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Page Views by Route</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
