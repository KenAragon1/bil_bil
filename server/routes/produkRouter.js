const db = require("../app/database");
const { imgUpload } = require("../config/multer");

const produkRouter = require("express").Router();

produkRouter.get("/", (req, res) => {
  db.execute("SELECT * FROM produk", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    return res.json(result);
  });
});

// Endpoint POST untuk menambahkan data produk
produkRouter.post("/", imgUpload.single("gambar"), (req, res) => {
  const { kode_produk, nama_produk, harga, jumlah } = req.body;
  const gambar = req.file ? req.file.filename : null;
  const sql =
    "INSERT INTO produk (kode_produk, nama_produk, harga, jumlah, gambar) VALUES (?, ?, ?, ?, ?)";
  db.query(
    sql,
    [kode_produk, nama_produk, harga, jumlah, gambar],
    (err, results) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json({ error: err.message });
      }
      res
        .status(201)
        .json({ message: "Data produk berhasil disimpan", data: results });
    }
  );
});
// Endpoint PUT untuk memperbarui data produk berdasarkan kode_produk
produkRouter.put("/:kode_produk", imgUpload.single("gambar"), (req, res) => {
  const { kode_produk } = req.params;
  const { nama_produk, harga, jumlah } = req.body;
  let sql = "UPDATE produk SET nama_produk = ?, harga = ?, jumlah = ?";
  const params = [nama_produk, harga, jumlah];
  // Jika ada file gambar baru, tambahkan field gambar dalam update
  if (req.file) {
    const gambar = req.file.filename;
    sql += ", gambar = ?";
    params.push(gambar);
  }
  sql += " WHERE kode_produk = ?";
  params.push(kode_produk);
  db.query(sql, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res
      .status(200)
      .json({ message: "Data produk berhasil diperbarui", data: results });
  });
});
// Endpoint DELETE untuk menghapus data produk berdasarkan kode_produk
produkRouter.delete("/:kode_produk", (req, res) => {
  const { kode_produk } = req.params;
  const sql = "DELETE FROM produk WHERE kode_produk = ?";
  db.query(sql, [kode_produk], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res
      .status(200)
      .json({ message: "Data produk berhasil dihapus", data: results });
  });
});

module.exports = produkRouter;
