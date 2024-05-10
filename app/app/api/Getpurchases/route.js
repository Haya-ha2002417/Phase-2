import DataHandler from '../../../prisma/DataRepository';

export async function POST(request) {
  try {
    const { itemId, buyerId, quantity } = await request.json();
    console.log(itemId, buyerId, quantity);
    
    const dataHandler = new DataHandler();
    const transaction = await dataHandler.purchase(itemId, buyerId, quantity);
    
    Response.statusCode=201
   return Response.json({ message: 'Purchase successful', transaction });
  } catch (error) {
    Response.statusCode=500
   return Response.json({ error: 'Error processing transaction' });
  }
}

export async function GET(request) {
  try {
    const dataHandler = new DataHandler();
    const transactions = await dataHandler.getTransactions();
    Response.statusCode=200
    return Response.json(transactions);
  } catch (error) {
    Response.statusCode=500
   return Response.json({ error: 'Error getting transactions' });
  }
}
