'use client';

import { useState } from 'react';

interface Step3_UpsellsProps {
  onNext: (data: { scalpTreatmentAdded: boolean }) => void;
}

export function Step3_Upsells({ onNext }: Step3_UpsellsProps) {
  const [addScalpTreatment, setAddScalpTreatment] = useState(false);

  const handleNext = () => {
    onNext({ scalpTreatmentAdded: addScalpTreatment });
  };

  return (
    <div>
      <h2>Step 3: Add-ons & Upsells</h2>
      <label>
        <input
          type="checkbox"
          checked={addScalpTreatment}
          onChange={(e) => setAddScalpTreatment(e.target.checked)}
        />
        Add Scalp Treatment (20% off if added now!)
      </label>
      <button onClick={handleNext}>Next</button>
    </div>
  );
}
