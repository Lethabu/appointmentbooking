
describe('Diagnostics', () => {
  test('Check env vars', () => {
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    expect(true).toBe(true);
  });
});
