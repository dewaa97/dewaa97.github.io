import React from 'react';
import portfolioData from '@/data/portfolio.json';
import { Briefcase, Code } from 'lucide-react';

export const PortfolioApp = () => {
  return (
    <div className="h-full overflow-y-auto bg-background text-foreground p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-12">
        <img src={portfolioData.personalInfo.photo} alt="Profile" className="w-24 h-24 rounded-full border-4 border-primary/20 shadow-lg" />
        <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">{portfolioData.personalInfo.name}</h1>
            <p className="text-xl text-muted-foreground">{portfolioData.personalInfo.title}</p>
            <p className="mt-2 max-w-lg text-foreground/80">{portfolioData.personalInfo.bio}</p>
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
    </div>
  );
};