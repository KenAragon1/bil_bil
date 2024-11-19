const express = require("express");
const db = require("../app/database");

const materialRouter = express.Router();

materialRouter.get("/", (req, res) => {
  const sql = "SELECT * FROM material";

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(result);
  });
});

materialRouter.post("/", async (req, res) => {
  const { name, description, quantity } = req.body;

  if (!name || !description)
    return res.status(400).json({ error: "name and description required" });

  const sql = `INSERT INTO material(name, description, quantity) VALUE (?, ?, ?)`;

  db.query(sql, [name, description, quantity], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const materialId = result.insertId;

    db.query(
      `SELECT * FROM material WHERE id = ? LIMIT 1`,
      [materialId],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        return res.json({
          message: "create material success",
          data: result[0],
        });
      }
    );
  });
});

materialRouter.put("/:id", (req, res) => {
  const materialId = req.params.id;
  let { name, description, quantity } = req.body;
  const sql = `SELECT * FROM material WHERE id = ? LIMIT 1`;

  // check if material exist
  db.query(sql, [materialId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (!result[0])
      return res
        .status(401)
        .json({ error: `no material found with id ${materialId}` });

    // set default value if name or description is null
    if (!name) name = result[0].name;
    if (!description) description = result[0].description;
    if (!quantity) quantity = result[0].quantity;

    const updateSql = `UPDATE material SET name = ?, description = ?, quantity = ? WHERE id = ?`;

    // Update material
    db.query(updateSql, [name, description, quantity, materialId], (err) => {
      if (err) return res.status(500).json({ error: err.message });

      return res.json({
        message: "Update Material Success",
        data: {
          id: materialId,
          name,
          description,
          quantity,
        },
      });
    });
  });
});

materialRouter.delete("/:id", (req, res) => {
  const materialId = req.params.id;
  const sql = `SELECT * FROM material WHERE id = ${materialId} LIMIT 1`;

  // check if material exist
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (!result[0])
      return res
        .status(401)
        .json({ error: `no material found with id ${materialId}` });

    const deleteSql = `DELETE FROM material WHERE id = ${materialId}`;

    // Delete material
    db.query(deleteSql, (err) => {
      if (err) return res.status(500).json({ error: err.message });

      return res.json({ message: "Delete Material Success" });
    });
  });
});

module.exports = materialRouter;
