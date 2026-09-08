import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  type AtsAnalysis,
  type AtsOptimization,
} from "./ats.schema";
import {
  analyzeResumeWithAi,
  applySuggestionsWithAi,
  optimizeResumeWithAi,
} from "./ats-ai.server";

export const analyzeResume = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ resumeText: z.string().min(40).max(60000) }).parse(input))
  .handler(async ({ data }): Promise<AtsAnalysis> => {
    return analyzeResumeWithAi(data.resumeText);
  });

export const optimizeResume = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ resumeText: z.string().min(40).max(60000), focus: z.array(z.string()).max(30).optional() }).parse(input),
  )
  .handler(async ({ data }): Promise<AtsOptimization> => {
    return optimizeResumeWithAi(data.resumeText, data.focus);
  });

export const applySuggestions = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        resumeText: z.string().min(40).max(60000),
        suggestions: z
          .array(z.object({ title: z.string(), how: z.string() }))
          .min(1)
          .max(10),
      })
      .parse(input),
  )
  .handler(async ({ data }): Promise<AtsOptimization> => {
    return applySuggestionsWithAi(data.resumeText, data.suggestions);
  });
