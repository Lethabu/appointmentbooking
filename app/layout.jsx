export const metadata = {
  title: 'Salon Booking System',
  description: 'Next-gen salon management platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}