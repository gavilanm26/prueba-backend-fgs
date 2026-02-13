import { MongoClient } from 'mongodb';

async function seed() {
    const uri = 'mongodb://localhost:27017/fgs-products';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db();
        const collection = db.collection('products');

        await collection.deleteMany({});
        console.log('Cleared existing products');

        const products = [
            { name: 'Tarjeta de Crédito Oro', description: 'Nuestra mejor tarjeta con beneficios exclusivos', price: 0, stock: 100 },
            { name: 'Cuenta de Ahorros Premium', description: 'Ahorra con la mejor tasa del mercado', price: 0, stock: 1000 },
            { name: 'Crédito de Libranza', description: 'Accede a crédito fácil con descuento de nómina', price: 5.5, stock: 50 },
            { name: 'Seguro de Vida', description: 'Protege a los que más quieres', price: 25, stock: 200 },
        ];

        await collection.insertMany(products);
        console.log('Seeded products successfully');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await client.close();
    }
}

seed();
