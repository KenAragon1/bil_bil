import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Modal,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

const Material = () => {
  const formDefaultValue = { name: "", description: "", quantity: 0 };

  const [open, setOpen] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [formData, setFormData] = useState(formDefaultValue);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleOpen = (form = formDefaultValue, editMode = false) => {
    setFormData(form);
    setIsEditMode(editMode);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData(formDefaultValue);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log(formData);
  };

  const handleSubmit = () => {
    console.log(formData);
    fetch(
      `http://localhost:5000/material${isEditMode ? "/" + formData.id : ""}`,
      {
        method: isEditMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("something went wrong");
        return res.json();
      })
      .then((data) => {
        isEditMode
          ? setMaterials((prev) =>
              prev.map((material) => {
                if (material.id === formData.id) return data.data;
                return material;
              })
            )
          : setMaterials((prev) => [...prev, data.data]);
      })
      .catch((err) => console.error("error: ", err.message))
      .finally(() => handleClose());
  };

  const handleDeleteData = (id) => {
    fetch("http://localhost:5000/material/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("something went wrong");
        console.log(res);
        return res.json();
      })
      .then((data) =>
        setMaterials((prev) => prev.filter((material) => material.id !== id))
      )
      .catch((err) => console.error("error: ", err.message));
  };

  useEffect(() => {
    fetch("http://localhost:5000/material")
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data) => setMaterials(data))
      .catch((e) => console.error("error: ", e));
  }, []);

  return (
    <div>
      {/* Button to open modal */}
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add Material
      </Button>

      {/* Modal for input form */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            {isEditMode ? <>Edit Material</> : <>Add New Material</>}
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ mt: 2 }}
          >
            Save
          </Button>
        </Box>
      </Modal>

      {/* Table to display materials */}
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {materials.map((material) => (
              <TableRow key={material.id}>
                <TableCell>{material.id}</TableCell>
                <TableCell>{material.name}</TableCell>
                <TableCell>{material.description}</TableCell>
                <TableCell>{material.quantity}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(material, true)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteData(material.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Material;
