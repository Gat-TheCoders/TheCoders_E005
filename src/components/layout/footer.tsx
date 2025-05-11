
import { Copyright } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card/50 backdrop-blur-sm border-t border-border/40 py-6 mt-auto">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center text-xs text-muted-foreground">
        <div className="flex items-center justify-center mb-2">
          <Copyright className="h-3 w-3 mr-1" />
          <span>{currentYear} Own Finance. All Rights Reserved.</span>
        </div>
        <p className="mb-1">
          This platform and its content are for informational and educational purposes only and do not constitute financial advice.
        </p>
        <p>
          Use of this site constitutes acceptance of our Terms of Service and Privacy Policy (links to be added).
        </p>
        <p className="mt-2">
            Mock platform. Not for real financial transactions or advice.
        </p>
      </div>
    </footer>
  );
}
