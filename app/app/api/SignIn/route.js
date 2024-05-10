import DataHandler from '../../../prisma/DataRepository';
//  DataHandler= require( '../../../prisma/DataRepository');

// async function fun()
// {
//   const dataHandler = new DataHandler();
//   user = await dataHandler.signIn("johnbuyer", "john123");
//   console.log(user)
// }
// fun()

async function handler(req) {
  if (req.method !== 'POST') {
    Response.statusCode=405
    return Response.json({ message: 'Method Not Allowed' });
  }

  const { username, password } =  await req.json();

  const dataHandler = new DataHandler();

  try {
    const user = await dataHandler.signIn(username, password);
    Response.statusCode=200
    return Response.json(user);
  } catch (error) {
    Response.statusCode=500
    return Response.json({ message: 'Error during sign-in', error: error.message });
  } finally {
    await dataHandler.close();
  }
}
export { handler as POST }