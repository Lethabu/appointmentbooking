import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';

interface KPIWidgetProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
}

export function KPIWidget({
  title,
  value,
  change,
  trend,
  icon: Icon,
}: KPIWidgetProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground">
          {trend === 'up' && (
            <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
          )}
          {trend === 'down' && (
            <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
          )}
          <span>{change}</span>
        </div>
      </CardContent>
    </Card>
  );
}
