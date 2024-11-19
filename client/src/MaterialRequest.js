import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function MaterialRequest() {
  const [materialsRequests, setMaterialRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bgPosition, setBgPosition] = useState(0);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch("http://localhost:5000/material-request");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setMaterialRequests(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  const handleSliderChange = (event, newValue) => {
    setBgPosition(newValue);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  async function approveRequest(id) {
    console.log("requet send with id " + id);
    try {
      const response = await fetch(
        `http://localhost:5000/material-request/${id}/approve`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setMaterialRequests((prev) =>
        prev.map((request) => {
          if (request.id === id) request.status = "approved";

          return request;
        })
      );
    } catch (error) {}
  }
  async function rejectRequest(id) {
    console.log("requet send with id " + id);
    try {
      const response = await fetch(
        `http://localhost:5000/material-request/${id}/reject`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setMaterialRequests((prev) =>
        prev.map((request) => {
          if (request.id === id) request.status = "rejected";

          return request;
        })
      );
    } catch (error) {}
  }

  return (
    <Box
      sx={{ padding: 3, maxWidth: 1100, margin: "auto", position: "relative" }}
    >
      <Box
        sx={{
          position: "absolute",
          top: `-50px`,
          left: "-50%",
          width: "500%",
          height: "60%",
          backgroundColor: "#1976d2",
          zIndex: -1,
        }}
      />

      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#fff",
          mb: 2,
          left: "-20%",
          position: "relative",
          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.7)",
        }}
      >
        Material Request
      </Typography>

      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          padding: 2,
          width: "140%",
          left: "-20%",
          position: "relative",
          overflow: "visible",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search"
            sx={{
              ml: "auto",
              width: 250,
              backgroundColor: "#f1f3f4",
              borderRadius: 1,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <TableContainer sx={{ border: "1px solid #e0e0e0", borderRadius: 1 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#1976d2" }}>
              <TableRow>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  No.
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Requested Date
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Requested By
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Material Name
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Quantity
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Weight
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Remark
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Status
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {materialsRequests.map((request, index) => (
                <TableRow key={request.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{request.requested_date}</TableCell>
                  <TableCell>{request.requested_by}</TableCell>
                  <TableCell>{request.material_name}</TableCell>
                  <TableCell>{request.quantity}</TableCell>
                  <TableCell>{request.weight}</TableCell>
                  <TableCell>{request.remark}</TableCell>
                  <TableCell>{request.status}</TableCell>
                  <TableCell>
                    {request.status === "waiting" && (
                      <>
                        <Button
                          variant="contained"
                          onClick={() => approveRequest(request.id)}
                          color="success"
                          size="small"
                          sx={{
                            mr: 1,
                            backgroundColor: "#4caf50",
                            color: "#fff",
                            minWidth: 75,
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() => rejectRequest(request.id)}
                          variant="contained"
                          color="error"
                          size="small"
                          sx={{
                            backgroundColor: "#f44336",
                            color: "#fff",
                            minWidth: 75,
                          }}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default MaterialRequest;
