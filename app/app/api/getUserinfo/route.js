import DataHandler from '../../../path/to/DataHandler';

async function handler(req) {
  if (req.method !== 'GET') {
    Response.statusCode=405
    return Response.json({ message: 'Method Not Allowed' });
  }

  const { id } = req.json();
  const dataHandler = new DataHandler();

  try {
    const userData = await dataHandler.getUserInfo(id);
    if (!userData) {
      Response.statusCode=404
      return Response.json({ error: 'User not found' });
    }
    Response.statusCode=200
    return Response.json(userData);
  } catch (error) {
    Response.statusCode=500
    return   Response.json({ error: 'Internal Server Error', message: error.message });
  } finally {
    await dataHandler.close();
  }
}
export { handler as GET }