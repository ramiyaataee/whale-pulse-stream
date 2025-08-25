import { useState } from "react";
import { 
  Menu, 
  Search, 
  Bell, 
  User, 
  Sun, 
  Moon,
  Globe,
  Wifi,
  WifiOff,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useServiceWorker } from "@/hooks/useServiceWorker";
import { useTradingStore } from "@/stores/tradingStore";

interface TopNavigationProps {
  onMenuClick: () => void;
}

export const TopNavigation = ({ onMenuClick }: TopNavigationProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { isOnline, updateAvailable, updateServiceWorker } = useServiceWorker();
  const { theme, language, updateSettings } = useTradingStore();

  return (
    <header className="sticky top-0 z-30 border-b border-border/50 bg-trading-card/95 backdrop-blur supports-[backdrop-filter]:bg-trading-card/60">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="جستجو در بازارها..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10 bg-background/50"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Status indicators */}
          <Badge variant={isOnline ? "default" : "destructive"} className="hidden sm:flex items-center gap-2">
            {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {isOnline ? "آنلاین" : "آفلاین"}
          </Badge>

          {/* Update available */}
          {updateAvailable && (
            <Button onClick={updateServiceWorker} size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              به‌روزرسانی
            </Button>
          )}

          {/* Language toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => updateSettings({ language: 'fa' })}>
                🇮🇷 فارسی
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateSettings({ language: 'en' })}>
                🇺🇸 English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => updateSettings({ 
              theme: theme === 'dark' ? 'light' : 'dark' 
            })}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-bear">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-4">
                <h3 className="font-semibold mb-2">اعلان‌های اخیر</h3>
                <div className="space-y-2">
                  <div className="text-sm p-2 rounded bg-bull/10 border border-bull/20">
                    🐋 تراکنش نهنگ: خرید 2.5M$ در NASDAQ
                  </div>
                  <div className="text-sm p-2 rounded bg-bear/10 border border-bear/20">
                    📊 RSI در منطقه اشباع خرید قرار گرفت
                  </div>
                  <div className="text-sm p-2 rounded bg-whale/10 border border-whale/20">
                    🎯 سیگنال صعودی قوی تولید شد
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="@user" />
                  <AvatarFallback>کا</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">کاربر آزمایشی</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    user@example.com
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>پروفایل</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>خروج</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};