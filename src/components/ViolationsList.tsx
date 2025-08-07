import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

interface ViolationsListProps {
  violations: Violation[];
  filter: string;
  statusFilter: string;
  onFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onEdit: (violation: Violation) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: 'open' | 'in-progress' | 'resolved') => void;
}

const ViolationsList: React.FC<ViolationsListProps> = ({
  violations,
  filter,
  statusFilter,
  onFilterChange,
  onStatusFilterChange,
  onEdit,
  onDelete,
  onUpdateStatus
}) => {
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

  const filteredViolations = violations.filter(v => {
    const matchesFilter = v.field1.toLowerCase().includes(filter.toLowerCase()) ||
                         v.field2.toLowerCase().includes(filter.toLowerCase()) ||
                         v.field7.toLowerCase().includes(filter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchesFilter && matchesStatus;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Все нарушения</CardTitle>
        <CardDescription>Список зарегистрированных нарушений</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Поиск по нарушениям..."
              value={filter}
              onChange={(e) => onFilterChange(e.target.value)}
              className="flex-1"
            />
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="open">Открыто</SelectItem>
                <SelectItem value="in-progress">В работе</SelectItem>
                <SelectItem value="resolved">Решено</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredViolations.map((violation) => (
              <div key={violation.id} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant={statusColors[violation.status] as any}>
                      {statusLabels[violation.status]}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {violation.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit(violation)}
                    >
                      <Icon name="Edit" className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete(violation.id)}
                    >
                      <Icon name="Trash2" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="font-medium">{violation.field1}</p>
                  <p className="text-sm text-gray-600">{violation.field2} • {violation.field3}</p>
                  <p className="text-sm text-gray-500 mt-1">{violation.field7}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateStatus(violation.id, 'in-progress')}
                    disabled={violation.status === 'in-progress'}
                  >
                    В работу
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateStatus(violation.id, 'resolved')}
                    disabled={violation.status === 'resolved'}
                  >
                    Решить
                  </Button>
                </div>
              </div>
            ))}
            {filteredViolations.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Icon name="Search" className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Нет нарушений для отображения</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ViolationsList;