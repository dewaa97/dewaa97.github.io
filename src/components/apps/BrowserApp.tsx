import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Search, ExternalLink, AlertCircle } from 'lucide-react';

export const BrowserApp = () => {
  const [url, setUrl] = useState('https://example.com');
  const [inputUrl, setInputUrl] = useState('https://example.com');
  const [isLoading, setIsLoading] = useState(true);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let target = inputUrl;
    if (!target.startsWith('http')) {
        target = `https://${target}`;
    }
    setUrl(target);
    setInputUrl(target);
    setIsLoading(true);
  };

  const openInNewTab = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-1">
            <button className="p-1.5 hover:bg-muted rounded-md text-muted-foreground transition-colors"><ArrowLeft size={16} /></button>
            <button className="p-1.5 hover:bg-muted rounded-md text-muted-foreground transition-colors"><ArrowRight size={16} /></button>
            <button 
                onClick={() => { setIsLoading(true); const curr = url; setUrl(''); setTimeout(() => setUrl(curr), 10); }} 
                className="p-1.5 hover:bg-muted rounded-md text-muted-foreground transition-colors"
            >
                <RotateCw size={16} />
            </button>
        </div>
        <form onSubmit={handleNavigate} className="flex-1">
            <div className="relative flex items-center">
                <div className="absolute left-2 text-muted-foreground"><Search size={14} /></div>
                <input 
                    type="text" 
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    className="w-full h-8 pl-8 pr-4 bg-muted/50 hover:bg-muted/80 focus:bg-background border border-transparent focus:border-primary rounded-md text-sm outline-none transition-all"
                />
            </div>
        </form>
        <button 
            onClick={openInNewTab}
            className="p-1.5 hover:bg-muted rounded-md text-muted-foreground transition-colors"
            title="Open in new tab"
        >
            <ExternalLink size={16} />
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 relative bg-white overflow-hidden">
        {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )}
        
        {/* User Friendly Error Message (Visible when iframe fails/refuses to connect) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center -z-0 text-muted-foreground p-8 text-center bg-background">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <AlertCircle size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Can't display this website here</h3>
            <p className="text-sm max-w-md text-muted-foreground mb-6">
                We're not able to open <strong>{new URL(url).hostname}</strong> directly within this browser window due to security restrictions, but we can redirect you to the website directly.
            </p>
            <button 
                onClick={openInNewTab} 
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors shadow-sm text-sm font-medium"
            >
                <ExternalLink size={16} />
                Open in new tab
            </button>
        </div>

        {/* Iframe with transparency to show error message behind it if content is blocked */}
        <iframe 
            src={url} 
            className="w-full h-full border-0 relative z-10"
            onLoad={() => setIsLoading(false)}
            title="Browser"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
            referrerPolicy="no-referrer"
            // If the iframe loads successfully, it covers the error message.
            // If it refuses to connect (browser error page), browsers often show a grey sad face or nothing.
            // Unfortunately, we can't detect X-Frame-Options error via JS due to cross-origin policy.
            // So we rely on the UI behind it being visible if the iframe is transparent/blocked? 
            // Actually, if connection is refused, Chrome shows a grey background error page inside iframe.
            // We can't style that.
            // But if we make the iframe background transparent? No, browser error page has its own style.
            // The only way is to assume it might fail for certain domains or just provide the "Open in new tab" always accessible.
            // But the user asked for a friendly message INSTEAD of "service unavailable".
            // If the browser shows "refused to connect" natively, we can't override that visual inside the iframe.
            // BUT, we can try to fetch the URL first? No, CORS.
            
            // Best effort: Show the error message BEHIND. If iframe is blocked completely (e.g. some browsers hide it), it shows.
            // If browser shows "sad face", user still sees the top bar to open in new tab.
            
            // However, the user said "jangan bikin service is not available gitu". 
            // That message usually comes from the browser's native error page inside the iframe.
            // We cannot change the browser's native error page.
            // The only workaround is if we detect it's a "hard" failure? No.
            
            // Let's improve the "behind" UI so if the iframe is transparent or blocked in a way that shows background, it looks good.
            // And maybe we can add a small "Help" floating button or bar inside the content area?
        />
      </div>
    </div>
  );
};
