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
  Grid,
} from "@mui/material";
const Produk = () => {
  const [produk, setProduk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    kode_produk: "",
    nama_produk: "",
    harga: "",
    jumlah: "",
    gambar: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  useEffect(() => {
    fetchProduk();
  }, []);
  const fetchProduk = () => {
    setLoading(true);
    fetch("http://localhost:5000/produk")
      .then((response) => response.json())
      .then((data) => {
        setProduk(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };
  const handleOpen = (product = null) => {
    setCurrentProduct(product);
    if (product) {
      setFormData({
        kode_produk: product.kode_produk,
        nama_produk: product.nama_produk,
        harga: product.harga,
        jumlah: product.jumlah,
        gambar: null,
      });
      setImagePreview(`http://localhost:5000/uploads/${product.gambar}`);
    } else {
      setFormData({
        kode_produk: "",
        nama_produk: "",
        harga: "",
        jumlah: "",
        gambar: null,
      });
      setImagePreview(null);
    }
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setImagePreview(null);
  };
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "gambar") {
      const file = files[0];
      setFormData({ ...formData, gambar: file });
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const formPayload = new FormData();
    formPayload.append("kode_produk", formData.kode_produk);
    formPayload.append("nama_produk", formData.nama_produk);
    formPayload.append("harga", formData.harga);
    formPayload.append("jumlah", formData.jumlah);
    if (formData.gambar) formPayload.append("gambar", formData.gambar);
    const method = currentProduct ? "PUT" : "POST";
    const url = currentProduct
      ? `http://localhost:5000/produk/${formData.kode_produk}`
      : "http://localhost:5000/produk";
    fetch(url, {
      method: method,
      body: formPayload,
    })
      .then((response) => response.json())
      .then(() => {
        fetchProduk();
        handleClose();
      })
      .catch((error) => console.error("Error:", error));
  };
  if (loading) {
    return <CircularProgress />;
  }
  const handleDelete = (kode_produk) => {
    fetch(`http://localhost:5000/produk/${kode_produk}`, { method: "DELETE" })
      .then((response) => response.json())
      .then(() => fetchProduk())
      .catch((error) => console.error("Error:", error));
  };
  if (loading) {
    return <CircularProgress />;
  }
  return (
    <TableContainer component={Paper}>
      <Typography variant="h4" gutterBottom>
        Data Produk
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Tambah Produk
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Kode Produk</TableCell>
            <TableCell>Nama Produk</TableCell>
            <TableCell>Harga</TableCell>
            <TableCell>Jumlah</TableCell>
            <TableCell>Gambar</TableCell>
            <TableCell>Aksi</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {produk.map((row) => (
            <TableRow key={row.kode_produk}>
              <TableCell>{row.kode_produk}</TableCell>
              <TableCell>{row.nama_produk}</TableCell>
              <TableCell>{row.harga}</TableCell>
              <TableCell>{row.jumlah}</TableCell>
              <TableCell>
                <img
                  src={`http://localhost:5000/uploads/${row.gambar}`}
                  alt={row.nama_produk}
                  style={{ width: 100, height: 100, objectFit: "cover" }}
                />
              </TableCell>
              <TableCell>
                <Button onClick={() => handleOpen(row)} color="primary">
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(row.kode_produk)}
                  color="secondary"
                >
                  Hapus
                </Button>
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
            width: 500,
            borderRadius: 1,
          }}
        >
          <Typography variant="h6">
            {currentProduct ? "Edit" : "Tambah"} Produk
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Kode Produk"
                  name="kode_produk"
                  value={formData.kode_produk}
                  onChange={handleChange}
                  fullWidth
                  required
                  disabled={!!currentProduct}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Nama Produk"
                  name="nama_produk"
                  value={formData.nama_produk}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Harga"
                  name="harga"
                  value={formData.harga}
                  onChange={handleChange}
                  fullWidth
                  required
                  type="number"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Jumlah"
                  name="jumlah"
                  value={formData.jumlah}
                  onChange={handleChange}
                  fullWidth
                  required
                  type="number"
                />
              </Grid>
              <Grid item xs={12}>
                <input
                  type="file"
                  name="gambar"
                  onChange={handleChange}
                  accept="image/*"
                />
              </Grid>
              {imagePreview && (
                <Grid item xs={12}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: "100%",
                      maxHeight: 200,
                      objectFit: "contain",
                      marginTop: 10,
                    }}
                  />
                </Grid>
              )}
            </Grid>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: 20 }}
            >
              {currentProduct ? "Perbarui" : "Tambah"} Produk
            </Button>
          </form>
        </Box>
      </Modal>
    </TableContainer>
  );
};
export default Produk;
