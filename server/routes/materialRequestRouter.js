const express = require("express");
const db = require("../app/database");

const materialRequestRouter = express.Router();

materialRequestRouter.get("/", (req, res) => {
  const sql = "SELECT * FROM material_request";

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(result);
  });
});

materialRequestRouter.post("/", (req, res) => {
  const {
    requested_date,
    requested_by,
    material_name,
    quantity,
    weight,
    remark,
  } = req.body;

  const sql = `INSERT INTO material_request (requested_date, requested_by, material_name, quantity, weight, remark, status, updated_at, deleted_at) VALUE (?, ?, ?, ?, ?, ?, 'waiting', '2024-11-04 23:18:11', NULL);`;

  db.query(
    sql,
    [requested_date, requested_by, material_name, quantity, weight, remark],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ message: "create material request success" });
    }
  );
});

materialRequestRouter.get("/:id/approve", (req, res) => {
  const materialRequestId = req.params.id;
  const sql = `SELECT * FROM material_request WHERE id = ?`;

  db.query(sql, [materialRequestId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const materialRequest = result[0];

    if (!materialRequest)
      return res.status(400).json({ error: "material request not found" });

    db.query(
      `UPDATE material_request SET status = 'approved' WHERE id = ?`,
      [materialRequestId],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ message: "material request has been approved" });
      }
    );
  });
});

materialRequestRouter.get("/:id/reject", (req, res) => {
  const materialRequestId = req.params.id;
  const sql = `SELECT * FROM material_request WHERE id = ${materialRequestId}`;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const materialRequest = result[0];

    if (!materialRequest)
      return res.status(400).json({ error: "material request not found" });

    db.query(
      `UPDATE material_request SET status = 'rejected' WHERE id = ${materialRequestId}`,
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ message: "material request has been rejected" });
      }
    );
  });
});

module.exports = materialRequestRouter;
