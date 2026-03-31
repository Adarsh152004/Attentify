"use client";

import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Upload, FileText, CheckCircle, Loader2, X, BookOpen, Database, Cpu, Globe, ArrowUpRight } from "lucide-react";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface UploadedDoc {
  doc_id: string;
  filename: string;
  summary: string;
  status: string;
  uploadedAt: Date;
}

export function ResearchHub() {
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<UploadedDoc | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      alert("Only PDF files are supported.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/api/summarize-pdf", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      const newDoc: UploadedDoc = {
        doc_id: data.doc_id,
        filename: data.filename,
        summary: data.summary,
        status: data.status,
        uploadedAt: new Date(),
      };
      setDocs((prev) => [newDoc, ...prev]);
      setSelectedDoc(newDoc);
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <CardHeader className="border-b border-slate-800 px-6 py-4 bg-slate-900/50">
        <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center text-white tracking-tight">
              <BookOpen className="mr-3 h-4 w-4 text-sky-400" />
              Document Research Hub
              <span className="ml-4 text-[9px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-full uppercase flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Vector Sync
              </span>
            </CardTitle>
            <div className="flex items-center gap-3 text-slate-600">
               <Database size={14} />
               <Cpu size={14} />
            </div>
        </div>
        <CardDescription className="text-slate-500 text-[10px] uppercase tracking-wider mt-1">
          PDF Ingestion • AI Synthesis • Semantic Indexing
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-6 space-y-8 min-h-0 custom-scrollbar">
        {/* Upload Zone */}
        <div
          className={cn(
            "border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-4 group/upload relative overflow-hidden",
            dragOver
              ? "border-sky-500 bg-sky-500/5"
              : "border-slate-800 bg-slate-950 hover:border-sky-500/30 hover:bg-slate-900"
          )}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            hidden
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <Loader2 className="h-10 w-10 text-sky-500 animate-spin" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-sky-400 animate-pulse">Syncing Nodes...</p>
            </div>
          ) : (
            <>
              <div className="h-16 w-16 bg-slate-800 rounded-xl flex items-center justify-center mb-2 border border-slate-700 group-hover/upload:text-sky-400 transition-all">
                <Upload size={24} />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-white">Upload Research PDF</p>
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest max-w-xs mx-auto">
                  Institutional Reports • Technical Whitepapers • DRHPs
                </p>
              </div>
            </>
          )}
        </div>

        {/* Document List */}
        {docs.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Indexed Documents</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {docs.map((doc) => (
                <button
                  key={doc.doc_id}
                  onClick={() => setSelectedDoc(doc)}
                  className={cn(
                    "w-full text-left flex items-center gap-4 p-4 rounded-xl border transition-all group/item",
                    selectedDoc?.doc_id === doc.doc_id
                      ? "bg-sky-500/10 border-sky-500/30"
                      : "bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                  )}
                >
                  <div className={cn(
                    "h-10 w-10 rounded-lg flex items-center justify-center shrink-0 border transition-all",
                    selectedDoc?.doc_id === doc.doc_id ? "bg-sky-500/20 border-sky-500/30 text-sky-400" : "bg-slate-800 border-slate-700 text-slate-500"
                  )}>
                    <FileText size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate group-hover/item:text-sky-400 transition-colors uppercase tracking-tight">{doc.filename}</p>
                    <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1">
                      {doc.uploadedAt.toLocaleTimeString()} • {doc.status}
                    </p>
                  </div>
                  <CheckCircle className={cn("h-4 w-4 transition-all", selectedDoc?.doc_id === doc.doc_id ? "text-emerald-500" : "text-slate-800 opacity-20")} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Summary Panel */}
        {selectedDoc && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 animate-in hover:border-sky-500/20 transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-tight">
                      {selectedDoc.filename}
                    </h4>
                    <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1 flex items-center gap-2">
                        <Globe size={10} />
                        Synthesized AI Insight
                    </p>
                  </div>
              </div>
              <button 
                onClick={() => setSelectedDoc(null)} 
                className="p-2 text-slate-600 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="prose prose-invert prose-sm max-w-none prose-p:text-slate-400 prose-strong:text-white prose-a:text-sky-400 bg-slate-900 shadow-inner rounded-xl p-6 border border-slate-800">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedDoc.summary}</ReactMarkdown>
            </div>

            <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-500">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <p className="text-[10px] font-bold uppercase tracking-widest">Active Vector Link</p>
                </div>
                <button className="bg-sky-500 hover:bg-sky-600 text-white font-bold text-[10px] py-2 px-4 rounded-lg flex items-center gap-2 transition-all">
                    Open Workbench
                    <ArrowUpRight size={14} />
                </button>
            </div>
          </div>
        )}

        {docs.length === 0 && !uploading && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 border border-dashed border-slate-800 rounded-2xl opacity-40">
             <div className="h-14 w-14 bg-slate-800 rounded-xl flex items-center justify-center mb-6">
                <Database size={28} className="text-slate-600" />
             </div>
             <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Awaiting Research Documents</p>
          </div>
        )}
      </CardContent>
    </div>
  );
}
