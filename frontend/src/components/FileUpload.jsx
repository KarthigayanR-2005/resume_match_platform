import React, { useState, useRef } from 'react';
import { Upload, FileText, X } from 'lucide-react';

export default function FileUpload({ onFileSelect, selectedFile, onFileRemove }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        onFileSelect(file);
      } else {
        alert("Please upload a PDF document only.");
      }
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-300">
        Resume Document (PDF)
      </label>

      {!selectedFile ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
            isDragActive
              ? "border-primary bg-primary/5 scale-[0.99]"
              : "border-slate-700 bg-slate-900/50 hover:bg-slate-900 hover:border-slate-600"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileInput}
          />
          <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
            <div className="p-3 rounded-lg bg-slate-800 text-slate-400 mb-3 transition-colors duration-200 group-hover:bg-slate-700">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <p className="mb-1 text-sm text-slate-300">
              <span className="font-semibold text-primary">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-slate-500">Only PDF formats accepted</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-700 rounded-xl animate-fadeIn">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-500">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onFileRemove();
            }}
            className="p-1 rounded-md text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}