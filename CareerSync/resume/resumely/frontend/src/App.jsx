import "@/App.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Landing from "@/pages/Landing";
import Templates from "@/pages/Templates";
import Editor from "@/pages/Editor";
import SharedView from "@/pages/SharedView";

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(91,61,245,0.95),_rgba(15,23,42,0.98))] px-6">
      <div className="relative w-full max-w-md rounded-[28px] border border-white/20 bg-white/10 p-8 text-center shadow-[0_30px_80px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        <div className="absolute inset-0 rounded-[28px] bg-[linear-gradient(135deg,rgba(255,255,255,0.3),transparent)]" />
        <div className="relative">
          <div className="loader-shell mx-auto mb-5">
            <div className="loader-ring" />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/70">CareerSync</p>
          <h1 className="mt-3 font-heading text-3xl font-black tracking-tight text-white">Resume Builder</h1>
          <p className="mt-2 text-sm leading-6 text-white/80">Crafting your ATS-ready experience with a cinematic launch.</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const id = window.setTimeout(() => setIsLoading(false), 900);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="App">
      {isLoading && <LoadingScreen />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/r/:shareId" element={<SharedView />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-right" richColors />
    </div>
  );
}

export default App;

