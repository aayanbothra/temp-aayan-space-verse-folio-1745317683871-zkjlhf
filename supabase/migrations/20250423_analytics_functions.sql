
-- This function groups analytics data by page and returns the total views
CREATE OR REPLACE FUNCTION group_page_views()
RETURNS TABLE (
    page TEXT,
    total_views BIGINT
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        page,
        SUM(views)::BIGINT as total_views
    FROM analytics
    GROUP BY page
    ORDER BY total_views DESC;
$$;
