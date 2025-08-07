import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';

interface FormData {
  field1: string;
  field2: string;
  field3: string;
  field4: string;
  field5: string;
  field6: string;
  field7: string;
  field8: string;
}

interface ViolationFormProps {
  formData: FormData;
  editId: string | null;
  onFormChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClearForm: () => void;
}

const ViolationForm: React.FC<ViolationFormProps> = ({
  formData,
  editId,
  onFormChange,
  onSubmit,
  onClearForm
}) => {
  const calculateDuration = () => {
    if (formData.field4 && formData.field5) {
      const start = new Date(formData.field4);
      const end = new Date(formData.field5);
      const diffMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
      return diffMinutes > 0 ? `${Math.floor(diffMinutes / 60)}ч ${diffMinutes % 60}м` : '0м';
    }
    return '0м';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editId ? 'Редактировать нарушение' : 'Новое нарушение'}</CardTitle>
        <CardDescription>Заполните форму для регистрации нарушения</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="field1">Тип нарушения</Label>
              <Select value={formData.field1} onValueChange={(value) => onFormChange('field1', value)}>
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
              <Select value={formData.field2} onValueChange={(value) => onFormChange('field2', value)}>
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
              onChange={(e) => onFormChange('field3', e.target.value)}
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
                onChange={(e) => onFormChange('field4', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="field5">Время окончания</Label>
              <Input
                id="field5"
                type="datetime-local"
                value={formData.field5}
                onChange={(e) => onFormChange('field5', e.target.value)}
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
              onChange={(e) => onFormChange('field7', e.target.value)}
              placeholder="Подробное описание произошедшего"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="field8">Предпринятые меры</Label>
            <Textarea
              id="field8"
              value={formData.field8}
              onChange={(e) => onFormChange('field8', e.target.value)}
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
              <Button type="button" variant="outline" onClick={onClearForm}>
                <Icon name="X" className="w-4 h-4 mr-2" />
                Отмена
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ViolationForm;