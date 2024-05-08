const express = require("express");
const app = express();
require("dotenv").config();
const dbConfig = require("./config/dbConfig");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const cors = require("cors");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const materielRoute = require("./routes/materielRoute");
const missionRoute = require("./routes/missionRoute");
const port = 3000;

app.use(express.json());

app.use(cors());

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/materiel", materielRoute);
app.use("/api/admin", adminRoute);
app.use("/api/mission", missionRoute);

app.listen(port, () => console.log(`node server started at port ${port}`));
