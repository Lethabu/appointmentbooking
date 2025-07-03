// pages/signup.js
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export default function SignUp() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email: e.target.email.value,
      password: e.target.password.value,
      options: {
        data: {
          full_name: e.target.full_name.value,
          role: 'owner'
        }
      }
    });
    if (!error) router.push('/dashboard/create-salon');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <input name="full_name" placeholder="Full Name" required />
      <button type="submit">Create Account</button>
    </form>
  );
}

// pages/dashboard/create-salon.js
export default function SalonCreator() {
  const { user } = useUser();
  const supabase = useSupabaseClient();
  
  const createSalon = async (subdomain) => {
    const { data, error } = await supabase
      .from('salons')
      .insert({
        name: `${user.user_metadata.full_name}'s Salon`,
        subdomain,
        owner_id: user.id,
        plan: 'trial',
        trial_ends_at: new Date(Date.now() + 30*24*60*60*1000).toISOString()
      })
      .select()
      .single();
    
    if (!error) {
      // Create default service
      await supabase.from('services').insert({
        salon_id: data.id,
        name: 'Haircut',
        duration: 30,
        price: 15000 // in cents
      });
      router.push(`/dashboard/${data.id}`);
    }
  };
  
  return (
    <div>
      <h1>Create Your Salon</h1>
      <SubdomainChecker onCreate={createSalon} />
    </div>
  );
}

// components/SubdomainChecker.js
export default function SubdomainChecker({ onCreate }) {
  const [subdomain, setSubdomain] = useState('');
  const [availability, setAvailability] = useState(null);

  const checkAvailability = useDebounce(async (value) => {
    if (value.length < 3) return;
    const { count } = await supabase
      .from('salons')
      .select('*', { count: 'exact' })
      .or(`subdomain.eq.${value}, custom_domain.eq.${value}`);
    setAvailability(count === 0);
  }, 500);

  return (
    <div>
      <input 
        value={subdomain}
        onChange={(e) => {
          setSubdomain(e.target.value);
          checkAvailability(e.target.value);
        }}
        placeholder="your-salon-name"
      />
      {availability === false && <p>Not available</p>}
      {availability && <p>Available!</p>}
      <button 
        onClick={() => onCreate(subdomain)} 
        disabled={!availability}
      >
        Create Salon
      </button>
    </div>
  );
}