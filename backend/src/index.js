import dotenv from "dotenv";
import connectDB from "./db/db.js";
import app from "./app.js";

dotenv.config({ path: "./.env" });

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.error("Error in app:", error);
      process.exit(1);
    });
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to app:", error);
    process.exit(1);
  });
