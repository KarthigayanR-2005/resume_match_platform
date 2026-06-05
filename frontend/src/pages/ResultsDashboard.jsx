import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  User, 
  ShieldAlert, 
  Briefcase, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Compass, 
  GraduationCap, 
  BrainCircuit, 
  HelpCircle,
  FileCode2,
  BookmarkCheck
} from 'lucide-react';
import { MatchRing, CategoryBar } from '../components/MetricCharts';
import SkillBadge from '../components/SkillBadge';

export default function ResultsDashboard({ data, onBack }) {
  const [activeTab, setActiveTab] = useState('match');

  if (!data) return null;

  // Extract variables safely
  const matchScore = data.overall_match_percentage || 0;
  const personalInfo = data.personal_info || {};
  const skills = data.skills || {};
  const missingSkills = data.missing_critical_skills || [];
  const bulletRefinements = data.bullet_point_refinements || [];
  const projectEnhancements = data.project_enhancement_suggestions || [];
  const companyTargeting = data.company_specific_targeting || {};
  const experienceList = data.experience || [];
  const projectsList = data.projects || [];
  const education = data.education || {};

  // Compute category matching percentages for visualization
  const getSkillCategoryStats = () => {
    const stats = [];
    
    // Helper to see if a parsed skill matches any missing critical skill (case insensitive)
    const isMissing = (skillName) => {
      return missingSkills.some(m => m.toLowerCase() === skillName.toLowerCase());
    };

    Object.entries(skills).forEach(([category, items]) => {
      if (category === 'soft_skills' || !Array.isArray(items) || items.length === 0) return;
      
      const missingCount = items.filter(item => isMissing(item)).length;
      const totalCount = items.length;
      const matchedCount = Math.max(0, totalCount - missingCount);
      const percentage = totalCount > 0 ? (matchedCount / totalCount) * 100 : 100;
      
      let prettyLabel = category.replace(/_/g, ' ');
      prettyLabel = prettyLabel.charAt(0).toUpperCase() + prettyLabel.slice(1);

      stats.push({
        key: category,
        label: prettyLabel,
        percentage,
        matchedCount,
        totalCount,
        items
      });
    });

    return stats;
  };

  const skillStats = getSkillCategoryStats();

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      
      {/* ACTION TOP HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Parameters setup
        </button>
        
        <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500">
          <span>Targeting:</span>
          <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary font-bold">
            {data.company_specific_targeting?.culture_and_values_alignment?.company_core_focus ? 'AI Engine Calibrated' : 'Custom Schema'}
          </span>
        </div>
      </div>

      {/* TABS CONTAINER */}
      <div className="flex border-b border-slate-800 bg-slate-950/40 p-1.5 rounded-xl border">
        {[
          { id: 'match', label: 'Match Diagnostics', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'refinement', label: 'Resume Revision Lab', icon: <Sparkles className="w-4 h-4" /> },
          { id: 'projects', label: 'Portfolio Upgrades', icon: <FileCode2 className="w-4 h-4" /> },
          { id: 'interview', label: 'Interview Blueprint', icon: <Compass className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center justify-center gap-2 flex-1 py-3 text-xs font-semibold rounded-lg transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-slate-900 border border-slate-800 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: MATCH DIAGNOSTICS */}
      {activeTab === 'match' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* TOP METRIC CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* RADIAL SCORE WHEEL (Occupies 4 Cols) */}
            <div className="md:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Job Match Score</h3>
              <MatchRing score={matchScore} size={150} />
              <p className="text-[10px] text-slate-500 mt-4 leading-relaxed max-w-[200px]">
                Computed via semantic parsing comparing job description matrix and profile credentials.
              </p>
            </div>

            {/* EXTRACTED PROFILE INFO (Occupies 8 Cols) */}
            <div className="md:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" /> Profile Credentials Overview
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Full Name</span>
                    <span className="text-slate-200 font-semibold text-sm mt-0.5 block">{personalInfo.name || 'Not Discovered'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Contact Info</span>
                    <span className="text-slate-200 font-semibold text-sm mt-0.5 block">
                      {personalInfo.email || 'Email missing'} {personalInfo.phone ? `| ${personalInfo.phone}` : ''}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Discovered Social / Portfolio URLs</span>
                    <div className="flex flex-wrap gap-2">
                      {personalInfo.links && personalInfo.links.length > 0 ? (
                        personalInfo.links.map((link, idx) => (
                          <a 
                            key={idx} 
                            href={link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[10px] px-2.5 py-1 rounded-md bg-slate-950 border border-slate-850 text-primary hover:bg-slate-850 hover:text-blue-400 transition-all font-mono truncate max-w-xs"
                          >
                            {link}
                          </a>
                        ))
                      ) : (
                        <span className="text-slate-500 italic text-[11px]">No hyperlinked networks extracted</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Education Sub-badge */}
              {education && education.degree && (
                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center gap-2.5 text-xs text-slate-400">
                  <GraduationCap className="w-4 h-4 text-primary shrink-0" />
                  <span className="truncate">
                    Parsed: <strong className="text-slate-200">{education.degree} in {education.field_of_study}</strong> at {education.institution} {education.graduation_year ? `(${education.graduation_year})` : ''}
                  </span>
                </div>
              )}
            </div>

          </div>

          {/* MISSING CORE COMPETENCIES ALERT BAR */}
          {missingSkills.length > 0 && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 flex gap-3.5 shadow-md">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wide">Critical Technology Gaps Identified</h4>
                <p className="text-[11px] text-rose-400/80 leading-relaxed">
                  The target job description highlights the following core tools/concepts which are missing in your resume. Consider revising your projects to include these keywords:
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {missingSkills.map((skill, idx) => (
                    <SkillBadge key={idx} name={skill} type="missing" />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CATEGORIZED SKILL PROGRESS AND BADGES */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
            <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3">
              Technical Skill Alignments
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Side: Progress bars */}
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Coverage by Segment</span>
                {skillStats.length > 0 ? (
                  skillStats.map((stat) => (
                    <CategoryBar 
                      key={stat.key}
                      label={stat.label}
                      percentage={stat.percentage}
                      matchedCount={stat.matchedCount}
                      totalCount={stat.totalCount}
                    />
                  ))
                ) : (
                  <span className="text-slate-500 italic text-xs">No categorizable skill arrays extracted</span>
                )}
              </div>

              {/* Right Side: Skill items view */}
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Parsed Skills Database</span>
                
                <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                  {Object.entries(skills).map(([category, items]) => {
                    if (category === 'soft_skills' || !Array.isArray(items) || items.length === 0) return null;
                    const prettyCategory = category.replace(/_/g, ' ').toUpperCase();
                    return (
                      <div key={category} className="space-y-1.5">
                        <span className="text-[9px] font-bold text-slate-500 tracking-wider block font-mono">{prettyCategory}</span>
                        <div className="flex flex-wrap gap-1.5">
                          {items.map((item, idx) => {
                            const isSkillMissing = missingSkills.some(m => m.toLowerCase() === item.toLowerCase());
                            return (
                              <SkillBadge 
                                key={idx} 
                                name={item} 
                                type={isSkillMissing ? 'missing' : 'present'} 
                              />
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* TAB 2: RESUME REVISION LAB */}
      {activeTab === 'refinement' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6 animate-fadeIn">
          <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Metrics-Driven Bullet Revision Lab
            </h3>
            <span className="text-[9px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded">
              STAR / XYZ Framework Active
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            The AI engine rewrote your resume accomplishments. The proposed versions introduce metrics, scale, and high-impact technical verbs to catch the eye of recruiting managers:
          </p>

          <div className="space-y-5">
            {bulletRefinements.length > 0 ? (
              bulletRefinements.map((item, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4.5 rounded-xl bg-slate-950 border border-slate-850 hover:border-slate-800 transition-colors">
                  
                  {/* Weak original line */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5" /> Weak Original Statement
                    </span>
                    <p className="text-xs text-slate-450 italic pl-1 leading-relaxed">
                      "{item.original_text}"
                    </p>
                  </div>

                  {/* Refined strong line */}
                  <div className="space-y-3 md:border-l md:border-slate-850 md:pl-5">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Enhanced Placement Verbs
                      </span>
                      <p className="text-xs text-slate-200 font-semibold pl-1 leading-relaxed">
                        "{item.suggested_text}"
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-900">
                      <span className="text-[9px] font-bold text-primary uppercase tracking-wide block">Recruiter Alignment Insight</span>
                      <p className="text-[10px] text-slate-500 mt-1 pl-1 leading-relaxed">
                        {item.reason}
                      </p>
                    </div>
                  </div>

                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-550 border border-dashed border-slate-850 rounded-xl">
                No bullet optimizations needed or generated.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: PORTFOLIO UPGRADES */}
      {activeTab === 'projects' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Architectural Improvements */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-primary" /> Technical Architecture Enhancement Suggestions
            </h3>
            
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              We parsed your project highlights and generated placement-ready optimizations to make your architectural descriptions sound more robust for elite teams:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {projectEnhancements.length > 0 ? (
                projectEnhancements.map((proj, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-3 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-200 font-mono flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {proj.project_title}
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-slate-900 mt-2">
                        {proj.suggested_additions}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-slate-500 italic">
                  No explicit portfolio upgrades extracted.
                </div>
              )}
            </div>
          </div>

          {/* Project Pitching Strategy */}
          {companyTargeting.tailored_project_talking_points && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
              <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
                <BookmarkCheck className="w-4 h-4 text-emerald-400" /> Tailored Interview Project Pitch Blueprint
              </h3>
              
              <p className="text-xs text-slate-400 leading-relaxed">
                When talking to engineering interviewers, pivot your narrative angles to align with their core focus areas:
              </p>

              <div className="space-y-3.5">
                {companyTargeting.tailored_project_talking_points.map((pitch, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-850 text-xs">
                    <span className="font-mono font-bold text-primary block text-xs mb-1.5">
                      {pitch.project_title}
                    </span>
                    <p className="text-slate-400 leading-relaxed">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mr-2 block sm:inline mb-1 sm:mb-0">
                        Pitch Strategy Angle:
                      </span>
                      {pitch.pitch_angle}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 4: INTERVIEW BLUEPRINT */}
      {activeTab === 'interview' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
            <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
              <Compass className="w-4 h-4 text-primary" /> Target Corporate Interview Blueprint
            </h3>

            {companyTargeting.culture_and_values_alignment && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 border-b border-slate-800 pb-6">
                
                {/* Culture Card */}
                <div className="md:col-span-4 p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-3">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                    Core Technical Values
                  </span>
                  <div>
                    <span className="text-[9px] text-slate-500 font-bold block uppercase">Focus Area:</span>
                    <span className="text-xs text-slate-200 font-semibold mt-0.5 block">
                      {companyTargeting.culture_and_values_alignment.company_core_focus}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-900">
                    <span className="text-[9px] text-slate-500 font-bold block uppercase">Theme Pivot Strategy:</span>
                    <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
                      {companyTargeting.culture_and_values_alignment.resume_theme_adjustment}
                    </p>
                  </div>
                </div>

                {/* Topics Card */}
                <div className="md:col-span-8 p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-4">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
                    Expected Technical Interview Scope
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-1.5">
                        High Probability CS Topics:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {companyTargeting.technical_interview_focus?.expected_topics?.map((topic, i) => (
                          <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-350">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-1.5">
                        Stack & System Architecture Inquiries:
                      </span>
                      <ul className="text-[10px] text-slate-450 space-y-1.5 list-disc pl-3.5">
                        {companyTargeting.technical_interview_focus?.probable_tech_stack_questions?.map((q, i) => (
                          <li key={i} className="leading-snug">{q}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* General Advice */}
            <div className="flex gap-3 text-xs text-slate-450 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-850">
              <HelpCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-300">How to use this blueprint?</strong>
                <p className="mt-1">
                  Combine the expected interview topics with the portfolio pitching angles. Prepare STAR methodology answers around latency, optimization, and system scalability constraints as highlighted in the Cultural core values values above.
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
