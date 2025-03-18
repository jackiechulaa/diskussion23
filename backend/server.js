// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");

// Importera routes
const threadRoutes = require("./routers/threads");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routesno
app.use("/api/threads", threadRoutes);

// Starta servern
app.listen(PORT, () => {
  console.log(`Server igång på port ${PORT}`);
});
