// components/AI/NiaChat.jsx
'use client';
import KaraboBookingAgent from './KaraboBookingAgent';

export default function NiaChat(props) {
  // Use KaraboBookingAgent directly, passing through any props
  return <KaraboBookingAgent {...props} />;
}
