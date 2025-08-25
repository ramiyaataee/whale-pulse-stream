import { 
  BarChart3, 
  TrendingUp, 
  Settings, 
  Bell, 
  Briefcase, 
  Target,
  History,
  BookOpen,
  X,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onClose: () => void;
}

const navigationItems = [
  { icon: BarChart3, label: "داشبورد", href: "/", active: true },
  { icon: TrendingUp, label: "تحلیل بازار", href: "/analysis", badge: "جدید" },
  { icon: Briefcase, label: "پورتفولیو", href: "/portfolio", badge: "3" },
  { icon: Target, label: "استراتژی", href: "/strategy" },
  { icon: History, label: "تاریخچه", href: "/history" },
  { icon: Bell, label: "هشدارها", href: "/alerts", badge: "12" },
];

const toolsItems = [
  { icon: BookOpen, label: "آموزش", href: "/education" },
  { icon: Settings, label: "تنظیمات", href: "/settings" },
];

export const Sidebar = ({ onClose }: SidebarProps) => {
  return (
    <div className="flex h-full flex-col bg-trading-card border-r border-border/50">
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Activity className="h-8 w-8 text-whale" />
          <h1 className="text-xl font-bold text-trading-foreground">WhalePulse</h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="lg:hidden"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Separator className="bg-border/50" />

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <nav className="space-y-8">
          {/* Main Navigation */}
          <div>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              اصلی
            </h2>
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <Button
                  key={item.href}
                  variant={item.active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 text-right",
                    item.active && "bg-whale/20 text-whale border-whale/30"
                  )}
                  onClick={onClose}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <Badge 
                      variant="secondary" 
                      className="text-xs bg-primary/20 text-primary border-primary/30"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              ابزارها
            </h2>
            <div className="space-y-1">
              {toolsItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  className="w-full justify-start gap-3 text-right"
                  onClick={onClose}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4">
        <div className="rounded-lg bg-gradient-whale p-4 text-center">
          <h3 className="font-semibold text-white">ارتقا به حرفه‌ای</h3>
          <p className="text-sm text-white/80">دسترسی به ویژگی‌های پیشرفته</p>
          <Button variant="secondary" size="sm" className="mt-2 w-full">
            ارتقا دهید
          </Button>
        </div>
      </div>
    </div>
  );
};