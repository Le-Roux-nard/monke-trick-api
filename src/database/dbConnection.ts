import { MongoClient, Collection, Db } from "mongodb";

const collection = new Map<string, Collection>();

async function init() {
	const client: MongoClient = new MongoClient(process.env.MONGO_DATABASE_URL ?? "mongodb://localhost:27017");

	await client.connect();

	const db: Db = client.db("monke");
	const urlsConnection: Collection = db.collection("urls");

	collections.urls = urlsConnection;
	console.log("db connectée");
}

export const collections: { urls?: Collection } = {};
export { init };
