const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

let supabaseUrl = '';
let supabaseKey = '';

try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const lines = envContent.split('\n');
  for (const line of lines) {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1].trim();
    }
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      supabaseKey = line.split('=')[1].trim();
    }
  }
} catch (e) {
  console.error("Error reading .env.local:", e.message);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Querying relationships to find detail table names...");
  
  // We try to fetch a non-existent relationship on 'venta' to see if PostgREST lists valid relationships in the error
  const { data, error } = await supabase.from('venta').select('*, nonexistent(*)');
  if (error) {
    console.log("Error querying nonexistent relation on 'venta':");
    console.log(error.message);
    console.log(error.details);
    console.log(error.hint);
  }
  
  // Also try on 'producto'
  const { data: data2, error: error2 } = await supabase.from('producto').select('*, nonexistent(*)');
  if (error2) {
    console.log("\nError querying nonexistent relation on 'producto':");
    console.log(error2.message);
    console.log(error2.details);
    console.log(error2.hint);
  }
}

test();
