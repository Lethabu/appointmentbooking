import Image from 'next/image';

interface LCPFixProps {
  tenant: string;
}

export default function LCPFix({ tenant }: LCPFixProps) {
  return (
    <div style={{ width: '100%', height: '400px', position: 'relative' }}>
      <Image
        src="/tenants/instyle/hero.webp"
        alt={`${tenant} hero`}
        fill
        sizes="(max-width: 768px) 100vw, 100vw"
        style={{ objectFit: 'cover' }}
        priority
      />
    </div>
  );
}