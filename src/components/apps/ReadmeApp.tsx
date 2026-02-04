import React from 'react';
import { Mail, ExternalLink, Sparkles, MessageCircle, FlaskConical, BookOpen, Puzzle, Linkedin } from 'lucide-react';
import { cn } from '@/utils/cn';

export const ReadmeApp = () => {
  const email = 'dewafakhashiva@duck.com';
  const linkedInUrl = 'https://linkedin.com/in/dewaa97';

  return (
    <div className="h-full w-full bg-background text-foreground overflow-y-auto">
      <div className="max-w-2xl mx-auto p-4 sm:p-6 pb-10">
        <div className="text-2xl font-bold">Read Me First</div>

        <section className="mt-6 rounded-2xl border border-border bg-card p-4 bg-gradient-to-br from-primary/10 to-transparent">
          <div className="flex items-center gap-2 text-sm font-semibold mb-3">
            <MessageCircle size={16} />
            For Recruiters & Collaborators
          </div>
          <div className="space-y-2 text-sm text-foreground/90">
            <p>
              Hey! If you're checking out this site, feel free to explore my <strong>Resume</strong> section to see what I've been working on and my experience.
            </p>
            <p>
              If you think we'd be a great fit to work together or if you have an opportunity that aligns with my skills, I'd love to hear from you—don't hesitate to reach out! And if you just want to chat, exchange ideas, or grab a coffee, I'm totally down for that too. Let's connect!
            </p>
          </div>
        </section>

        <div className="mt-6 text-2xl font-bold">About This Space</div>

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
                <div className="text-sm font-semibold">You’re exploring AI or product</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Especially if you’re bridging worlds: PM × AI, or product × engineering.
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
              If any of the above resonates—or you just want to say hi—email is best.
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
