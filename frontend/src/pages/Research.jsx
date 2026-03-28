import { useState, useRef, useEffect } from 'react';
import { UploadCloud, FileText, Trash2, Loader2, Sparkles, FileSearch } from 'lucide-react';
import researchService from '../services/researchService';
import { formatDate } from '../utils/formatters';

export default function Research() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState([]); // Support multiple selections if needed
  const fileInputRef = useRef(null);

  const fetchDocuments = async () => {
    try {
      const data = await researchService.getDocuments();
      setDocuments(data.documents || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if (file && file.type === 'application/pdf') {
       await handleUpload(file);
    } else {
        alert("Only PDF files are supported");
    }
  };
  
  const handleUpload = async (file) => {
    setUploading(true);
    try {
      await researchService.uploadDocument(file, file.name.replace('.pdf', ''));
      await fetchDocuments();
      // Optional: Add polling or websocket here to wait for embedding_status to become 'completed'
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await researchService.deleteDocument(id);
      setDocuments(prev => prev.filter(d => d.id !== id));
      if (selectedDocs.includes(id)) {
          setSelectedDocs(prev => prev.filter(dId => dId !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };
  
  const handleDocClick = (id) => {
      setSelectedDocs(prev => prev.includes(id) ? prev.filter(vid => vid !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-6 animate-fade-in-up h-[calc(100vh-8rem)]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Research Analysis</h1>
          <p className="text-white/50">Upload financial reports and let AI summarize and extract insights.</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="btn-gradient flex items-center shrink-0"
        >
          {uploading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</>
          ) : (
            <><UploadCloud className="w-4 h-4 mr-2" /> Upload PDF</>
          )}
        </button>
        <input
            type="file"
            accept="application/pdf"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileDrop}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-0">
        <div className="lg:col-span-1 glass-card p-0 flex flex-col h-full overflow-hidden">
             <div className="p-4 border-b border-white/5 flex items-center justify-between sticky top-0 bg-navy-800/80 backdrop-blur z-10">
                 <h2 className="text-sm font-semibold text-white">Your Documents</h2>
                 <span className="text-[10px] text-white/40 bg-white/5 px-2 py-1 rounded">{documents.length} Files</span>
             </div>
             <div className="flex-1 overflow-y-auto p-4 space-y-3">
                 {loading ? (
                     <div className="flex items-center justify-center h-full"><Loader2 className="w-6 h-6 text-accent-teal animate-spin" /></div>
                 ) : documents.length === 0 ? (
                     <div
                        className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-white/10 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/20 transition-all cursor-pointer"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleFileDrop}
                        onClick={() => fileInputRef.current?.click()}
                     >
                        <UploadCloud className="w-8 h-8 text-white/20 mb-3" />
                        <h3 className="text-sm font-medium text-white/70">Drop PDF here</h3>
                        <p className="text-xs text-white/40 mt-1">or click to browse</p>
                    </div>
                 ) : (
                     documents.map((doc) => (
                         <div
                            key={doc.id}
                            onClick={() => handleDocClick(doc.id)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer group flex items-start gap-3 ${
                                selectedDocs.includes(doc.id)
                                ? 'bg-accent-teal/10 border-accent-teal/30 shadow-accent'
                                : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'
                            }`}
                         >
                             <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${selectedDocs.includes(doc.id) ? 'bg-accent-teal/20 text-accent-teal' : 'bg-white/5 text-white/40'}`}>
                                 <FileText className="w-4 h-4" />
                             </div>
                             <div className="flex-1 min-w-0">
                                 <p className={`text-sm truncate font-medium ${selectedDocs.includes(doc.id) ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>
                                     {doc.title}
                                 </p>
                                 <div className="flex items-center gap-2 mt-1.5">
                                    <span className="text-[10px] text-white/30">{formatDate(doc.created_at)}</span>
                                    {doc.embedding_status === 'processing' && (
                                        <span className="text-[10px] text-blue-400 flex items-center gap-1 bg-blue-400/10 px-1.5 rounded">
                                            <Loader2 className="w-2.5 h-2.5 animate-spin" /> Indexing
                                        </span>
                                    )}
                                    {doc.embedding_status === 'completed' && (
                                        <span className="text-[10px] text-green-400 flex items-center gap-1 bg-green-400/10 px-1.5 rounded">
                                            <Sparkles className="w-2.5 h-2.5" /> Ready
                                        </span>
                                    )}
                                 </div>
                             </div>
                             <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(doc.id) }}
                                className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                             >
                                 <Trash2 className="w-3.5 h-3.5" />
                             </button>
                         </div>
                     ))
                 )}
             </div>
        </div>

        <div className="lg:col-span-2 glass-card p-8 flex flex-col items-center justify-center text-center overflow-y-auto">
             {selectedDocs.length > 0 ? (
                 <div className="w-full text-left self-start">
                     {selectedDocs.map(id => {
                         const doc = documents.find(d => d.id === id);
                         if(!doc) return null;
                         return (
                             <div key={doc.id} className="mb-8 last:mb-0">
                                 <h2 className="text-xl font-semibold text-white mb-4 border-b border-white/10 pb-4 flex items-center gap-3">
                                    <FileSearch className="w-5 h-5 text-accent-teal" />
                                    AI Summary: {doc.title}
                                 </h2>
                                 <div className="prose prose-invert max-w-none text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                                     {doc.summary || (
                                         doc.embedding_status === 'processing' 
                                         ? <span className="flex items-center gap-2 text-blue-400"><Loader2 className="w-4 h-4 animate-spin"/> AI is analyzing this document. Summary will appear shortly...</span>
                                         : <span className="text-white/30 italic">No summary available.</span>
                                     )}
                                 </div>
                             </div>
                         )
                     })}
                 </div>
             ) : (
                <>
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-white/30" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">Universal Document Intelligence</h3>
                    <p className="text-sm text-white/50 max-w-md mx-auto leading-relaxed">
                    Select a document from the left to view its AI-generated executive summary and extracted key metrics.
                    </p>
                </>
             )}
        </div>
      </div>
    </div>
  );
}
