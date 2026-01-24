import React from 'react';
import { Mail, ExternalLink, Sparkles, MessageCircle, FlaskConical, BookOpen, Puzzle, Linkedin } from 'lucide-react';
import { cn } from '@/utils/cn';

const XLogo = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
    focusable="false"
  >
    <path
      d="M18.9 2H22l-6.8 7.8L23 22h-6.3l-4.9-6.4L6.2 22H3l7.3-8.4L1 2h6.5l4.4 5.9L18.9 2ZM17.8 20h1.7L6.6 3.9H4.8L17.8 20Z"
      fill="currentColor"
    />
  </svg>
);

export const ReadmeApp = () => {
  const email = 'dewafakhashiva@duck.com';
  const linkedInUrl = 'https://linkedin.com/in/dewaa97';
  const xHandle = '@videcobe';
  const xUrl = 'https://x.com/videcobe';

  return (
    <div className="h-full w-full bg-background text-foreground overflow-y-auto">
      <div className="max-w-2xl mx-auto p-4 sm:p-6 pb-10">
        <div className="text-2xl font-bold">Read Me First</div>

        <div className="mt-2 text-sm text-foreground/90">
          This website is my personal workspace on the internet.
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          Part notebook, part playground. I use it to document what I’m learning, share small experiments, and think out loud while
          building products.
        </div>

        <div className="mt-6 space-y-6">
          <section className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles size={16} />
              What you’ll find here
            </div>

            <div className="mt-3 rounded-2xl border border-border bg-background/60 p-3">
              <div className="text-xs text-muted-foreground">
                Some notes include links or excerpts from public sources. Credit stays with the original authors—this is just my
                personal learning library, not me claiming ownership.
              </div>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-background/60 p-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <BookOpen size={16} />
                  Notes
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Quick write-ups and takeaways from what I’m reading, trying, and learning.
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-background/60 p-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <FlaskConical size={16} />
                  Experiments
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Small prototypes and tests. Sometimes rough, always honest.
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-background/60 p-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Puzzle size={16} />
                  Product thinking
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  How I frame problems, decisions, tradeoffs, and delivery.
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-background/60 p-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <MessageCircle size={16} />
                  Open conversations
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  A place to connect with people who like learning in public.
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-4">
            <div className="text-sm font-semibold">Who this is for</div>
            <div className="mt-2 text-sm text-muted-foreground">
              If you’re in any of these buckets, you’ll probably feel at home.
            </div>

            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl border border-border bg-background/60 p-3">
                <div className="text-sm font-semibold">You like discussing ideas openly</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  No gatekeeping. Just clear thinking, honest questions, and friendly debate.
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-background/60 p-3">
                <div className="text-sm font-semibold">You’re exploring AI, product, or Web3</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Especially if you’re bridging worlds: PM × AI, product × engineering, or Web2 × Web3.
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-background/60 p-3">
                <div className="text-sm font-semibold">You enjoy quick experiments</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  You’d rather test and learn than overthink and wait.
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-background/60 p-3">
                <div className="text-sm font-semibold">You’re still figuring things out</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Same. This space is built for momentum, not perfection.
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-4">
            <div className="text-sm font-semibold">Why you might reach out</div>
            <div className="mt-2 text-sm text-muted-foreground">
              I’m always up for a good conversation—especially when it helps us move from “interesting” to “actionable”.
            </div>

            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl border border-border bg-background/60 p-3">
                <div className="text-sm font-semibold">Talk through an idea</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Need a thinking partner? I’m happy to help you sharpen the problem and options.
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-background/60 p-3">
                <div className="text-sm font-semibold">Compare AI-assisted workflows</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Prompts, process, tooling—what’s working, what’s noise, and what’s next.
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-background/60 p-3">
                <div className="text-sm font-semibold">Prototype or test something quickly</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  A small experiment can answer bigger questions fast.
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-background/60 p-3">
                <div className="text-sm font-semibold">Exchange notes on Web3</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Learning paths, roles, product angles, and what you’re seeing in the space.
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-background/60 p-3">
                <div className="text-sm font-semibold">Or just say hi</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  A quick hello is always welcome.
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-4">
            <div className="text-sm font-semibold">Reach out</div>
            <div className="mt-2 text-sm text-muted-foreground">
              If any of the above resonates—or you just want to say hi—email is best. If that feels too formal, feel free to reach out on X.
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <a
                className={cn(
                  'h-9 px-3 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors',
                  'flex items-center gap-2'
                )}
                href={`mailto:${email}`}
              >
                <Mail size={16} />
                {email}
              </a>

              <a
                className={cn(
                  'h-9 px-3 rounded-xl text-sm font-semibold bg-muted text-foreground hover:bg-muted/70 transition-colors',
                  'flex items-center gap-2'
                )}
                href={xUrl}
                target="_blank"
                rel="noreferrer"
              >
                <XLogo size={16} />
                {xHandle}
              </a>

              <a
                className={cn(
                  'h-9 px-3 rounded-xl text-sm font-semibold bg-muted text-foreground hover:bg-muted/70 transition-colors',
                  'flex items-center gap-2'
                )}
                href={linkedInUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Linkedin size={16} />
                LinkedIn
                <ExternalLink size={14} className="opacity-80" />
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
