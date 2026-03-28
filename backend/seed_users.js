import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE env vars.");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function main() {
  const usersToCreate = [
    { email: 'test.user1@example.com', password: 'test@1234' },
    { email: 'test.user2@example.com', password: 'test@1234' },
    { email: 'demo@example.com', password: 'test@1234' }
  ];

  for (const user of usersToCreate) {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true
    });

    if (error) {
      console.log(`Error creating ${user.email}: ${error.message}`);
    } else {
      console.log(`Successfully created user: ${user.email} with ID: ${data.user.id}`);
      
      // Update the dummy users we inserted earlier with the real ID!
      // The previous execute_sql inserted fake uuids, but now we have real ones.
      // We can insert/update the public.users record
      // Wait, let's just create a new public.users record for demo@example.com
      if (user.email === 'demo@example.com') {
         await supabaseAdmin.from('users').upsert({
            id: data.user.id,
            email: 'demo@example.com',
            risk_profile: 'aggressive',
            investment_goal: 'Growth'
         });
         
         await supabaseAdmin.from('portfolios').upsert({
            user_id: data.user.id,
            allocation_json: { "stocks": 90, "crypto": 10 },
            risk_score: 9.0
         });
      }
    }
  }
  
  console.log("Finished seeding users via Auth Admin API");
}

main();
