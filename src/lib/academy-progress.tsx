import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { buildUnits, courses, type Course, type Unit } from "./academy-courses";

export type CourseProgress = {
  completed: string[];
  scores: Record<string, number>;
  lastUnit?: string | undefined;
  enrolled?: boolean | undefined;
  updatedAt?: number | undefined;
};

type Store = {
  courses: Record<string, CourseProgress>;
  xp: number;
  streak: number;
};

const KEY = "careersync-learning-v1";
const empty: Store = { courses: {}, xp: 0, streak: 1 };

const Ctx = createContext<{
  store: Store;
  hydrated: boolean;
  complete: (courseId: string, unitId: string, score?: number) => void;
  reset: (courseId: string) => void;
  touch: (courseId: string, unitId: string) => void;
} | null>(null);

export function AcademyProgressProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<Store>(empty);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setStore({ ...empty, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const persist = useCallback((next: Store) => {
    setStore(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const complete = useCallback(
    (courseId: string, unitId: string, score?: number) => {
      setStore((prev) => {
        const cp = prev.courses[courseId] ?? { completed: [], scores: {} };
        const already = cp.completed.includes(unitId);
        const next: Store = {
          ...prev,
          xp: prev.xp + (already ? 0 : 50),
          courses: {
            ...prev.courses,
            [courseId]: {
              ...cp,
              enrolled: true,
              completed: already ? cp.completed : [...cp.completed, unitId],
              scores: score === undefined ? cp.scores : { ...cp.scores, [unitId]: score },
              lastUnit: unitId,
              updatedAt: Date.now(),
            },
          },
        };
        try {
          localStorage.setItem(KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    [],
  );

  const touch = useCallback((courseId: string, unitId: string) => {
    setStore((prev) => {
      const cp = prev.courses[courseId] ?? { completed: [], scores: {} };
      if (cp.lastUnit === unitId && cp.enrolled) return prev;
      const next: Store = {
        ...prev,
        courses: {
          ...prev.courses,
          [courseId]: { ...cp, enrolled: true, lastUnit: unitId, updatedAt: Date.now() },
        },
      };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const reset = useCallback(
    (courseId: string) => {
      persist({
        ...store,
        courses: { ...store.courses, [courseId]: { completed: [], scores: {} } },
      });
    },
    [persist, store],
  );

  const value = useMemo(
    () => ({ store, hydrated, complete, reset, touch }),
    [store, hydrated, complete, reset, touch],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAcademyProgress() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAcademyProgress must be used inside AcademyProgressProvider");
  return ctx;
}

export type CourseStats = {
  units: Unit[];
  completed: string[];
  percent: number;
  completedChapters: number;
  totalChapters: number;
  exercisesDone: number;
  totalExercises: number;
  testsDone: number;
  totalTests: number;
  finalDone: boolean;
  finalScore?: number | undefined;
  certificateUnlocked: boolean;
  isUnlocked: (unitId: string) => boolean;
  nextUnit?: Unit | undefined;
  scores: Record<string, number>;
  started: boolean;
};

export function computeStats(course: Course, cp?: CourseProgress): CourseStats {
  const units = buildUnits(course);
  const completed = cp?.completed ?? [];
  const scores = cp?.scores ?? {};
  const gradable = units.filter((u) => u.kind !== "completion");
  const done = gradable.filter((u) => completed.includes(u.id)).length;
  const percent = Math.round((done / gradable.length) * 100);

  const chapters = units.filter((u) => u.kind === "lesson");
  const exercises = units.filter((u) => u.kind === "exercise");
  const tests = units.filter((u) => u.kind === "test");
  const finalUnit = units.find((u) => u.kind === "test" && u.final);

  const indexOf = (id: string) => units.findIndex((u) => u.id === id);
  const isUnlocked = (unitId: string) => {
    const i = indexOf(unitId);
    if (i <= 0) return true;
    return units.slice(0, i).every((u) => completed.includes(u.id));
  };

  const nextUnit = units.find((u) => !completed.includes(u.id));
  const finalDone = finalUnit ? completed.includes(finalUnit.id) : false;

  return {
    units,
    completed,
    percent,
    completedChapters: chapters.filter((c) => completed.includes(c.id)).length,
    totalChapters: chapters.length,
    exercisesDone: exercises.filter((c) => completed.includes(c.id)).length,
    totalExercises: exercises.length,
    testsDone: tests.filter((c) => completed.includes(c.id)).length,
    totalTests: tests.length,
    finalDone,
    finalScore: finalUnit ? scores[finalUnit.id] : undefined,
    certificateUnlocked: percent === 100,
    isUnlocked,
    nextUnit,
    scores,
    started: completed.length > 0,
  };
}

export function useAcademyCourseStats(course: Course): CourseStats {
  const { store } = useAcademyProgress();
  return useMemo(() => computeStats(course, store.courses[course.id]), [course, store]);
}

export function useAllAcademyStats() {
  const { store } = useAcademyProgress();
  return useMemo(
    () => courses.map((c) => ({ course: c, stats: computeStats(c, store.courses[c.id]) })),
    [store],
  );
}
