import cron from "node-cron";
import axios from "axios"

export const cronJob = () => {
  cron.schedule("*/14 * * * *", async() => {
    console.log("Running cron job every 14 minutes");
    await axios.get("https://e-commerce-full-stack-backend-7by3.onrender.com/api/user/userprofile", {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
  });
};
