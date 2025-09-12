import Image from 'next/image';

export default function LCPFix() {
  return (
    <div style={{width:'100%',height:'400px',position:'relative'}}>
      <Image
        src="/tenants/instyle/hero.webp"   // optimise & copy to public
        alt="InStyle hero"
        fill
        sizes="(max-width: 768px) 100vw, 100vw"
        style={{objectFit:'cover'}}
      />
    </div>
  );
}