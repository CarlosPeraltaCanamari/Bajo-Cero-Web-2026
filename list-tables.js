const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

let supabaseUrl = '';
let supabaseKey = '';

try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const lines = envContent.split('\n');
  for (const line of lines) {
    if (line.trim().startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1].trim();
    }
    if (line.trim().startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      supabaseKey = line.split('=')[1].trim();
    }
  }
} catch (e) {
  console.error("Error reading .env.local:", e.message);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listTables() {
  console.log("=== LISTING ALL TABLES VIA SQL (RPC) ===");
  // Since we cannot run raw SQL directly in Supabase JS without an RPC or postgres endpoint, 
  // we try to query the REST schema definition or run a dummy select on common system views
  const { data, error } = await supabase.from('venta').select('*').limit(1);
  if (error) {
    console.error("Error querying venta:", error);
  } else {
    console.log("Connected to Supabase. Checking tables...");
  }
  
  // Let's try to query public tables by executing a query to postgrest schema or checking what tables are accessible
  // We can also try to see if there are other files in the project.
}

listTables();
