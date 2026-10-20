/**
 * Seed script — inserta datos de muestra en Supabase.
 *
 * Prerequisito: las tablas ya deben existir (ejecutar primero la migración SQL).
 *
 * Uso:
 *   node scripts/seed-db.mjs
 *
 * Requiere SERVICE_ROLE_KEY (no anon key) para saltar RLS.
 * Obtenerla en: Supabase Dashboard → Project Settings → API → service_role
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Leer .env.local
try {
  const envPath = join(__dirname, '..', '.env.local');
  const envContent = readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  for (const line of lines) {
    const [key, ...rest] = line.split('=');
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
  }
} catch {
  console.log('No se encontró .env.local, usando variables de entorno del sistema.');
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Faltan variables de entorno:');
  console.error('   VITE_SUPABASE_URL    →', SUPABASE_URL ? '✅' : '❌ falta');
  console.error('   SUPABASE_SERVICE_ROLE_KEY →', SERVICE_ROLE_KEY ? '✅' : '❌ falta');
  console.error('');
  console.error('Agrega SUPABASE_SERVICE_ROLE_KEY a tu .env.local');
  console.error('La encuentras en: Supabase Dashboard → Project Settings → API → service_role');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const SAMPLE_PDF = 'https://www.africau.edu/images/default/sample.pdf';

const auctions = [
  {
    id: 'a1b2c3d4-0001-4000-8000-000000000001',
    title: 'Departamento céntrico con vista panorámica',
    address: 'Av. Providencia 1234, Depto. 801', commune: 'Providencia', region: 'RM - Metropolitana',
    category: 'Inmuebles', property_type: 'Departamento', status: 'Disponible',
    min_price: 3200, currency: 'UF', guarantee: 4000000, auction_date: '2027-03-15',
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80','https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'],
    description: 'Hermoso departamento de 3 dormitorios y 2 baños en el corazón de Providencia. Amplio living-comedor, cocina equipada, terraza con vista a la cordillera. Edificio con portería 24 horas, piscina y gimnasio.',
    surface: 85, bedrooms: 3, bathrooms: 2, parking_spaces: 1,
    occupation: 'Desocupada', origin: 'Privado', featured: true,
    external_registration_url: 'https://lamartillera.cl/registro',
    doc_bases: SAMPLE_PDF, doc_cdv: SAMPLE_PDF, doc_cav: SAMPLE_PDF, doc_gravamenes: SAMPLE_PDF,
    created_at: '2026-06-01T10:00:00Z',
  },
  {
    id: 'a1b2c3d4-0002-4000-8000-000000000002',
    title: 'Casa familiar en tranquilo barrio residencial',
    address: 'Los Arrayanes 456', commune: 'Las Condes', region: 'RM - Metropolitana',
    category: 'Inmuebles', property_type: 'Casa', status: 'Disponible',
    min_price: 8500, currency: 'UF', guarantee: 8000000, auction_date: '2027-03-15',
    images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80','https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80'],
    description: 'Amplia casa de dos pisos en barrio residencial exclusivo. 4 dormitorios, 3 baños, patio trasero con jardín.',
    surface: 180, bedrooms: 4, bathrooms: 3, parking_spaces: 2,
    occupation: 'Desocupada', origin: 'Privado', featured: true,
    external_registration_url: 'https://lamartillera.cl/registro',
    doc_bases: SAMPLE_PDF, doc_cdv: SAMPLE_PDF, doc_cav: SAMPLE_PDF,
    created_at: '2026-06-02T10:00:00Z',
  },
  {
    id: 'a1b2c3d4-0003-4000-8000-000000000003',
    title: 'Parcela con vista al lago, ideal turismo',
    address: 'Camino Los Lagos Km 12', commune: 'Puerto Varas', region: 'X - Los Lagos',
    category: 'Inmuebles', property_type: 'Parcela', status: 'Disponible',
    min_price: 1200, currency: 'UF', guarantee: 2000000, auction_date: '2027-03-29',
    images: ['https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80','https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80'],
    description: 'Hermosa parcela de 5.000 m² con vista directa al lago Llanquihue y el volcán Osorno.',
    surface: 5000, occupation: 'Desocupada', origin: 'Privado', featured: true,
    external_registration_url: 'https://lamartillera.cl/registro', doc_bases: SAMPLE_PDF,
    created_at: '2026-06-03T10:00:00Z',
  },
  {
    id: 'a1b2c3d4-0004-4000-8000-000000000004',
    title: 'Local comercial en pleno centro histórico',
    address: 'Paseo Ahumada 321, Local 5', commune: 'Santiago', region: 'RM - Metropolitana',
    category: 'Inmuebles', property_type: 'Local Comercial', status: 'Disponible',
    min_price: 45000000, currency: 'CLP', guarantee: 5000000, auction_date: '2027-04-05',
    images: ['https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80'],
    description: 'Local comercial de 120 m² en pleno Paseo Ahumada, sector de alto tráfico peatonal.',
    surface: 120, occupation: 'Arrendada', origin: 'Judicial', featured: false,
    external_registration_url: 'https://lamartillera.cl/registro', doc_bases: SAMPLE_PDF,
    created_at: '2026-06-04T10:00:00Z',
  },
  {
    id: 'a1b2c3d4-0005-4000-8000-000000000005',
    title: 'Oficina ejecutiva en torre corporativa',
    address: 'Av. El Bosque Norte 500, Of. 1201', commune: 'Las Condes', region: 'RM - Metropolitana',
    category: 'Inmuebles', property_type: 'Oficina', status: 'Próximamente',
    min_price: 2800, currency: 'UF', guarantee: 4000000, auction_date: '2027-05-05',
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80'],
    description: 'Moderna oficina de 65 m² en emblemática torre del sector financiero.',
    surface: 65, occupation: 'Desocupada', origin: 'Privado', featured: false,
    external_registration_url: 'https://lamartillera.cl/registro',
    created_at: '2026-06-05T10:00:00Z',
  },
  {
    id: 'a1b2c3d4-0006-4000-8000-000000000006',
    title: 'Bodega industrial sector norte — ADJUDICADA',
    address: 'Av. Lo Boza 1200, Bodega C', commune: 'Pudahuel', region: 'RM - Metropolitana',
    category: 'Inmuebles', property_type: 'Bodega', status: 'Adjudicada',
    min_price: 6200, currency: 'UF', guarantee: 6000000, auction_date: '2026-06-20',
    images: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80'],
    description: 'Bodega industrial de 800 m² con altura libre de 8 m. Subasta adjudicada.',
    surface: 800, occupation: 'Desocupada', origin: 'Judicial', featured: false,
    external_registration_url: 'https://lamartillera.cl/registro',
    doc_bases: SAMPLE_PDF, doc_cdv: SAMPLE_PDF, doc_cav: SAMPLE_PDF, doc_gravamenes: SAMPLE_PDF,
    created_at: '2026-05-10T10:00:00Z',
  },
  {
    id: 'a1b2c3d4-0007-4000-8000-000000000007',
    title: 'Casa en condominio cerrado sector oriente — ADJUDICADA',
    address: 'Condominio Los Peumos, Casa 14', commune: 'La Florida', region: 'RM - Metropolitana',
    category: 'Inmuebles', property_type: 'Casa', status: 'Adjudicada',
    min_price: 4800, currency: 'UF', guarantee: 5000000, auction_date: '2026-05-28',
    images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80'],
    description: 'Casa de 3 dormitorios y 2 baños en condominio cerrado con vigilancia 24h.',
    surface: 110, bedrooms: 3, bathrooms: 2, parking_spaces: 2,
    occupation: 'Desocupada', origin: 'Judicial', featured: false,
    external_registration_url: 'https://lamartillera.cl/registro',
    doc_bases: SAMPLE_PDF, doc_cdv: SAMPLE_PDF, doc_cav: SAMPLE_PDF,
    created_at: '2026-04-20T10:00:00Z',
  },
  {
    id: 'a1b2c3d4-0008-4000-8000-000000000008',
    title: 'Camioneta Toyota Hilux 4x4 2020',
    address: 'Depósito judicial, Av. Industrial 900', commune: 'Pudahuel', region: 'RM - Metropolitana',
    category: 'Vehículos', property_type: 'Camioneta', status: 'Disponible',
    min_price: 12500000, currency: 'CLP', guarantee: 1500000, auction_date: '2027-03-12',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80','https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80'],
    description: 'Camioneta Toyota Hilux 4x4 doble cabina, año 2020, motor 2.8 diésel, 95.000 km.',
    surface: 0, occupation: 'Desocupada', origin: 'Judicial', featured: true,
    external_registration_url: 'https://lamartillera.cl/registro', doc_bases: SAMPLE_PDF,
    created_at: '2026-06-10T10:00:00Z',
  },
  {
    id: 'a1b2c3d4-0009-4000-8000-000000000009',
    title: 'Automóvil Chevrolet Cruze 2019',
    address: 'Depósito judicial, Av. Industrial 900', commune: 'Pudahuel', region: 'RM - Metropolitana',
    category: 'Vehículos', property_type: 'Auto', status: 'Disponible',
    min_price: 6800000, currency: 'CLP', guarantee: 800000, auction_date: '2027-03-12',
    images: ['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80','https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800&q=80'],
    description: 'Chevrolet Cruze LTZ 2019, motor 1.4 turbo, 68.000 km. Color gris oscuro.',
    surface: 0, occupation: 'Desocupada', origin: 'Concursal', featured: false,
    external_registration_url: 'https://lamartillera.cl/registro', doc_bases: SAMPLE_PDF,
    created_at: '2026-06-11T10:00:00Z',
  },
  {
    id: 'a1b2c3d4-0010-4000-8000-000000000010',
    title: 'Lote de equipamiento gastronómico completo',
    address: 'Ex restaurante, Av. Vitacura 3800', commune: 'Vitacura', region: 'RM - Metropolitana',
    category: 'Bienes Muebles', property_type: 'Lote Mixto', status: 'Disponible',
    min_price: 4200000, currency: 'CLP', guarantee: 500000, auction_date: '2027-03-20',
    images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80','https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&q=80'],
    description: 'Lote completo de equipamiento para restaurante: cocinas industriales, refrigeradores, vajilla.',
    surface: 0, occupation: 'Desocupada', origin: 'Concursal', featured: true,
    external_registration_url: 'https://lamartillera.cl/registro', doc_bases: SAMPLE_PDF,
    created_at: '2026-06-13T10:00:00Z',
  },
  {
    id: 'a1b2c3d4-0011-4000-8000-000000000011',
    title: 'Equipos médicos clínica — ADJUDICADO',
    address: 'Ex Clínica Central, Av. Independencia 1027', commune: 'Independencia', region: 'RM - Metropolitana',
    category: 'Bienes Muebles', property_type: 'Lote Mixto', status: 'Adjudicada',
    min_price: 9500000, currency: 'CLP', guarantee: 1000000, auction_date: '2026-05-15',
    images: ['https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=800&q=80'],
    description: 'Lote de equipos médicos: ecógrafos, camas hospitalarias, monitores. Adjudicado.',
    surface: 0, occupation: 'Desocupada', origin: 'Concursal', featured: false,
    external_registration_url: 'https://lamartillera.cl/registro', doc_bases: SAMPLE_PDF,
    created_at: '2026-04-10T10:00:00Z',
  },
];

async function main() {
  console.log('🚀 Iniciando seed de La Martillera...\n');

  // Insertar auctions
  const { error: auctionError } = await supabase
    .from('auctions')
    .upsert(auctions, { onConflict: 'id' });

  if (auctionError) {
    console.error('❌ Error insertando auctions:', auctionError.message);
    process.exit(1);
  }

  console.log(`✅ ${auctions.length} remates insertados/actualizados`);

  // Crear usuario admin de prueba
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@lamartillera.cl';
  const adminPass  = process.env.ADMIN_PASSWORD || 'Admin1234!';

  const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPass,
    email_confirm: true,
    user_metadata: { name: 'Administrador La Martillera' },
  });

  if (adminError && !adminError.message.includes('already')) {
    console.warn('⚠️  No se pudo crear usuario admin:', adminError.message);
  } else if (adminData?.user) {
    console.log(`✅ Usuario admin creado: ${adminEmail} / ${adminPass}`);
  } else {
    console.log(`ℹ️  Usuario admin ya existe: ${adminEmail}`);
  }

  console.log('\n✅ Seed completado exitosamente!');
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
