import { createFileRoute } from "@tanstack/react-router";
import { EmployerLandingPage, employerPageHead } from "@/components/employers/employer-pages";

export const Route = createFileRoute("/for-hr-teams")({
  head: () => employerPageHead("hr"),
  component: () => <EmployerLandingPage pageKey="hr" />,
});
