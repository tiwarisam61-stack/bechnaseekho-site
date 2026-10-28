import { createFileRoute } from "@tanstack/react-router";
import { EmployerLandingPage, employerPageHead } from "@/components/employers/employer-pages";

export const Route = createFileRoute("/employers")({
  head: () => employerPageHead("employers"),
  component: () => <EmployerLandingPage pageKey="employers" />,
});
