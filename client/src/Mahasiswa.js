import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Button,
  Modal,
  Box,
  TextField,
  IconButton,
  styled,
} from "@mui/material";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

function Mahasiswa() {
  const formDefaultValue = {
    nim: "",
    nama: "",
    jurusan: "",
    angkatan: "",
  };

  const [mahasiswa, setMahasiswa] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(formDefaultValue);

  const [isEdititng, setIsEditing] = useState(false);

  function handleTambahData() {
    setFormData(formDefaultValue);
    setIsEditing(false);
    setOpenModal(true);
  }

  function handleCloseModal() {
    setOpenModal(false);
  }

  function handleEditData(data) {
    setIsEditing(true);
    setFormData(data);
    setOpenModal(true);
  }

  function handleDeleteData(nim) {
    fetch(`http://localhost:5000/mahasiswa/${nim}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.text);
        res.json();
      })
      .then(() =>
        setMahasiswa((prev) =>
          prev.filter((mahasiswa) => mahasiswa.nim !== nim)
        )
      )
      .catch((e) => console.error("Error: ", e));
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    fetch(
      `http://localhost:5000/mahasiswa${isEdititng && "/" + formData.nim}`,
      {
        method: isEdititng ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    )
      .then((response) => response.json())
      .then((result) => {
        isEdititng
          ? setMahasiswa((prev) =>
              prev.map((mahasiswa) => {
                if (mahasiswa.nim === formData.nim)
                  return { ...mahasiswa, ...formData };
                return mahasiswa;
              })
            )
          : setMahasiswa((prev) => [...prev, result.data]);
        setFormData(formDefaultValue);
        handleCloseModal();
      })
      .catch((e) => console.error("Error: ", e));
  }

  useEffect(() => {
    fetch("http://localhost:5000/mahasiswa")
      .then((response) => response.json())
      .then((data) => {
        setMahasiswa(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);
  if (loading) {
    return <CircularProgress />;
  }
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Data Mahasiswa
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        style={{ marginBottom: "2px" }}
        onClick={() => handleTambahData(formDefaultValue)}
      >
        Tambah Data
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>NIM</TableCell>
              <TableCell>Nama</TableCell>
              <TableCell>Jurusan</TableCell>
              <TableCell>Angkatan</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mahasiswa.map((row) => (
              <TableRow key={row.nim}>
                <TableCell>{row.nim}</TableCell>
                <TableCell>{row.nama}</TableCell>
                <TableCell>{row.jurusan}</TableCell>
                <TableCell>{row.angkatan}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditData(row)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteData(row.nim)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              backgroundColor: "white",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Tambah Data Mahasiswa
              <IconButton
                aria-label="close"
                onClick={handleCloseModal}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                slotProps={{
                  input: {
                    readOnly: isEdititng,
                  },
                }}
                id="nim"
                label="NIM"
                name="nim"
                value={formData.nim}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="nama"
                label="Nama"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="jurusan"
                label="Jurusan"
                name="jurusan"
                value={formData.jurusan}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="angkatan"
                label="Angkatan"
                name="angkatan"
                value={formData.angkatan}
                onChange={handleChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
              >
                Simpan
              </Button>
            </form>
          </Box>
        </Modal>
      </TableContainer>
    </>
  );
}
export default Mahasiswa;
