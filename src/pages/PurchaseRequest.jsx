import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
} from "@mui/material";
import "./PurchaseRequest.css"; // Add custom styles if needed

function PurchaseRequest() {
  const [items, setItems] = useState([
    { id: 1, quantity: 1, description: "Laptop", unitPrice: 30000, total: 30000 },
  ]);
  const [purpose, setPurpose] = useState("");

  const handleAddItem = () => {
    const newItem = {
      id: items.length + 1,
      quantity: 1,
      description: "",
      unitPrice: 0,
      total: 0,
    };
    setItems([...items, newItem]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;

    // Update total cost for the item
    if (field === "quantity" || field === "unitPrice") {
      updatedItems[index].total =
        updatedItems[index].quantity * updatedItems[index].unitPrice;
    }

    setItems(updatedItems);
  };

  const handleSaveDraft = () => {
    alert("Saved as Draft!");
  };

  const handleSubmitForApproval = () => {
    alert("Submitted for Approval!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "#0F1D9F" }}>Purchase Request</h1>
      <p style={{ color: "#666" }}>Record of Property or Equipment Issued</p>

      {/* Form Fields */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <TextField
          label="Date"
          type="date"
          defaultValue="2025-05-03"
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <TextField
          label="Request No."
          defaultValue="Draft-2025-001"
          fullWidth
        />
        <TextField
          label="Requested By"
          defaultValue="Juan Dela Cruz"
          fullWidth
        />
        <TextField
          label="Department"
          defaultValue="Planning and Development Office"
          fullWidth
        />
      </div>

      {/* Items Table */}
      <TableContainer component={Paper} style={{ marginBottom: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item No.</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Article/Description</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleInputChange(index, "quantity", parseInt(e.target.value) || 0)
                    }
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={item.description}
                    onChange={(e) =>
                      handleInputChange(index, "description", e.target.value)
                    }
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleInputChange(index, "unitPrice", parseFloat(e.target.value) || 0)
                    }
                    fullWidth
                  />
                </TableCell>
                <TableCell>{item.total.toLocaleString()}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() =>
                      setItems(items.filter((_, i) => i !== index))
                    }
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="contained"
        style={{
          backgroundColor: "#0F1D9F",
          color: "white",
          marginBottom: "20px",
        }}
        onClick={handleAddItem}
      >
        + Add More Item
      </Button>

      {/* Purpose Field */}
      <TextField
        label="Purpose"
        multiline
        rows={4}
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
        fullWidth
        style={{ marginBottom: "20px" }}
      />

      {/* Total Amount */}
      <h3 style={{ textAlign: "right", marginBottom: "20px" }}>
        Total Amount:{" "}
        {items.reduce((sum, item) => sum + item.total, 0).toLocaleString()}
      </h3>

      {/* Action Buttons */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        <Button
          variant="outlined"
          style={{
            borderColor: "#0F1D9F",
            color: "#0F1D9F",
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          style={{
            backgroundColor: "#0F1D9F",
            color: "white",
          }}
          onClick={handleSaveDraft}
        >
          Save as Draft
        </Button>
        <Button
          variant="contained"
          style={{
            backgroundColor: "#0F1D9F",
            color: "white",
          }}
          onClick={handleSubmitForApproval}
        >
          Submit for Approval
        </Button>
      </div>
    </div>
  );
}

export default PurchaseRequest;