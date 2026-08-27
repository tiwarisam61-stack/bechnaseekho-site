import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { AcademyProgressProvider } from "@/lib/academy-progress";

export const Route = createFileRoute("/careersync-academy")({
  component: AcademyShell,
});

function AcademyShell() {
  return (
    <AcademyProgressProvider>
      <div className="academy-theme">
        <Navbar />
        <div className="pt-20">
          <Outlet />
        </div>
        <Footer />
      </div>
    </AcademyProgressProvider>
  );
}

