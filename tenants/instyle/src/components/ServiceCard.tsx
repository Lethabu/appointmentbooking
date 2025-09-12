// tenants/instyle/src/components/ServiceCard.tsx
import React from 'react';
import Link from 'next/link';

interface ServiceCardProps {
  name: string;
  priceZAR: number;
  durationMin: number;
  imgUrl: string;
}

export default function ServiceCard({ name, priceZAR, durationMin, imgUrl }: ServiceCardProps) {
  return (
    <div className="service-card">
      <img src={imgUrl} alt={name} className="service-img" />
      <div className="service-content">
        <h3>{name}</h3>
        <p>High-quality service tailored to you</p>
        <div className="service-price">From R{priceZAR}</div>
        <Link href="/book" className="add-to-cart">Book Now</Link>
        <div className="service-meta">
          <div className="service-duration">
            <i className="fas fa-clock"></i> {durationMin} min
          </div>
        </div>
      </div>
    </div>
  );
}