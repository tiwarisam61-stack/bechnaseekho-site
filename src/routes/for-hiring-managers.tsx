import { createFileRoute } from "@tanstack/react-router";
import { EmployerLandingPage, employerPageHead } from "@/components/employers/employer-pages";

export const Route = createFileRoute("/for-hiring-managers")({
  head: () => employerPageHead("managers"),
  component: () => <EmployerLandingPage pageKey="managers" />,
});
