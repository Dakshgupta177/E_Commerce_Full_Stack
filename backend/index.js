import "dotenv/config";
import { app } from "./app.js";
import ConnectDB from "./db/index.js";
const port = process.env.PORT || 5000;

ConnectDB().then(() => {
  app.listen(port,() => {
    console.log(`⚙️  Server running at http://localhost:${port}`);
   })
}).catch((error) => {
  console.log("DB connection error",error);
});

app.get("/", (req, res) => {
  res.send("API is running...");
});

