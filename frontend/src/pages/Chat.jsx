import ChatWidget from '../components/ChatWidget';

export default function Chat() {
  return (
    <div className="animate-fade-in-up h-[calc(100vh-8rem)]">
      <div className="h-full flex flex-col">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-white mb-2">AI Chat Assistant</h1>
          <p className="text-white/50">Ask questions about markets or your uploaded research documents.</p>
        </div>
        
        <div className="flex-1 min-h-0">
           {/* Not compact */}
           <ChatWidget />
        </div>
      </div>
    </div>
  );
}
