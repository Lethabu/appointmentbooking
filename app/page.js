
import { createClient } from '@/utils/supabase/server'
import {Hero} from "@/components/landing/Hero";
import {Features} from "@/components/landing/Features";
import {CTA} from "@/components/landing/CTA";
import {Testimonials} from "@/components/landing/Testimonials";
import Salons from '@/components/landing/Salons';

export default async function LandingPage() {
  const supabase = createClient();

  const { data: salons } = await supabase.from('salons').select('*');


  return (
    <div>
      <Hero />
      <Features />
      <Salons salons={salons} />
      <Testimonials />
      <CTA />
    </div>
  );
}