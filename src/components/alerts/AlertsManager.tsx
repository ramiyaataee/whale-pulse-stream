import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Bell, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  Target,
  Trash2,
  Edit
} from "lucide-react";

interface Alert {
  id: string;
  symbol: string;
  type: 'price' | 'technical' | 'whale';
  condition: string;
  value: number;
  active: boolean;
  triggered: boolean;
  createdAt: Date;
  message: string;
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    symbol: "NAS100",
    type: "price",
    condition: "above",
    value: 13600,
    active: true,
    triggered: false,
    createdAt: new Date(),
    message: "قیمت NAS100 از 13,600 عبور کرد"
  },
  {
    id: "2",
    symbol: "NAS100",
    type: "technical",
    condition: "rsi_overbought",
    value: 80,
    active: true,
    triggered: true,
    createdAt: new Date(Date.now() - 3600000),
    message: "RSI در منطقه اشباع خرید"
  },
  {
    id: "3",
    symbol: "NAS100",
    type: "whale",
    condition: "large_buy",
    value: 1000000,
    active: true,
    triggered: false,
    createdAt: new Date(Date.now() - 7200000),
    message: "تراکنش نهنگ بزرگ شناسایی شد"
  }
];

export const AlertsManager = () => {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [newAlertOpen, setNewAlertOpen] = useState(false);
  const [newAlert, setNewAlert] = useState<{
    symbol: string;
    type: Alert['type'];
    condition: string;
    value: number;
    message: string;
  }>({
    symbol: "NAS100",
    type: "price",
    condition: "above",
    value: 0,
    message: ""
  });

  const toggleAlert = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, active: !alert.active } : alert
    ));
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const createAlert = () => {
    const alert: Alert = {
      id: Date.now().toString(),
      ...newAlert,
      active: true,
      triggered: false,
      createdAt: new Date()
    };
    setAlerts(prev => [...prev, alert]);
    setNewAlertOpen(false);
    setNewAlert({
      symbol: "NAS100",
      type: "price",
      condition: "above",
      value: 0,
      message: ""
    });
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'price':
        return <Target className="h-4 w-4" />;
      case 'technical':
        return <TrendingUp className="h-4 w-4" />;
      case 'whale':
        return <div className="text-whale">🐋</div>;
    }
  };

  const getAlertTypeLabel = (type: Alert['type']) => {
    switch (type) {
      case 'price':
        return 'قیمتی';
      case 'technical':
        return 'تکنیکال';
      case 'whale':
        return 'نهنگ';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6 text-whale" />
          <h1 className="text-2xl font-bold text-trading-foreground">مدیریت هشدارها</h1>
        </div>

        <Dialog open={newAlertOpen} onOpenChange={setNewAlertOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              هشدار جدید
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>ایجاد هشدار جدید</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">نماد</label>
                <Select value={newAlert.symbol} onValueChange={(value) => setNewAlert(prev => ({...prev, symbol: value}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NAS100">NAS100</SelectItem>
                    <SelectItem value="SPX500">SPX500</SelectItem>
                    <SelectItem value="EURUSD">EURUSD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">نوع هشدار</label>
                <Select value={newAlert.type} onValueChange={(value: Alert['type']) => setNewAlert(prev => ({...prev, type: value}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">قیمتی</SelectItem>
                    <SelectItem value="technical">تکنیکال</SelectItem>
                    <SelectItem value="whale">نهنگ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">شرط</label>
                <Select value={newAlert.condition} onValueChange={(value) => setNewAlert(prev => ({...prev, condition: value}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">بالاتر از</SelectItem>
                    <SelectItem value="below">پایین‌تر از</SelectItem>
                    <SelectItem value="crosses_up">عبور به بالا</SelectItem>
                    <SelectItem value="crosses_down">عبور به پایین</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">مقدار</label>
                <Input
                  type="number"
                  value={newAlert.value}
                  onChange={(e) => setNewAlert(prev => ({...prev, value: parseFloat(e.target.value)}))}
                  placeholder="مقدار مورد نظر"
                />
              </div>

              <div>
                <label className="text-sm font-medium">پیام</label>
                <Input
                  value={newAlert.message}
                  onChange={(e) => setNewAlert(prev => ({...prev, message: e.target.value}))}
                  placeholder="پیام هشدار"
                />
              </div>

              <Button onClick={createAlert} className="w-full">
                ایجاد هشدار
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alerts List */}
      <Card className="bg-trading-card border-border/50">
        <div className="p-6">
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-4 rounded-lg border border-border/30 bg-background/5">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getAlertIcon(alert.type)}
                    <Badge variant="outline">{alert.symbol}</Badge>
                    <Badge variant="secondary" className="text-xs">
                      {getAlertTypeLabel(alert.type)}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-trading-foreground">
                      {alert.message || `${alert.condition} ${alert.value}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ایجاد شده: {alert.createdAt.toLocaleString('fa-IR')}
                    </p>
                  </div>

                  {alert.triggered && (
                    <Badge className="bg-bear/20 text-bear border-bear/30">
                      فعال شده
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={alert.active}
                    onCheckedChange={() => toggleAlert(alert.id)}
                  />
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteAlert(alert.id)}
                    className="text-bear hover:text-bear"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {alerts.length === 0 && (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">هیچ هشداری تنظیم نشده است</p>
              <Button variant="outline" className="mt-4" onClick={() => setNewAlertOpen(true)}>
                اولین هشدار را ایجاد کنید
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-chart border-border/50">
          <div className="text-center">
            <p className="text-2xl font-bold text-trading-foreground">{alerts.length}</p>
            <p className="text-sm text-muted-foreground">کل هشدارها</p>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-chart border-border/50">
          <div className="text-center">
            <p className="text-2xl font-bold text-bull">{alerts.filter(a => a.active).length}</p>
            <p className="text-sm text-muted-foreground">فعال</p>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-chart border-border/50">
          <div className="text-center">
            <p className="text-2xl font-bold text-bear">{alerts.filter(a => a.triggered).length}</p>
            <p className="text-sm text-muted-foreground">فعال شده</p>
          </div>
        </Card>
      </div>
    </div>
  );
};