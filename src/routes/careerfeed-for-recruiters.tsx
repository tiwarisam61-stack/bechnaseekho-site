import { createFileRoute } from "@tanstack/react-router";
import { EmployerLandingPage, employerPageHead } from "@/components/employers/employer-pages";

export const Route = createFileRoute("/careerfeed-for-recruiters")({
  head: () => employerPageHead("feed"),
  component: () => <EmployerLandingPage pageKey="feed" />,
});
