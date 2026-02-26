import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("Error: MONGO_URI environment variable is not set or is empty.");
    // In production, we might want to fail fast if no URI is provided at all
    // But for resilience, we'll return false and let the caller decide
    return false;
  }
  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
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
    // Do not exit process here, let the application handle the failure
    return false;
  }
};
