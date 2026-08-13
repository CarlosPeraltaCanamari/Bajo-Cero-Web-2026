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
  console.log("=== STARTING DATABASE OPERATIONS ===");

  // 1. Check if David Condo is in employee table
  const { data: empCheck, error: empCheckErr } = await supabase
    .from('empleado')
    .select('*')
    .eq('ci', '79089')
    .maybeSingle();

  if (empCheckErr) {
    console.error("Error checking employee:", empCheckErr.message);
  }

  let employeeCi = '79089';
  if (!empCheck) {
    console.log("David Condo not found in 'empleado'. Creating employee account...");
    const { data: newEmp, error: newEmpErr } = await supabase
      .from('empleado')
      .insert({
        ci: '79089',
        nombre: 'David',
        apellido: 'Condo',
        usuario: 'david',
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
      console.error("Error creating employee:", newEmpErr.message);
    } else {
      console.log("Employee 'David Condo' created successfully:", newEmp);
    }
  } else {
    console.log("Employee 'David Condo' already exists:", empCheck);
  }

  // 2. Check if David Condo is in repartidor table
  let { data: repCheck, error: repCheckErr } = await supabase
    .from('repartidor')
    .select('*')
    .eq('empleado_ci', '79089')
    .maybeSingle();

  if (repCheckErr) {
    console.error("Error checking repartidor:", repCheckErr.message);
  }

  let davidRepartidorId = null;
  if (!repCheck) {
    console.log("David Condo not found in 'repartidor'. Creating repartidor account...");
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
      console.error("Error creating repartidor:", newRepErr.message);
    } else {
      console.log("Repartidor 'David Condo' created successfully:", newRep);
      davidRepartidorId = newRep.id;
    }
  } else {
    console.log("Repartidor 'David Condo' already exists:", repCheck);
    davidRepartidorId = repCheck.id;

    // Make sure his state is 'Disponible' if it wasn't
    if (repCheck.estado !== 'Disponible') {
      const { data: updatedRep, error: updateRepErr } = await supabase
        .from('repartidor')
        .update({ estado: 'Disponible' })
        .eq('id', repCheck.id)
        .select()
        .single();
      if (updateRepErr) console.error("Error updating repartidor state:", updateRepErr.message);
      else console.log("Repartidor state updated to Disponible:", updatedRep);
    }
  }

  // 3. Make sure Daniel (Repartidor ID 1) is set to 'Disponible' as well to be safe
  const { data: danCheck, error: danCheckErr } = await supabase
    .from('repartidor')
    .update({ estado: 'Disponible' })
    .eq('id', 1)
    .select()
    .single();
  if (danCheckErr) {
    console.error("Error setting Daniel to Disponible:", danCheckErr.message);
  } else {
    console.log("Daniel (Repartidor ID 1) state updated to Disponible:", danCheck);
  }

  // 4. Assign recent orders
  // Let's assign Venta 36 (most recent) to Daniel (ID 1)
  console.log("Assigning Venta ID 36 to Daniel (Repartidor ID 1)...");
  const { data: v36, error: errV36 } = await supabase
    .from('venta')
    .update({
      repartidor_id: 1,
      estado: 'Pedido' // update state to 'Pedido' (or Pendiente) to ensure it triggers in app
    })
    .eq('id', 36)
    .select();
  if (errV36) console.error("Error updating Venta 36:", errV36.message);
  else console.log("Venta 36 updated successfully:", v36);

  // Let's assign Venta 35 to David Condo
  if (davidRepartidorId) {
    console.log(`Assigning Venta ID 35 to David Condo (Repartidor ID ${davidRepartidorId})...`);
    const { data: v35, error: errV35 } = await supabase
      .from('venta')
      .update({
        repartidor_id: davidRepartidorId,
        estado: 'Pedido'
      })
      .eq('id', 35)
      .select();
    if (errV35) console.error("Error updating Venta 35:", errV35.message);
    else console.log("Venta 35 updated successfully:", v35);
  } else {
    console.log("David Condo repartidor ID not available. Assigning Venta 35 to Daniel (ID 1)...");
    const { data: v35, error: errV35 } = await supabase
      .from('venta')
      .update({
        repartidor_id: 1,
        estado: 'Pedido'
      })
      .eq('id', 35)
      .select();
    if (errV35) console.error("Error updating Venta 35:", errV35.message);
    else console.log("Venta 35 updated successfully:", v35);
  }

  // Also assign Venta 33 to Daniel (ID 1)
  console.log("Assigning Venta ID 33 to Daniel (Repartidor ID 1)...");
  const { data: v33, error: errV33 } = await supabase
    .from('venta')
    .update({
      repartidor_id: 1,
      estado: 'Pedido'
    })
    .eq('id', 33)
    .select();
  if (errV33) console.error("Error updating Venta 33:", errV33.message);
  else console.log("Venta 33 updated successfully:", v33);

  console.log("\n=== VERIFYING CURRENT STATE OF RECENT ORDERS ===");
  const { data: activeVentas, error: activeVentasErr } = await supabase
    .from('venta')
    .select('id, fecha, hora, estado, pagado, entregador_id:repartidor_id, cliente_ci, delivery')
    .eq('entregado', false)
    .order('id', { ascending: false });
  
  if (activeVentasErr) {
    console.error("Error verifying active orders:", activeVentasErr.message);
  } else {
    console.table(activeVentas.slice(0, 10));
  }
}

run();
