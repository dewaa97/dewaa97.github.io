import React from 'react';
import portfolioData from '@/data/portfolio.json';
import { Briefcase, Code, ExternalLink, Linkedin, Mail } from 'lucide-react';
import { cn } from '@/utils/cn';

export const PortfolioApp = () => {
  const linkedInUrl = 'https://linkedin.com/in/dewaa97';
  const email = 'dewafakhashiva@duck.com';

  return (
    <div className="h-full overflow-y-auto bg-background text-foreground p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-12">
        <img src={portfolioData.personalInfo.photo} alt="Profile" className="w-24 h-24 rounded-full border-4 border-primary/20 shadow-lg" />
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold">{portfolioData.personalInfo.name}</h1>
          <p className="text-xl text-muted-foreground">{portfolioData.personalInfo.title}</p>
          <p className="mt-2 max-w-lg text-foreground/80">{portfolioData.personalInfo.bio}</p>

          <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-2">
            <button
              className={cn(
                'h-9 px-3 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors',
                'flex items-center gap-2'
              )}
              onClick={() => window.open(linkedInUrl, '_blank', 'noopener,noreferrer')}
            >
              <Linkedin size={16} />
              LinkedIn
              <ExternalLink size={14} className="opacity-80" />
            </button>

            <a
              className={cn(
                'h-9 px-3 rounded-xl text-sm font-semibold bg-muted text-foreground hover:bg-muted/70 transition-colors',
                'flex items-center gap-2'
              )}
              href={`mailto:${email}`}
            >
              <Mail size={16} />
              {email}
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Experience */}
        <section className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-primary border-b border-border pb-2"><Briefcase size={20} /> Experience</h2>
            <div className="space-y-8">
                {portfolioData.experience.map(exp => (
                    <div key={exp.id} className="border-l-2 border-border pl-6 relative">
                        <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-background" />
                        <h3 className="font-semibold text-lg">{exp.position}</h3>
                        <div className="text-sm font-medium text-muted-foreground mb-2">{exp.company} • {exp.startDate} - {exp.endDate}</div>
                        <p className="text-sm mb-3 text-foreground/80 leading-relaxed">{exp.description}</p>
                        <div className="flex flex-wrap gap-2">
                            {exp.technologies.map(tech => (
                                <span key={tech} className="px-2.5 py-0.5 bg-secondary/10 text-secondary text-xs font-medium rounded-full">{tech}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Skills */}
        <section className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-primary border-b border-border pb-2"><Code size={20} /> Skills</h2>
            <div className="space-y-5">
                {portfolioData.skills.map(skill => (
                    <div key={skill.name}>
                        <div className="flex justify-between mb-1.5">
                            <span className="font-medium text-sm">{skill.name}</span>
                            <span className="text-muted-foreground text-xs font-mono">{skill.level}%</span>
                        </div>
                        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" style={{ width: `${skill.level}%` }} />
                        </div>
                    </div>
                ))}
            </div>
        </section>
      </div>

      <section className="mt-12 rounded-2xl border border-border bg-card p-6">
        <div className="text-lg font-bold">Interested in connecting?</div>
        <div className="text-sm text-muted-foreground mt-1">
          This is a static site. The form opens your email client with a pre-filled message.
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
            Email me
          </a>
          <button
            className="h-9 px-3 rounded-xl text-sm font-semibold bg-muted text-foreground hover:bg-muted/70 transition-colors"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(email);
              } catch {
                window.open(`mailto:${email}`, '_self');
              }
            }}
          >
            Copy email
          </button>
        </div>

        <ConnectInlineForm email={email} />
      </section>
    </div>
  );
};

const ConnectInlineForm = ({ email }: { email: string }) => {
  const [name, setName] = React.useState('');
  const [from, setFrom] = React.useState('');
  const [message, setMessage] = React.useState('');

  const subject = name.trim().length ? `Reach out from ${name.trim()}` : 'Reach out';
  const body = `Name: ${name}\nEmail: ${from}\n\nMessage:\n${message}`;
  const href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <form
      className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        window.location.href = href;
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
          className="min-h-[120px] w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 resize-y"
          placeholder="Write a short message..."
        />
      </div>
      <div className="md:col-span-2 flex items-center gap-2">
        <button
          type="submit"
          className="h-10 px-4 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Open email client
        </button>
        <a className="text-sm text-muted-foreground underline" href={href}>
          Or click here
        </a>
      </div>
    </form>
  );
};
