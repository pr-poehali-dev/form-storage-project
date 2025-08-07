import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
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

const ViolationsSystem = () => {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    field1: '',
    field2: '',
    field3: '',
    field4: '',
    field5: '',
    field6: '',
    field7: '',
    field8: ''
  });
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const savedViolations = localStorage.getItem('violationsData');
    if (savedViolations) {
      const parsed = JSON.parse(savedViolations);
      setViolations(parsed.map((v: any) => ({ ...v, createdAt: new Date(v.createdAt) })));
    }

    const savedFormData = localStorage.getItem('formData');
    if (savedFormData) {
      const now = new Date();
      const parsed = JSON.parse(savedFormData);
      setFormData({
        ...parsed,
        field4: parsed.field4 || now.toISOString().slice(0, 16),
        field5: parsed.field5 || new Date(now.getTime() + 3600000).toISOString().slice(0, 16)
      });
    } else {
      const now = new Date();
      setFormData(prev => ({
        ...prev,
        field4: now.toISOString().slice(0, 16),
        field5: new Date(now.getTime() + 3600000).toISOString().slice(0, 16)
      }));
    }
  }, []);

  const saveToStorage = (data: Violation[]) => {
    localStorage.setItem('violationsData', JSON.stringify(data));
  };

  const saveFormData = (data: any) => {
    localStorage.setItem('formData', JSON.stringify(data));
  };

  const handleFormChange = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    saveFormData(newFormData);
  };

  const calculateDuration = () => {
    if (formData.field4 && formData.field5) {
      const start = new Date(formData.field4);
      const end = new Date(formData.field5);
      const diffMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
      return diffMinutes > 0 ? `${Math.floor(diffMinutes / 60)}ч ${diffMinutes % 60}м` : '0м';
    }
    return '0м';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newViolation: Violation = {
      id: editId || Date.now().toString(),
      ...formData,
      status: 'open',
      createdAt: new Date()
    };

    let updatedViolations;
    if (editId) {
      updatedViolations = violations.map(v => v.id === editId ? newViolation : v);
    } else {
      updatedViolations = [...violations, newViolation];
    }

    setViolations(updatedViolations);
    saveToStorage(updatedViolations);
    clearForm();
  };

  const clearForm = () => {
    const now = new Date();
    const clearedData = {
      field1: '',
      field2: '',
      field3: '',
      field4: now.toISOString().slice(0, 16),
      field5: new Date(now.getTime() + 3600000).toISOString().slice(0, 16),
      field6: '',
      field7: '',
      field8: ''
    };
    setFormData(clearedData);
    saveFormData(clearedData);
    setEditId(null);
  };

  const handleEdit = (violation: Violation) => {
    setFormData({
      field1: violation.field1,
      field2: violation.field2,
      field3: violation.field3,
      field4: violation.field4,
      field5: violation.field5,
      field6: violation.field6,
      field7: violation.field7,
      field8: violation.field8
    });
    setEditId(violation.id);
  };

  const handleDelete = (id: string) => {
    const updatedViolations = violations.filter(v => v.id !== id);
    setViolations(updatedViolations);
    saveToStorage(updatedViolations);
  };

  const updateStatus = (id: string, status: 'open' | 'in-progress' | 'resolved') => {
    const updatedViolations = violations.map(v => 
      v.id === id ? { ...v, status } : v
    );
    setViolations(updatedViolations);
    saveToStorage(updatedViolations);
  };

  const filteredViolations = violations.filter(v => {
    const matchesFilter = v.field1.toLowerCase().includes(filter.toLowerCase()) ||
                         v.field2.toLowerCase().includes(filter.toLowerCase()) ||
                         v.field7.toLowerCase().includes(filter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchesFilter && matchesStatus;
  });

  const stats = {
    total: violations.length,
    open: violations.filter(v => v.status === 'open').length,
    inProgress: violations.filter(v => v.status === 'in-progress').length,
    resolved: violations.filter(v => v.status === 'resolved').length
  };

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Icon name="Shield" className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Система учета нарушений</h1>
                <p className="text-sm text-gray-500">Корпоративная система контроля</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-blue-600">
                <Icon name="Users" className="w-4 h-4 mr-1" />
                Администратор
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Icon name="BarChart3" className="w-4 h-4" />
              <span>Главная</span>
            </TabsTrigger>
            <TabsTrigger value="violations" className="flex items-center space-x-2">
              <Icon name="FileText" className="w-4 h-4" />
              <span>Учет нарушений</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <Icon name="PieChart" className="w-4 h-4" />
              <span>Отчеты</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Icon name="Settings" className="w-4 h-4" />
              <span>Настройки</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
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
          </TabsContent>

          {/* Violations Form */}
          <TabsContent value="violations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{editId ? 'Редактировать нарушение' : 'Новое нарушение'}</CardTitle>
                  <CardDescription>Заполните форму для регистрации нарушения</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="field1">Тип нарушения</Label>
                        <Select value={formData.field1} onValueChange={(value) => handleFormChange('field1', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите тип" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="safety">Нарушение безопасности</SelectItem>
                            <SelectItem value="discipline">Дисциплинарное нарушение</SelectItem>
                            <SelectItem value="procedure">Нарушение процедур</SelectItem>
                            <SelectItem value="quality">Нарушение качества</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="field2">Приоритет</Label>
                        <Select value={formData.field2} onValueChange={(value) => handleFormChange('field2', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите приоритет" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="critical">Критический</SelectItem>
                            <SelectItem value="high">Высокий</SelectItem>
                            <SelectItem value="medium">Средний</SelectItem>
                            <SelectItem value="low">Низкий</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="field3">Подразделение</Label>
                      <Input
                        id="field3"
                        value={formData.field3}
                        onChange={(e) => handleFormChange('field3', e.target.value)}
                        placeholder="Введите подразделение"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="field4">Время начала</Label>
                        <Input
                          id="field4"
                          type="datetime-local"
                          value={formData.field4}
                          onChange={(e) => handleFormChange('field4', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="field5">Время окончания</Label>
                        <Input
                          id="field5"
                          type="datetime-local"
                          value={formData.field5}
                          onChange={(e) => handleFormChange('field5', e.target.value)}
                        />
                      </div>
                    </div>

                    <Alert>
                      <Icon name="Clock" className="h-4 w-4" />
                      <AlertDescription>
                        Длительность: {calculateDuration()}
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                      <Label htmlFor="field7">Описание нарушения</Label>
                      <Textarea
                        id="field7"
                        value={formData.field7}
                        onChange={(e) => handleFormChange('field7', e.target.value)}
                        placeholder="Подробное описание произошедшего"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="field8">Предпринятые меры</Label>
                      <Textarea
                        id="field8"
                        value={formData.field8}
                        onChange={(e) => handleFormChange('field8', e.target.value)}
                        placeholder="Описание предпринятых мер"
                        rows={3}
                      />
                    </div>

                    <div className="flex space-x-2 pt-4">
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                        <Icon name="Save" className="w-4 h-4 mr-2" />
                        {editId ? 'Обновить' : 'Сохранить'}
                      </Button>
                      {editId && (
                        <Button type="button" variant="outline" onClick={clearForm}>
                          <Icon name="X" className="w-4 h-4 mr-2" />
                          Отмена
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

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
                        onChange={(e) => setFilter(e.target.value)}
                        className="flex-1"
                      />
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                                onClick={() => handleEdit(violation)}
                              >
                                <Icon name="Edit" className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(violation.id)}
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
                              onClick={() => updateStatus(violation.id, 'in-progress')}
                              disabled={violation.status === 'in-progress'}
                            >
                              В работу
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStatus(violation.id, 'resolved')}
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
            </div>
          </TabsContent>

          {/* Reports */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Статистика по статусам</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>Открыто</span>
                      </div>
                      <span className="font-semibold">{stats.open}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span>В работе</span>
                      </div>
                      <span className="font-semibold">{stats.inProgress}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Решено</span>
                      </div>
                      <span className="font-semibold">{stats.resolved}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Общая информация</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Всего записей:</span>
                      <span className="font-semibold">{stats.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Процент решенных:</span>
                      <span className="font-semibold">
                        {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Активных нарушений:</span>
                      <span className="font-semibold">{stats.open + stats.inProgress}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Настройки системы</CardTitle>
                <CardDescription>Конфигурация параметров учета</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Справочники</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Типы нарушений</h4>
                        <p className="text-sm text-gray-500">Управление категориями нарушений</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Подразделения</h4>
                        <p className="text-sm text-gray-500">Список подразделений организации</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Управление данными</h3>
                    <div className="space-y-2">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          const data = JSON.stringify(violations, null, 2);
                          const blob = new Blob([data], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'violations-export.json';
                          a.click();
                        }}
                      >
                        <Icon name="Download" className="w-4 h-4 mr-2" />
                        Экспорт данных
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ViolationsSystem;