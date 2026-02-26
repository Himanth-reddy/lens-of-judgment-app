import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("Error: MONGO_URI environment variable is not set or is empty.");
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error connecting to MongoDB: ${error.message}`);
    } else {
      console.error("Unknown error connecting to MongoDB");
    }

    // Check for authentication failure specific to MongoServerError
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mongoError = error as any;
    if (mongoError.code === 8000 || mongoError.codeName === 'AtlasError') {
      console.error("Make sure your MONGO_URI contains the correct username and password.");
    }
    process.exit(1);
  }
};
