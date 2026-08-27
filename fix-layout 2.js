const fs = require('fs');
const content = [
  'import { createFileRoute, Outlet } from "@tanstack/react-router";',
  'import { Navbar } from "@/components/landing/navbar";',
  'import { Footer } from "@/components/landing/footer";',
  'import { AcademyProgressProvider } from "@/lib/academy-progress";',
  '',
  'export const Route = createFileRoute("/careersync-academy")({',
  '  component: AcademyShell,',
  '});',
  '',
  'function AcademyShell() {',
  '  return (',
  '    <AcademyProgressProvider>',
  '      <div className="academy-theme">',
  '        <Navbar />',
  '        <div className="pt-20">',
  '          <Outlet />',
  '        </div>',
  '        <Footer />',
  '      </div>',
  '    </AcademyProgressProvider>',
  '  );',
  '}',
].join('\n') + '\n';
const target = 'C:/Users/acera/OneDrive/Desktop/Bechnaseekho Folder/Career Compass AI/src/routes/careersync-academy.tsx';
fs.writeFileSync(target, content, 'utf8');
const written = fs.readFileSync(target, 'utf8');
console.log('Lines:', written.split('\n').length, '| Contains hours:', written.includes('const hours'));
