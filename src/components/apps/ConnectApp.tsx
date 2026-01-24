import React, { useMemo, useState } from 'react';
import { Mail, Copy, Send } from 'lucide-react';
import { cn } from '@/utils/cn';

export const ConnectApp = () => {
  const email = 'dewafakhashiva@duck.com';
  const [name, setName] = useState('');
  const [from, setFrom] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const mailto = useMemo(() => {
    const subject = name.trim().length ? `Reach out from ${name.trim()}` : 'Reach out';
    const body = `Name: ${name}\nEmail: ${from}\n\nMessage:\n${message}`;
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [email, name, from, message]);

  return (
    <div className="h-full w-full bg-background text-foreground p-6">
      <div className="max-w-xl mx-auto">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xl font-bold">Say Hi!</div>
            <div className="text-sm text-muted-foreground mt-1">
              This is a static site. The form opens your email client with a pre-filled message.
            </div>
          </div>
          <a
            href={`mailto:${email}`}
            className={cn(
              'h-9 px-3 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors',
              'flex items-center gap-2 shrink-0'
            )}
          >
            <Mail size={16} />
            Email
          </a>
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold">Email</div>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-muted px-2 py-1 rounded-lg">{email}</code>
              <button
                className={cn(
                  'h-8 px-2 rounded-lg text-xs font-semibold bg-muted hover:bg-muted/70 transition-colors',
                  'flex items-center gap-1'
                )}
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(email);
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 900);
                  } catch {
                    window.location.href = `mailto:${email}`;
                  }
                }}
              >
                <Copy size={14} />
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <form
            className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = mailto;
            }}
          >
            <div className="space-y-1">
              <label className="text-xs font-semibold">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="Your name"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold">Your email</label>
              <input
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="name@example.com"
              />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-semibold">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[140px] w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 resize-y"
                placeholder="Write a short message..."
              />
            </div>
            <div className="md:col-span-2 flex items-center gap-2">
              <button
                type="submit"
                className={cn(
                  'h-10 px-4 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors',
                  'flex items-center gap-2'
                )}
              >
                <Send size={16} />
                Open email client
              </button>
              <a className="text-sm text-muted-foreground underline" href={mailto}>
                Or use this mailto link
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
