import mongoose from 'mongoose'

//uri connection to the database
const uri = "mongodb+srv://sanishferrari:Sanish@userdata.jnzmm.mongodb.net/Webcup2025?retryWrites=true&w=majority&appName=UserData";


export async function connectToDb() { //Function to connect to the database
    try {
      mongoose.connect(uri);
      console.log("Pinged your deployment. You successfully connected to the Web Warriors Database!");
    } catch (error) {
      console.error("Error connecting to database:", error);
    }
  }
connectToDb().catch(console.dir);