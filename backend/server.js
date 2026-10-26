require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const server = express();
server.use(cors());
server.use(express.json());

server.use("/api/events", require("./routes/eventRoutes"));
server.get("/", (req, res) => res.send("Eventura API is up"));

const PORT = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Atlas connected");
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.error("Could not connect to MongoDB:", error.message));
