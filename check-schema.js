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

async function test() {
  console.log("=== REPARTIDORES ===");
  const { data: reps, error: errReps } = await supabase.from('repartidor').select('*');
  if (errReps) console.error("Error reps:", errReps);
  else console.log(reps);

  console.log("\n=== RECIENTES VENTAS ===");
  const { data: ventas, error: errVentas } = await supabase.from('venta').select('*').order('id', { ascending: false }).limit(5);
  if (errVentas) console.error("Error ventas:", errVentas);
  else console.log(ventas);
}

test();
