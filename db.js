import { MongoClient } from "mongodb";

// REMEMBER TO CHANGE THIS TO YOUR CONNECTION STRING
const connectionString = "mongodb+srv://Fran:1234@apis-database.f38yhb7.mongodb.net/";

const client = new MongoClient(connectionString);

let conn;
try {
  // Try
  conn = await client.connect();
} catch(e) {
  console.error(e);
}

let db = conn.db("Proyecto");

export default db;
