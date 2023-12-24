import{Client,Databases,Storage,Account} from 'appwrite'

export const appwriteConfig = {
     //will save project id  in .env.local and import it here, will also create vite-env.d.ts and create reference (to tell typscript we are using vite)
    projectId:'656b279a50d44a05c703',
    url:'https://cloud.appwrite.io/v1',
    databaseid:'656b2d3d9185370a9cd7',
    collectionid:'656b2df029d768c83bdc',
    bucketid:'656dc09b78cbe4e1a03d',
    profileCollecionid:'65704b87cb3e8237890a',
    commentCollectionid:'6577579548426ad95c47'

}

export const client = new Client();  //create instance of client
//now configure our client
client.setProject(appwriteConfig.projectId);
//setup the endpoint
client.setEndpoint(appwriteConfig.url);


export const database = new Databases(client);  //create instance of database and pass client, to tell what they are refering to
export const storage = new Storage(client);
export const account = new Account(client);

