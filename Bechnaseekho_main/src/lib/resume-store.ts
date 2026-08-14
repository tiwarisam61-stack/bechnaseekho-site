import { useCallback, useEffect, useRef, useState } from "react";
import type { ResumeDoc } from "./resume-types";
import { createResume } from "./resume-types";

const KEY = "careersync.resume.v1";
const VERSIONS_KEY = "careersync.resume.versions.v1";

export interface VersionSnapshot {
  id: string;
  name: string;
  at: number;
  doc: ResumeDoc;
}

export function loadResume(): ResumeDoc | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ResumeDoc) : null;
  } catch {
    return null;
  }
}

export function saveResume(doc: ResumeDoc) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(doc));
}

export function loadVersions(): VersionSnapshot[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(VERSIONS_KEY) ?? "[]") as VersionSnapshot[];
  } catch {
    return [];
  }
}

export function pushVersion(doc: ResumeDoc, label: string) {
  const versions = loadVersions();
  const next = [
    { id: Math.random().toString(36).slice(2, 9), name: label, at: Date.now(), doc },
    ...versions,
  ].slice(0, 12);
  window.localStorage.setItem(VERSIONS_KEY, JSON.stringify(next));
  return next;
}

/** Undo/redo aware resume state with debounced autosave. */
export function useResumeState(initial: ResumeDoc) {
  const [doc, setDocState] = useState<ResumeDoc>(initial);
  const past = useRef<ResumeDoc[]>([]);
  const future = useRef<ResumeDoc[]>([]);
  const [, force] = useState(0);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const setDoc = useCallback((updater: (d: ResumeDoc) => ResumeDoc) => {
    setDocState((current) => {
      past.current = [...past.current, current].slice(-60);
      future.current = [];
      return { ...updater(current), updatedAt: Date.now() };
    });
    force((n) => n + 1);
  }, []);

  const replaceDoc = useCallback((next: ResumeDoc) => {
    setDocState((current) => {
      past.current = [...past.current, current].slice(-60);
      future.current = [];
      return { ...next, updatedAt: Date.now() };
    });
    force((n) => n + 1);
  }, []);

  const undo = useCallback(() => {
    setDocState((current) => {
      const prev = past.current.pop();
      if (!prev) return current;
      future.current = [current, ...future.current];
      return prev;
    });
    force((n) => n + 1);
  }, []);

  const redo = useCallback(() => {
    setDocState((current) => {
      const [next, ...rest] = future.current;
      if (!next) return current;
      future.current = rest;
      past.current = [...past.current, current];
      return next;
    });
    force((n) => n + 1);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      saveResume(doc);
      setSavedAt(Date.now());
    }, 700);
    return () => clearTimeout(t);
  }, [doc]);

  return {
    doc,
    setDoc,
    replaceDoc,
    undo,
    redo,
    canUndo: past.current.length > 0,
    canRedo: future.current.length > 0,
    savedAt,
  };
}

export function ensureResume(templateId?: string): ResumeDoc {
  const existing = loadResume();
  if (existing) {
    return templateId
      ? { ...existing, settings: { ...existing.settings, templateId } }
      : existing;
  }
  return createResume(templateId ?? "meridian");
}
