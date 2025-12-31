import fs from 'fs';

// Load your nested properties.json
const propertiesRaw = JSON.parse(
  fs.readFileSync('./data/properties.json', 'utf8')
);

const flatProperties = [];
const propertyImages = [];
const bookings = [];
const reviews = [];

for (const p of propertiesRaw) {
  // 1. FLAT PROPERTY
  const { images, host, bookings: bks, reviews: rws, ...flat } = p;
  flatProperties.push(flat);

  // 2. IMAGES
  if (images && Array.isArray(images)) {
    for (const img of images) {
      propertyImages.push(img);
    }
  }

  // 3. BOOKINGS
  if (bks && Array.isArray(bks)) {
    for (const b of bks) {
      bookings.push(b);
    }
  }

  // 4. REVIEWS
  if (rws && Array.isArray(rws)) {
    for (const r of rws) {
      reviews.push(r);
    }
  }
}

// WRITE OUTPUT FILES
fs.writeFileSync(
  './data/properties.flat.json',
  JSON.stringify(flatProperties, null, 2)
);

fs.writeFileSync(
  './data/propertyImages.json',
  JSON.stringify(propertyImages, null, 2)
);

fs.writeFileSync(
  './data/bookings.json',
  JSON.stringify(bookings, null, 2)
);

fs.writeFileSync(
  './data/reviews.json',
  JSON.stringify(reviews, null, 2)
);

console.log('🔥 Flatten complete!');
console.log('Generated:');
console.log(' - data/properties.flat.json');
console.log(' - data/propertyImages.json');
console.log(' - data/bookings.json');
console.log(' - data/reviews.json');
