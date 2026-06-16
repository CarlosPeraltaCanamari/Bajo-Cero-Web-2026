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

async function inspectAll() {
  console.log("--- CLIENTE SCHEMA ---");
  const { data: cliente, error: errC } = await supabase.from('cliente').select('*').limit(1);
  if (errC) console.error(errC);
  else console.log(cliente);

  console.log("--- VENTA SCHEMA ---");
  const { data: venta, error: errV } = await supabase.from('venta').select('*').limit(1);
  if (errV) console.error(errV);
  else console.log(venta);
}

inspectAll();
