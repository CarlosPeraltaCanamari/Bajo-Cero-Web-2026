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

async function run() {
  console.log("=== REGISTERING DAVID CONDO ===");

  // 1. Create employee
  const { data: newEmp, error: newEmpErr } = await supabase
    .from('empleado')
    .insert({
      ci: '79089',
      nombre: 'David',
      apellido: 'Condo',
      usuario: 'davidcondo',
      contrasena: '123456',
      correo: 'davidcondo@gmail.com',
      telefono: '79089',
      direccion: 'Pisagua 402',
      area: 'Distribucion',
      turno: 'Mañana'
    })
    .select()
    .single();

  if (newEmpErr) {
    console.error("Error creating employee David Condo:", newEmpErr.message);
    return;
  }
  console.log("Employee David Condo created successfully:", newEmp);

  // 2. Create repartidor
  const { data: newRep, error: newRepErr } = await supabase
    .from('repartidor')
    .insert({
      empleado_ci: '79089',
      estado: 'Disponible',
      zona: 'Centro Histórico',
      licencia: '123456'
    })
    .select()
    .single();

  if (newRepErr) {
    console.error("Error creating repartidor David Condo:", newRepErr.message);
    return;
  }
  console.log("Repartidor David Condo created successfully:", newRep);

  // 3. Assign Venta 35 to David Condo (Repartidor ID newRep.id)
  console.log(`Assigning Venta ID 35 to David Condo (Repartidor ID ${newRep.id})...`);
  const { data: v35, error: errV35 } = await supabase
    .from('venta')
    .update({
      repartidor_id: newRep.id,
      estado: 'Pedido'
    })
    .eq('id', 35)
    .select();
  if (errV35) console.error("Error updating Venta 35:", errV35.message);
  else console.log("Venta 35 updated successfully:", v35);

  // Verify
  const { data: activeVentas, error: activeVentasErr } = await supabase
    .from('venta')
    .select('id, fecha, hora, estado, pagado, repartidor_id, cliente_ci, delivery')
    .eq('entregado', false)
    .order('id', { ascending: false });

  if (activeVentasErr) {
    console.error("Error verifying active orders:", activeVentasErr.message);
  } else {
    console.table(activeVentas.slice(0, 5));
  }
}

run();
