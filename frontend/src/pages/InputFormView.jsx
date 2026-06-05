import React, { useState } from 'react';
import { FileText, Building2, Briefcase, AlertCircle, Loader2, History, Trash2, Calendar, Sparkles } from 'lucide-react';
import FileUpload from '../components/FileUpload';

export default function InputFormView({ 
  user, 
  history = [], 
  onHistorySelect, 
  onHistoryDelete, 
  onSubmit, 
  isLoading, 
  error 
}) {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [validationError, setValidationError] = useState(null);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setValidationError(null);

    if (!file) {
      setValidationError('Please upload a valid PDF resume file.');
      return;
    }
    if (!targetCompany.trim()) {
      setValidationError('Please specify the target company name.');
      return;
    }
    if (!jobDescription.trim()) {
      setValidationError('Please paste the target job description requirements.');
      return;
    }

    onSubmit({ file, targetCompany, jobDescription });
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* LEFT SIDEBAR: HISTORY LIST (Occupies 4 Cols, only shown if user is authenticated) */}
      {user ? (
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
            <History className="w-4 h-4 text-primary" /> Evaluation History
          </h2>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
            {history.length > 0 ? (
              history.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => onHistorySelect(item.id)}
                  className="group relative p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-primary/40 hover:bg-slate-950 transition-all duration-200 cursor-pointer flex justify-between items-center"
                >
                  <div className="space-y-1 min-w-0 pr-6">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs text-slate-200 truncate block">
                        {item.target_company}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                        item.match_score >= 80 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : item.match_score >= 60 
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {item.match_score.toFixed(0)}%
                      </span>
                    </div>
                    
                    <p className="text-[10px] text-slate-500 truncate font-mono">
                      {item.resume_filename}
                    </p>

                    <div className="flex items-center gap-1 text-[9px] text-slate-600">
                      <Calendar className="w-3 h-3" />
                      {formatDate(item.created_at)}
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onHistoryDelete(item.id);
                    }}
                    className="p-1.5 rounded-md text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2.5 top-1/2 -translate-y-1/2"
                    title="Delete history entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-10 px-4 border border-dashed border-slate-800 rounded-xl bg-slate-950/10">
                <div className="w-10 h-10 rounded-full bg-slate-950 border border-slate-850 flex items-center justify-center text-slate-600 font-bold mx-auto mb-3">
                  0
                </div>
                <h3 className="text-xs font-bold text-slate-400">No Past Evaluated Profiles</h3>
                <p className="text-[10px] text-slate-600 max-w-[180px] mx-auto mt-1 leading-relaxed">
                  Run a tactical evaluation on the right panel to initialize history logs.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Non-authenticated placeholder banner to incentivize registration
        <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl text-center space-y-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto text-primary">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-200">Unlock Analysis Logs</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Create a free account to automatically back up matching scores, revisions, and candidate history logs across devices.
            </p>
          </div>
          <p className="text-[10px] text-slate-600 italic">Anonymous scans are discarded on page reload.</p>
        </div>
      )}

      {/* RIGHT SIDEBAR: PARAMETERS SETUP FORM (Occupies 8 Cols) */}
      <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" /> Evaluation Setup Configuration
        </h2>

        <form onSubmit={handleFormSubmit} className="space-y-5">
          
          {/* DRAG AND DROP PORT */}
          <FileUpload 
            onFileSelect={(selectedFile) => {
              setFile(selectedFile);
              setValidationError(null);
            }}
            selectedFile={file}
            onFileRemove={() => setFile(null)}
          />

          {/* TARGET COMPANY */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-350 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-slate-500" /> Target Corporate Entity
            </label>
            <input 
              type="text"
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              placeholder="e.g., Google, Citadel, OpenAI, Stripe"
              className="w-full text-sm px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-850 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-700 font-medium text-slate-200"
            />
          </div>

          {/* JOB DESCRIPTION TEXTAREA */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-350 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-slate-500" /> Job Description Matrix
            </label>
            <textarea 
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the raw requirements, technical expectations, or corporate job description overview..."
              rows={8}
              className="w-full text-sm px-4 py-3 rounded-xl bg-slate-950 border border-slate-850 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-700 leading-relaxed font-normal text-slate-300 resize-none"
            />
          </div>

          {/* ERROR ALERT POP */}
          {(validationError || error) && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <p className="text-xs text-rose-400 font-medium leading-normal">{validationError || error}</p>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center px-6 py-3.5 border border-transparent text-sm font-semibold rounded-xl text-white bg-primary hover:bg-blue-600 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-primary/15 transition-all duration-150"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2.5 animate-spin" />
                Executing Tactical Evaluation Pipeline...
              </>
            ) : (
              'Run Match Diagnostics'
            )}
          </button>
        </form>
      </div>

    </div>
  );
}
