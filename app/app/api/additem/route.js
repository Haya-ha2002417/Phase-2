import DataHandler from '../../../prisma/DataRepository';

  async function handler(req) {
  if (req.method !== 'POST') {
    return Response.json({ message: 'Method Not Allowed' });
  }

  const { name, price, quantity, sellerId, imageUrl, description } =  await req.json();
  const dataHandler = new DataHandler();

  try {
    const newItem = await dataHandler.addItem(name, price, quantity, sellerId, imageUrl, description);
    Response.statusCode=201
    return Response.json(newItem);
  } catch (error) {
    Response.statusCode=500
    Response/json({ error: 'Error adding item', message: error.message });
  } finally {
    await dataHandler.close();
  }
}
export { handler as POST }
