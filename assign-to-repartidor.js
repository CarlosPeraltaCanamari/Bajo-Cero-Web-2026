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

const args = process.argv.slice(2);
if (args.length < 2) {
  console.log("Uso: node assign-to-repartidor.js <venta_id> <repartidor_id>");
  console.log("Ejemplo: node assign-to-repartidor.js 36 4");
  process.exit(1);
}

const ventaId = parseInt(args[0], 10);
const repartidorId = parseInt(args[1], 10);

if (isNaN(ventaId) || isNaN(repartidorId)) {
  console.error("Error: Los IDs deben ser números válidos.");
  process.exit(1);
}

async function assign() {
  console.log(`Buscando Venta ID ${ventaId} y Repartidor ID ${repartidorId}...`);
  
  // Verify repartidor exists
  const { data: rep, error: repErr } = await supabase
    .from('repartidor')
    .select('*, empleado (*)')
    .eq('id', repartidorId)
    .maybeSingle();

  if (repErr) {
    console.error("Error al buscar repartidor:", repErr.message);
    process.exit(1);
  }
  if (!rep) {
    console.error(`Error: No se encontró ningún repartidor con ID ${repartidorId}`);
    process.exit(1);
  }

  console.log(`Repartidor encontrado: ${rep.empleado.nombre} ${rep.empleado.apellido} (CI: ${rep.empleado.ci}, Usuario: ${rep.empleado.usuario})`);

  // Update order
  const { data: venta, error: ventaErr } = await supabase
    .from('venta')
    .update({
      repartidor_id: repartidorId,
      estado: 'Pedido' // Set status to 'Pedido' so it shows up in active orders for delivery
    })
    .eq('id', ventaId)
    .select()
    .single();

  if (ventaErr) {
    console.error("Error al actualizar la venta:", ventaErr.message);
    process.exit(1);
  }

  console.log(`¡Éxito! Venta #${venta.id} asignada a ${rep.empleado.nombre}.`);
  console.log("Detalles de la venta actualizada:");
  console.log(JSON.stringify(venta, null, 2));
}

assign();
