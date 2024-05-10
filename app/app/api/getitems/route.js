 import DataHandler from "../../../prisma/DataRepository";

 async function handler(req) {
  if (req.method !== 'GET') {
     Response.statusCode=405
    return Response.json({ message: 'Method Not Allowed' });
  }

  const dataHandler = new DataHandler();

  try {
    const items = await dataHandler.getItems();
    Response.statusCode=200
    return Response.json(items);
  } catch (error) {
    Response.statusCode=500
   return Response.json({ error: 'Error fetching items', message: error.message });
  } finally {
    await dataHandler.close();
  }
}
export { handler as GET }
