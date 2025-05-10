const express = require("express");
const websocket = require("./websocket");
const cors = require("cors");
const bodyParser = require("body-parser");
const {
  addCronJob,
  editCronJob,
  deleteCronJob,
  init,
  scheduleOldCronJobs,
} = require("./cron");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000;

// cors policy
app.use(cors());

// Body parser middleware
app.use(bodyParser.json());

// Middleware or API routes (optional)
app.get("/backend/", (req, res) => {
  res.send("Background Service Running!");
});

// Types of cron jobs
// 1. dailyLoss (for all accounts)
// 2. objectiveMin (only for challenge accounts)
// 3. objectiveMax (only for challenge accounts)
// 4. inactivity (only for funded accounts)

// Route to add a new cron job
app.post("/backend/add-cron-job", async (req, res) => {
  const { jobName, time, type, accountId } = req.body;

  if (!jobName || !time || !type || !accountId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (
    type !== "dailyLoss" &&
    type !== "objectiveMin" &&
    type !== "objectiveMax" &&
    type !== "inactivity"
  ) {
    return res.status(400).json({ error: "Invalid cron job type" });
  }

  try {
    await addCronJob(jobName, time, type, accountId);
    return res.status(201).json({ message: "Cron job added successfully" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// Route to edit an existing cron job
app.put("/backend/edit-cron-job", async (req, res) => {
  const { jobName, newTime } = req.body;

  try {
    await editCronJob(jobName, newTime);
    return res.status(200).json({ message: "Cron job updated successfully" });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
});

// Route to delete a cron job
app.delete("/backend/delete-cron-job", async (req, res) => {
  const { jobName } = req.body;

  try {
    await deleteCronJob(jobName);
    return res.status(200).json({ message: "Cron job deleted successfully" });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
});


app.post("/backend/generate-notification", async (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  websocket.sendNotification(userId, message);
  return res.status(200).json({ message: "Notification sent successfully" });
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
  
});

// Initialize CRON jobs
init();
scheduleOldCronJobs();

// Initialize WebSocket
const wss = websocket.init(server);

//for new sports API
// setInterval(() => websocket.checkForSettlements(wss), 1000 * 60);
setInterval(() => websocket.checkForUpdates(wss), 1000 * 60);