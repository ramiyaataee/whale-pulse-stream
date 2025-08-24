import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Settings, Bell, TrendingUp, Shield, Database, Download, Upload, RotateCcw } from "lucide-react";
import { useTradingStore } from "@/stores/tradingStore";
import { useToast } from "@/hooks/use-toast";

const SettingsPanel = () => {
  const store = useTradingStore();
  const { toast } = useToast();

  const handleExportSettings = () => {
    const settings = store.exportSettings();
    const blob = new Blob([settings], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'whale-pulse-settings.json';
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "تنظیمات صادر شد",
      description: "فایل تنظیمات با موفقیت دانلود شد",
    });
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        store.importSettings(content);
        toast({
          title: "تنظیمات وارد شد",
          description: "تنظیمات با موفقیت بازیابی شد",
        });
      };
      reader.readAsText(file);
    }
  };

  const handleResetSettings = () => {
    store.resetSettings();
    toast({
      title: "تنظیمات بازنشانی شد",
      description: "تمام تنظیمات به حالت پیش‌فرض برگشت",
      variant: "destructive"
    });
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          تنظیمات حرفه‌ای پلتفرم
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              عمومی
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              هشدارها
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              تحلیل
            </TabsTrigger>
            <TabsTrigger value="risk" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              ریسک
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              API
            </TabsTrigger>
          </TabsList>

          {/* تنظیمات عمومی */}
          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-mode">حالت خودکار</Label>
                  <Switch
                    id="auto-mode"
                    checked={store.autoMode}
                    onCheckedChange={(checked) => store.updateSettings({ autoMode: checked })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>بازه به‌روزرسانی (ثانیه)</Label>
                  <Slider
                    value={[store.refreshInterval / 1000]}
                    onValueChange={(value) => store.updateSettings({ refreshInterval: value[0] * 1000 })}
                    max={60}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-sm text-muted-foreground">
                    هر {store.refreshInterval / 1000} ثانیه
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>تم رنگی</Label>
                  <Select value={store.theme} onValueChange={(value: any) => store.updateSettings({ theme: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">تاریک</SelectItem>
                      <SelectItem value="light">روشن</SelectItem>
                      <SelectItem value="auto">خودکار</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>زبان</Label>
                  <Select value={store.language} onValueChange={(value: any) => store.updateSettings({ language: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fa">فارسی</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* تنظیمات هشدارها */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">فعال‌سازی هشدارها</h4>
                {Object.entries(store.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label htmlFor={key}>
                      {key === 'enabled' && 'هشدارها فعال'}
                      {key === 'sound' && 'صدای هشدار'}
                      {key === 'desktop' && 'هشدار دسکتاپ'}
                      {key === 'mobile' && 'هشدار موبایل'}
                      {key === 'whaleAlerts' && 'هشدار نهنگ‌ها'}
                      {key === 'signalAlerts' && 'هشدار سیگنال‌ها'}
                      {key === 'priceAlerts' && 'هشدار قیمت'}
                    </Label>
                    <Switch
                      id={key}
                      checked={value}
                      onCheckedChange={(checked) => 
                        store.updateSettings({ 
                          notifications: { ...store.notifications, [key]: checked } 
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* تنظیمات تحلیل */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">آستانه RSI</h4>
                <div className="space-y-2">
                  <Label>اشباع خرید</Label>
                  <Slider
                    value={[store.analysis.rsiThreshold.overbought]}
                    onValueChange={(value) => 
                      store.updateSettings({ 
                        analysis: { 
                          ...store.analysis, 
                          rsiThreshold: { ...store.analysis.rsiThreshold, overbought: value[0] }
                        } 
                      })
                    }
                    max={100}
                    min={50}
                    step={1}
                  />
                  <div className="text-sm text-muted-foreground">{store.analysis.rsiThreshold.overbought}</div>
                </div>
                
                <div className="space-y-2">
                  <Label>اشباع فروش</Label>
                  <Slider
                    value={[store.analysis.rsiThreshold.oversold]}
                    onValueChange={(value) => 
                      store.updateSettings({ 
                        analysis: { 
                          ...store.analysis, 
                          rsiThreshold: { ...store.analysis.rsiThreshold, oversold: value[0] }
                        } 
                      })
                    }
                    max={50}
                    min={0}
                    step={1}
                  />
                  <div className="text-sm text-muted-foreground">{store.analysis.rsiThreshold.oversold}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>حداقل مبلغ نهنگ (میلیون دلار)</Label>
                  <Input
                    type="number"
                    value={store.analysis.whaleMinAmount}
                    onChange={(e) => 
                      store.updateSettings({ 
                        analysis: { ...store.analysis, whaleMinAmount: Number(e.target.value) }
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>سطح اطمینان</Label>
                  <Select 
                    value={store.analysis.confidenceLevel} 
                    onValueChange={(value: any) => 
                      store.updateSettings({ 
                        analysis: { ...store.analysis, confidenceLevel: value }
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">پایین</SelectItem>
                      <SelectItem value="medium">متوسط</SelectItem>
                      <SelectItem value="high">بالا</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* تنظیمات ریسک */}
          <TabsContent value="risk" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>درصد Stop Loss</Label>
                  <Slider
                    value={[store.risk.stopLossPercent]}
                    onValueChange={(value) => 
                      store.updateSettings({ 
                        risk: { ...store.risk, stopLossPercent: value[0] }
                      })
                    }
                    max={10}
                    min={0.5}
                    step={0.1}
                  />
                  <div className="text-sm text-muted-foreground">{store.risk.stopLossPercent}%</div>
                </div>

                <div className="space-y-2">
                  <Label>درصد Take Profit</Label>
                  <Slider
                    value={[store.risk.takeProfitPercent]}
                    onValueChange={(value) => 
                      store.updateSettings({ 
                        risk: { ...store.risk, takeProfitPercent: value[0] }
                      })
                    }
                    max={20}
                    min={1}
                    step={0.1}
                  />
                  <div className="text-sm text-muted-foreground">{store.risk.takeProfitPercent}%</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>اندازه پوزیشن (دلار)</Label>
                  <Input
                    type="number"
                    value={store.risk.positionSize}
                    onChange={(e) => 
                      store.updateSettings({ 
                        risk: { ...store.risk, positionSize: Number(e.target.value) }
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>حداکثر سطح ریسک</Label>
                  <Select 
                    value={store.risk.maxRiskLevel} 
                    onValueChange={(value: any) => 
                      store.updateSettings({ 
                        risk: { ...store.risk, maxRiskLevel: value }
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">پایین</SelectItem>
                      <SelectItem value="medium">متوسط</SelectItem>
                      <SelectItem value="high">بالا</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* تنظیمات API */}
          <TabsContent value="api" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="api-enabled">API فعال</Label>
                <Switch
                  id="api-enabled"
                  checked={store.api.enabled}
                  onCheckedChange={(checked) => 
                    store.updateSettings({ 
                      api: { ...store.api, enabled: checked }
                    })
                  }
                />
              </div>

              {store.api.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Endpoints</h4>
                    <div className="space-y-2">
                      <Label>Market API</Label>
                      <Input
                        value={store.api.endpoints.market}
                        onChange={(e) => 
                          store.updateSettings({ 
                            api: { 
                              ...store.api, 
                              endpoints: { ...store.api.endpoints, market: e.target.value }
                            }
                          })
                        }
                        placeholder="https://api.example.com/market"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Whale API</Label>
                      <Input
                        value={store.api.endpoints.whale}
                        onChange={(e) => 
                          store.updateSettings({ 
                            api: { 
                              ...store.api, 
                              endpoints: { ...store.api.endpoints, whale: e.target.value }
                            }
                          })
                        }
                        placeholder="https://api.example.com/whale"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">API Keys</h4>
                    <div className="space-y-2">
                      <Label>Primary Key</Label>
                      <Input
                        type="password"
                        value={store.api.keys.primary}
                        onChange={(e) => 
                          store.updateSettings({ 
                            api: { 
                              ...store.api, 
                              keys: { ...store.api.keys, primary: e.target.value }
                            }
                          })
                        }
                        placeholder="API Key"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Backup Key</Label>
                      <Input
                        type="password"
                        value={store.api.keys.backup}
                        onChange={(e) => 
                          store.updateSettings({ 
                            api: { 
                              ...store.api, 
                              keys: { ...store.api.keys, backup: e.target.value }
                            }
                          })
                        }
                        placeholder="Backup API Key"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-6" />

        {/* عملیات تنظیمات */}
        <div className="flex flex-wrap gap-4">
          <Button onClick={handleExportSettings} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            صادرات تنظیمات
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2" asChild>
            <label htmlFor="import-settings">
              <Upload className="h-4 w-4" />
              وارد کردن تنظیمات
            </label>
          </Button>
          <input
            id="import-settings"
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImportSettings}
          />
          
          <Button onClick={handleResetSettings} variant="destructive" className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            بازنشانی تنظیمات
          </Button>
          
          <div className="ml-auto">
            <Badge variant={store.autoMode ? "default" : "secondary"}>
              {store.autoMode ? "خودکار فعال" : "دستی"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsPanel;