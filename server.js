const express = require("express");
const app = express();
require("dotenv").config();
const dbConfig = require("./config/dbConfig");
app.use(express.json());
const cors = require("cors");
const authRoute = require("./routes/auth");
const port = 3000;

app.use(cors());

app.use("/api/auth", authRoute);

app.listen(port, () => console.log(`node server started at port ${port}`));
