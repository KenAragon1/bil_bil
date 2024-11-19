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
  Link,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
function Berkas() {
  const [berkas, setBerkas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nim: "",
    nama: "",
    jurusan: "",
    file_pendukung: null,
  });
  const [currentBerkas, setCurrentBerkas] = useState(null);
  useEffect(() => {
    fetchBerkas();
  }, []);
  const fetchBerkas = async () => {
    try {
      const response = await fetch("http://localhost:5000/berkas");
      const data = await response.json();
      setBerkas(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ nim: "", nama: "", jurusan: "", file_pendukung: null });
    setCurrentBerkas(null);
  };
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("nim", formData.nim);
    formDataToSend.append("nama", formData.nama);
    formDataToSend.append("jurusan", formData.jurusan);
    if (formData.file_pendukung) {
      formDataToSend.append("file_pendukung", formData.file_pendukung);
    }
    const url = currentBerkas
      ? `http://localhost:5000/berkas/${formData.nim}`
      : "http://localhost:5000/berkas";
    const method = currentBerkas ? "PUT" : "POST";
    try {
      await fetch(url, {
        method,
        body: formDataToSend,
      });
      fetchBerkas();
      handleClose();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };
  const handleEdit = (berkas) => {
    setFormData({
      nim: berkas.nim,
      nama: berkas.nama,
      jurusan: berkas.jurusan,
      file_pendukung: null,
    });
    setCurrentBerkas(berkas);
    handleOpen();
  };
  const handleDelete = async (nim) => {
    try {
      await fetch(`http://localhost:5000/berkas/${nim}`, { method: "DELETE" });
      fetchBerkas();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };
  if (loading) {
    return <CircularProgress />;
  }
  return (
    <TableContainer component={Paper}>
      <Typography variant="h4" gutterBottom>
        Data Berkas
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Tambah Berkas
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>NIM</TableCell>
            <TableCell>Nama</TableCell>
            <TableCell>Jurusan</TableCell>
            <TableCell>File Pendukung</TableCell>
            <TableCell>Aksi</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {berkas.map((row) => (
            <TableRow key={row.nim}>
              <TableCell>{row.nim}</TableCell>
              <TableCell>{row.nama}</TableCell>
              <TableCell>{row.jurusan}</TableCell>
              <TableCell>
                {row.file_pendukung ? (
                  <Link
                    href={`http://localhost:5000/uploads/${row.file_pendukung}`}
                    target="_blank"
                    rel="noopener"
                  >
                    Lihat Dokumen
                  </Link>
                ) : (
                  "Tidak ada file"
                )}
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleEdit(row)} color="primary">
                  <Edit />
                </IconButton>
                <IconButton
                  onClick={() => handleDelete(row.nim)}
                  color="secondary"
                >
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            p: 3,
            backgroundColor: "white",
            margin: "auto",
            width: 400,
            borderRadius: 1,
            mt: 5,
          }}
        >
          <Typography variant="h6">
            {currentBerkas ? "Edit" : "Tambah"} Berkas
          </Typography>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <TextField
              label="NIM"
              name="nim"
              value={formData.nim}
              onChange={handleChange}
              fullWidth
              required
              disabled={!!currentBerkas}
              sx={{ mt: 2 }}
            />
            <TextField
              label="Nama"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mt: 2 }}
            />
            <TextField
              label="Jurusan"
              name="jurusan"
              value={formData.jurusan}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mt: 2 }}
            />
            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{ mt: 2 }}
            >
              {formData.file_pendukung
                ? formData.file_pendukung.name
                : "Upload File"}
              <input
                type="file"
                name="file_pendukung"
                hidden
                onChange={handleChange}
              />
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
            >
              {currentBerkas ? "Perbarui" : "Tambah"} Berkas
            </Button>
          </form>
        </Box>
      </Modal>
    </TableContainer>
  );
}
export default Berkas;
