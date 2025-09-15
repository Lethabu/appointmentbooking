export default function InstyleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
            InStyle Hair Boutique
          </h1>
        </div>
      </nav>
      <main>
        {children}
      </main>
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 InStyle Hair Boutique. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
