import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

interface SettingsProps {
  violations: Violation[];
}

const Settings: React.FC<SettingsProps> = ({ violations }) => {
  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default Settings;