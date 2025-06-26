
import mongoose from "mongoose";

async function withTransaction(callback:any) {
  const session = await mongoose.startSession(); 

  try {
    return await session.withTransaction(() => callback(session)); 
  } finally {
    session.endSession(); 
  }
}

export default withTransaction
