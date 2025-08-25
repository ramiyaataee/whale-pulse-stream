import React, { Component, ErrorInfo, ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-trading-background flex items-center justify-center p-4">
          <Card className="max-w-lg w-full bg-trading-card border-border/50">
            <div className="p-8 text-center space-y-6">
              <div className="flex justify-center">
                <AlertTriangle className="h-16 w-16 text-bear" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-trading-foreground">
                  خطایی رخ داده است
                </h1>
                <p className="text-muted-foreground">
                  متأسفانه مشکلی در نمایش این بخش بوجود آمده است
                </p>
              </div>

              {/* Error Details (Development Mode) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="text-left p-4 bg-bear/10 border border-bear/20 rounded-lg">
                  <h3 className="font-semibold text-bear mb-2">جزئیات خطا:</h3>
                  <pre className="text-xs text-muted-foreground overflow-auto max-h-32">
                    {this.state.error.message}
                  </pre>
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs text-bear">
                        Stack Trace
                      </summary>
                      <pre className="text-xs text-muted-foreground mt-2 overflow-auto max-h-40">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={this.handleReset} className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  تلاش مجدد
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/'}
                  className="flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  بازگشت به خانه
                </Button>
                
                <Button 
                  variant="secondary" 
                  onClick={this.handleReload}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  بارگذاری مجدد
                </Button>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>اگر مشکل ادامه دارد، لطفاً:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>کش مرورگر را پاک کنید</li>
                  <li>از آخرین نسخه مرورگر استفاده کنید</li>
                  <li>اتصال اینترنت را بررسی کنید</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) => {
  return (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );
};