import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

import ViolationForm from '@/components/ViolationForm';
import ViolationsList from '@/components/ViolationsList';
import Dashboard from '@/components/Dashboard';
import Reports from '@/components/Reports';
import Settings from '@/components/Settings';

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

  const stats = {
    total: violations.length,
    open: violations.filter(v => v.status === 'open').length,
    inProgress: violations.filter(v => v.status === 'in-progress').length,
    resolved: violations.filter(v => v.status === 'resolved').length
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

          <TabsContent value="dashboard">
            <Dashboard violations={violations} stats={stats} />
          </TabsContent>

          <TabsContent value="violations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ViolationForm
                formData={formData}
                editId={editId}
                onFormChange={handleFormChange}
                onSubmit={handleSubmit}
                onClearForm={clearForm}
              />

              <ViolationsList
                violations={violations}
                filter={filter}
                statusFilter={statusFilter}
                onFilterChange={setFilter}
                onStatusFilterChange={setStatusFilter}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onUpdateStatus={updateStatus}
              />
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <Reports stats={stats} />
          </TabsContent>

          <TabsContent value="settings">
            <Settings violations={violations} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ViolationsSystem;