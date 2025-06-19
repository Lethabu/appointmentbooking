export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
```*   **`pages/index.jsx`**: Create this file. This will be the main landing page for `appointmentbookings.co.za`. Paste in:
```javascript
export default function HomePage() {
  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: '50px' }}>
      <h1>Welcome to AppointmentBookings.co.za</h1>
      <p>The all-in-one platform for salon management.</p>
      <p>Tenant portals are available via custom domains.</p>
    </div>
  );
}
