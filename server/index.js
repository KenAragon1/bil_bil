const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./app/database");
const materialRouter = require("./routes/materialRouter");
const materialRequestRouter = require("./routes/materialRequestRouter");
const mahasiswaRouter = require("./routes/mahasiswaRouter");
const produkRouter = require("./routes/produkRouter");
const berkasRouter = require("./routes/berkasRouter");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: ", err);
    return;
  }

  console.log("connected to database");
});

// multer setup

app.use("/uploads", express.static("uploads"));

app.use("/produk", produkRouter);
app.use("/berkas", berkasRouter);
app.use("/mahasiswa", mahasiswaRouter);
app.use("/material", materialRouter);
app.use("/material-request", materialRequestRouter);

app.listen(PORT, () => {
  console.log("server is running on port ", PORT);
});
