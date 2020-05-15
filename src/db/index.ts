import mongoose from "mongoose";

export default (uri) =>
  new Promise((resolve, reject) => {
    mongoose.connection
      .on("connected", () => {
        console.log("connected to MongoDB database");
        resolve(mongoose.connections[0]);
      })
      .on("error", (error) => {
        console.log("an error occured when connecting to to the database");
        reject(error);
      });

    mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });
