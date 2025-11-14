const fs = require('fs');
const path = require('path');

// Define products data
const products = [
    {
        id: 'terracotta-tree-tub',
        name: 'Terracotta Tree Tub',
        price: '23.50',
        image: '../images/Terracotta tree tub.jpg',
        description: 'A beautiful handcrafted terracotta tree tub, perfect for home decoration. Made with traditional techniques and natural materials.',
        category: 'Home Decor'
    },
    {
        id: 'kalamkari-painting',
        name: 'Kalamkari Painting',
        price: '31.70',
        image: '../images/kalamkari painting.jpg',
        description: 'Exquisite Kalamkari painting featuring a yellow peacock, hand-painted with natural dyes on cotton fabric.',
        category: 'Wall Art'
    },
    {
        id: 'candle-set',
        name: 'Candle Set',
        price: '6.20',
        image: '../images/candle set.jpg',
        description: 'Set of handmade black theme candles, perfect for creating a cozy atmosphere in your home.',
        category: 'Home Decor'
    },
    {
        id: 'pattachitra-painting',
        name: 'Pattachitra Painting',
        price: '37.90',
        image: '../images/Pattachitra painting.jpg',
        description: 'Vibrant Pattachitra painting depicting Radha Krishna Lila, created using traditional techniques.',
        category: 'Wall Art'
    },
    {
        id: 'lippan-art',
        name: 'Lippan Art',
        price: '24.60',
        image: '../images/lippan art2.jpg',
        description: '3-piece Lippan art set featuring geometric patterns, perfect for modern home decor.',
        category: 'Wall Art'
    },
    {
        id: 'nokshilatha',
        name: 'Nokshilatha',
        price: '78.80',
        image: '../images/Nokshilatha.jpg',
        description: 'Beautiful hand embroidery work showcasing traditional patterns and vibrant colors.',
        category: 'Textile Art'
    }
];

// Read the template
const template = fs.readFileSync('product-template.html', 'utf8');

// Create products directory if it doesn't exist
const productsDir = path.join(__dirname, 'products');
if (!fs.existsSync(productsDir)) {
    fs.mkdirSync(productsDir);
}

// Generate a page for each product
products.forEach(product => {
    let pageContent = template
        .replace(/PRODUCT_NAME/g, product.name)
        .replace('PRODUCT_PRICE', `$${product.price}`)
        .replace('PRODUCT_IMAGE', product.image)
        .replace('PRODUCT_DESCRIPTION', product.description)
        .replace(/PRODUCT_ID/g, product.id)
        .replace('PRODUCT_CATEGORY', product.category);

    // Write the product page
    fs.writeFileSync(path.join(productsDir, `${product.id}.html`), pageContent);
    console.log(`Generated: products/${product.id}.html`);
});

console.log('All product pages have been generated!');
