const db = require("../app/database");
const { berkasUpload } = require("../config/multer");

const berkasRouter = require("express").Router();

berkasRouter.post("/", berkasUpload.single("file_pendukung"), (req, res) => {
  const { nim, nama, jurusan } = req.body;
  const file_pendukung = req.file ? req.file.filename : null;
  const sql =
    "INSERT INTO berkas (nim, nama, jurusan, file_pendukung) VALUES (?, ?, ?, ?)";
  db.query(sql, [nim, nama, jurusan, file_pendukung], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res
      .status(201)
      .json({ message: "Berkas berhasil ditambahkan", data: result });
  });
});
// GET: Retrieve all berkas records
berkasRouter.get("/", (req, res) => {
  const sql = "SELECT * FROM berkas";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});
// GET: Retrieve a single berkas by NIM
berkasRouter.get("/:nim", (req, res) => {
  const { nim } = req.params;
  const sql = "SELECT * FROM berkas WHERE nim = ?";
  db.query(sql, [nim], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Berkas tidak ditemukan" });
    }
    res.json(result[0]);
  });
});
berkasRouter.put("/:nim", berkasUpload.single("file_pendukung"), (req, res) => {
  const { nim } = req.params;
  const { nama, jurusan } = req.body;
  let sql = "UPDATE berkas SET nama = ?, jurusan = ?";
  const values = [nama, jurusan];
  if (req.file) {
    const file_pendukung = req.file.filename;
    sql += ", file_pendukung = ?";
    values.push(file_pendukung);
  }
  sql += " WHERE nim = ?";
  values.push(nim);
  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res
      .status(200)
      .json({ message: "Berkas berhasil diperbarui", data: result });
  });
});
berkasRouter.delete("/:nim", (req, res) => {
  const { nim } = req.params;
  const sql = "DELETE FROM berkas WHERE nim = ?";
  db.query(sql, [nim], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Berkas tidak ditemukan" });
    }
    res.status(200).json({ message: "Berkas berhasil dihapus" });
  });
});

module.exports = berkasRouter;
