const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const userRoute = require("./routes/userRoute")

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/users", userRoute)

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
