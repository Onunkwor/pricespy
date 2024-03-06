import mongoose from "mongoose";

let isConnected = false; //tract connection status

export const connectToDB = async () => {
  mongoose.set("strictQuery", true); //sticks to the schema and doesn't any query not in the defined schema;

  if (!process.env.MONGODB_URI)
    return console.log("MongoDb uri is not defined");
  if (isConnected) return console.log("using existing connection");
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "PriceSpy",
      bufferCommands: false, //doesn't send mongoDb commands in batches
    });
    isConnected = true;
    console.log("MongoDb connection established");
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
  }
};
