import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FileText } from "lucide-react";

export const Nav = ({ right = null }) => {
  const loc = useLocation();
  return (
    <header
      data-testid="site-nav"
      className="sticky top-0 z-50 bg-white border-b border-zinc-200 no-print"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link to="/" data-testid="nav-logo-link" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,_#5B3DF5,_#7B61FF)] text-white shadow-[0_10px_30px_rgba(91,61,245,0.25)]">
            <FileText size={16} strokeWidth={1.5} />
          </div>
          <div className="leading-tight">
            <div className="font-heading font-black text-lg tracking-tight text-zinc-900">Resume Builder</div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-violet-600">CareerSync</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link
            to="/templates"
            data-testid="nav-templates-link"
            className={`hover:text-black transition-colors ${loc.pathname.startsWith("/templates") ? "text-black font-semibold" : "text-zinc-600"}`}
          >
            Templates
          </Link>
          <Link
            to="/editor"
            data-testid="nav-editor-link"
            className={`hover:text-black transition-colors ${loc.pathname.startsWith("/editor") ? "text-black font-semibold" : "text-zinc-600"}`}
          >
            Editor
          </Link>
          <a
            href="#how"
            data-testid="nav-how-link"
            className="text-zinc-600 hover:text-black transition-colors"
          >
            How it works
          </a>
        </nav>
        <div className="flex items-center gap-3">
          {right}
          {!right && (
            <Link
              to="/templates"
              data-testid="nav-cta-btn"
              className="inline-flex items-center bg-[linear-gradient(135deg,_#5B3DF5,_#7B61FF)] text-white px-4 py-2 text-sm font-semibold rounded-full shadow-[0_10px_25px_rgba(91,61,245,0.22)] hover:translate-y-[-1px] transition-all"
            >
              Build resume
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Nav;

