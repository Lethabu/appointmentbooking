
import { InstyleNavbar } from '@/components/instyle/InstyleNavbar';
import { InstyleFooter } from '@/components/instyle/InstyleFooter';
import { Toaster } from '@/components/ui/toaster';

export default function InstyleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <InstyleNavbar />
      <main className="flex-grow">
        {children}
      </main>
      <InstyleFooter />
      <Toaster />
    </div>
  );
}
