const express = require("express");
const app = express();
require("dotenv").config();
const dbConfig = require("./config/dbConfig");

const cors = require("cors");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/userRoute");
const port = 3000;

app.use(express.json());

app.use(cors());

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

app.listen(port, () => console.log(`node server started at port ${port}`));
