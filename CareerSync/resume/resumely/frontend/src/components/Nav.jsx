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
        <Link to="/" data-testid="nav-logo-link" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-black text-white flex items-center justify-center">
            <FileText size={16} strokeWidth={1.5} />
          </div>
          <span className="font-heading font-black text-lg tracking-tight">Resumely</span>
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
              className="inline-flex items-center bg-black text-white px-4 py-2 text-sm font-medium rounded-sm hover:bg-zinc-800 transition-colors"
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

