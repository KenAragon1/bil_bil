const db = require("../app/database");

const mahasiswaRouter = require("express").Router();

mahasiswaRouter.get("/", (req, res) => {
  const sql = "SELECT * FROM mahasiswa";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(result);
  });
});

mahasiswaRouter.post("/", (req, res) => {
  const { nim, nama, jurusan, angkatan } = req.body;
  const sql =
    "INSERT INTO mahasiswa (nim, nama, jurusan, angkatan) VALUE (?, ?, ? ,?)";
  db.query(sql, [nim, nama, jurusan, angkatan], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    db.query(
      "SELECT * FROM mahasiswa WHERE id = ?",
      [result.insertId],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res
          .status(201)
          .json({ message: "Data berhasil disimpan", data: result[0] });
      }
    );
  });
});

mahasiswaRouter.put("/:nim", (req, res) => {
  const { nim } = req.params;
  const { nama, jurusan, angkatan } = req.body;

  db.query(
    "UPDATE mahasiswa SET nama = ?, jurusan = ?, angkatan = ? WHERE nim = ?",
    [nama, jurusan, angkatan, nim],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res
        .status(200)
        .json({ message: "Data berhasil diperbaharui", data: result });
    }
  );
});

mahasiswaRouter.delete("/:nim", (req, res) => {
  const { nim } = req.params;

  db.query("DELETE FROM mahasiswa WHERE nim = ?", [nim], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(200).json({ message: "Data berhasil dihapus", data: result });
  });
});

module.exports = mahasiswaRouter;
