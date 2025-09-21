export default function InstyleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Instyle Hair Boutique</title>
      </head>
      <body style={{margin: 0, padding: '20px', fontFamily: 'Arial, sans-serif'}}>
        {children}
      </body>
    </html>
  );
}