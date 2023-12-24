import { Client ,Users} from 'node-appwrite';

// This is your Appwrite function
// It's executed each time we get a request
export default async ({ req, res, log, error }) => {
  // Why not try the Appwrite SDK?
  //
  
  const client = new Client()
  const users =new Users(client)
  client.setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('656b279a50d44a05c703')
    .setKey('12345678');

  // You can log messages to the console
  log('Hello, Logs!');

  // If something goes wrong, log an error
  error('Hello, Errors!');

  // The `req` object contains the request data
  if (req.method === 'GET') {
    // Send a response with the res object helpers
    // `res.send()` dispatches a string back to the client
    return res.send('Hello, Babe!');
  }

const payload = JSON.parse(req.payload)
console.log('paylod:',payload)
  const response= await users.get(payload['owner_id']);
  console.log('response:',response)



  // `res.json()` is a handy helper for sending JSON
  return res.json({
    motto: 'Build like a team of hundreds_',
    learn: 'https://appwrite.io/docs',
    connect: 'https://appwrite.io/discord',
    getInspired: 'https://builtwith.appwrite.io',
  });
};