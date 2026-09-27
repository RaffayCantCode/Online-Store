import sharp from 'sharp';
import pg from 'pg';
const { Client } = pg;

const pw = 'Raffayiscool#123456';
const connectionString = `postgresql://postgres.rbpwdkulqmeagiohihpj:${encodeURIComponent(pw)}@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres`;

async function compressDataUrl(dataUrl, maxDim = 600, quality = 75) {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
    return dataUrl;
  }
  const match = dataUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
  if (!match) return dataUrl;

  try {
    const buffer = Buffer.from(match[2], 'base64');
    if (buffer.length < 25000) {
      return dataUrl;
    }

    const compressedBuffer = await sharp(buffer)
      .resize({ width: maxDim, height: maxDim, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();

    return `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`;
  } catch (err) {
    console.warn('Could not compress image with sharp, keeping original:', err.message);
    return dataUrl;
  }
}

async function run() {
  console.log('Connecting to Supabase PostgreSQL...');
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log('Connected!');

  try {
    const res = await client.query('SELECT * FROM products ORDER BY created_at DESC');
    console.log(`Found ${res.rows.length} products to check and compress...`);

    let totalOriginalBytes = 0;
    let totalCompressedBytes = 0;

    for (const p of res.rows) {
      console.log(`\nProcessing: ${p.name} (id: ${p.id})`);
      const origImgLen = (p.image || '').length;
      const origGalLen = JSON.stringify(p.gallery || []).length;
      totalOriginalBytes += origImgLen + origGalLen;

      const newImage = await compressDataUrl(p.image, 600, 75);

      let newGallery = [];
      const currentGallery = Array.isArray(p.gallery) ? p.gallery : (typeof p.gallery === 'string' ? JSON.parse(p.gallery || '[]') : []);
      for (const item of currentGallery) {
        const compressedItem = await compressDataUrl(item, 600, 75);
        newGallery.push(compressedItem);
      }

      const newImgLen = (newImage || '').length;
      const newGalLen = JSON.stringify(newGallery).length;
      totalCompressedBytes += newImgLen + newGalLen;

      console.log(`  Image:   ${(origImgLen / 1024).toFixed(1)} KB -> ${(newImgLen / 1024).toFixed(1)} KB`);
      console.log(`  Gallery: ${(origGalLen / 1024).toFixed(1)} KB -> ${(newGalLen / 1024).toFixed(1)} KB`);

      await client.query(
        'UPDATE products SET image = $1, gallery = $2 WHERE id = $3',
        [newImage, JSON.stringify(newGallery), p.id]
      );
      console.log(`  Updated ${p.id} successfully!`);
    }

    console.log('\n=======================================');
    console.log(`Total payload before: ${(totalOriginalBytes / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Total payload after:  ${(totalCompressedBytes / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Savings: ${(((totalOriginalBytes - totalCompressedBytes) / totalOriginalBytes) * 100).toFixed(1)}% reduction!`);
    console.log('=======================================\n');

  } catch (err) {
    console.error('Error during compression:', err);
  } finally {
    await client.end();
  }

  // Now test the REST API directly
  console.log('Testing Supabase REST API (what frontend calls)...');
  const restUrl = 'https://rbpwdkulqmeagiohihpj.supabase.co/rest/v1/products?select=*';
  const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJicHdka3VscW1lYWdpb2hpaHBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3OTY2OTQsImV4cCI6MjEwMDM3MjY5NH0.1ufqXXy5mHcpuTAfZozeTBGjZGAA1LN6Z-9Bi0AjPQg';

  const startTime = Date.now();
  const testRes = await fetch(restUrl, {
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`
    }
  });

  const duration = Date.now() - startTime;
  console.log(`REST API Status: ${testRes.status} in ${duration}ms`);
  if (testRes.status === 200) {
    const products = await testRes.json();
    console.log(`SUCCESS! Loaded ${products.length} products with NO TIMEOUT!`);
  } else {
    console.error('REST API Error:', await testRes.text());
  }
}

run().catch(console.error);
