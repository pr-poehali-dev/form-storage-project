import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Violation {
  id: string;
  field1: string;
  field2: string;
  field3: string;
  field4: string;
  field5: string;
  field6: string;
  field7: string;
  field8: string;
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: Date;
}

interface Stats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
}

interface DashboardProps {
  violations: Violation[];
  stats: Stats;
}

const Dashboard: React.FC<DashboardProps> = ({ violations, stats }) => {
  const statusColors = {
    open: 'destructive',
    'in-progress': 'secondary',
    resolved: 'default'
  };

  const statusLabels = {
    open: 'Открыто',
    'in-progress': 'В работе',
    resolved: 'Решено'
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего нарушений</CardTitle>
            <Icon name="FileText" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Открыто</CardTitle>
            <Icon name="AlertCircle" className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.open}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">В работе</CardTitle>
            <Icon name="Clock" className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Решено</CardTitle>
            <Icon name="CheckCircle" className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Последние нарушения</CardTitle>
          <CardDescription>Недавно добавленные записи</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {violations.slice(0, 5).map((violation) => (
              <div key={violation.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Icon name="AlertTriangle" className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="font-medium">{violation.field1}</p>
                    <p className="text-sm text-gray-500">{violation.field2}</p>
                  </div>
                </div>
                <Badge variant={statusColors[violation.status] as any}>
                  {statusLabels[violation.status]}
                </Badge>
              </div>
            ))}
            {violations.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Icon name="FileX" className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Нет записей для отображения</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;