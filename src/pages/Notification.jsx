import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

function Notification() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    // Retrieve entries from local storage
    const storedEntries = localStorage.getItem("ppeEntries");
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries));
    }
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "#0F1D9F" }}>Notifications</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold", color: "#0F1D9F" }}>Quantity</TableCell>
              <TableCell style={{ fontWeight: "bold", color: "#0F1D9F" }}>Unit</TableCell>
              <TableCell style={{ fontWeight: "bold", color: "#0F1D9F" }}>Description</TableCell>
              <TableCell style={{ fontWeight: "bold", color: "#0F1D9F" }}>Date Acquired</TableCell>
              <TableCell style={{ fontWeight: "bold", color: "#0F1D9F" }}>Unit Cost</TableCell>
              <TableCell style={{ fontWeight: "bold", color: "#0F1D9F" }}>Total Cost</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{entry.quantity}</TableCell>
                <TableCell>{entry.unit}</TableCell>
                <TableCell>{entry.description}</TableCell>
                <TableCell>{entry.dateAcquired}</TableCell>
                <TableCell>{entry.unitCost}</TableCell>
                <TableCell>{entry.totalCost}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Notification;