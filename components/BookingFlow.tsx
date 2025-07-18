import React from 'react';

interface BookingFlowProps {
  services: any[];
  tenantId: string;
}

const BookingFlow: React.FC<BookingFlowProps> = ({ services, tenantId }) => {
  return (
    <div>
      <h1>Booking Flow</h1>
      {/* Render services and booking form */}
    </div>
  );
};

export default BookingFlow;
