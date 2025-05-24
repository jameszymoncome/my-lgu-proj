import React, { useState, useRef, useEffect} from "react";
import "../PAR_ICS2.css";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Collapse,
} from "@mui/material";
import Header from "../../components/Header/Header.jsx";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ReportIcon from "@mui/icons-material/Report";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TableChartIcon from "@mui/icons-material/TableChart";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import PeopleIcon from "@mui/icons-material/People";
import PrintIcon from "@mui/icons-material/Print";
import { styled } from "@mui/system";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';
import QRCode from 'qrcode';
import { Notifications, NotificationsActive, NotificationsNone, NotificationsOff } from "@mui/icons-material";


const drawerWidth = 240;


const buttonStyles = {
  backgroundColor: "#0F1D9F",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "14px",
  marginRight: "10px",
};


const TextInput = () => (
  <div
    className="input-container"
    style={{
      display: "flex",
      gap: "20px",
      alignItems: "center",
      marginTop: "10px",
      justifyContent: "flex-start",
    }}
  >
    {/* First Input */}
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <label htmlFor="entity-name" className="label">
        Entity Name:
      </label>
      <input
        type="text"
        id="entity-name"
        className="text-input"
        placeholder="Enter entity name"
      />
    </div>
    {/* Second Input */}
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <label htmlFor="fund-cluster" className="label">
        Fund Cluster:
      </label>
      <input
        type="text"
        id="fund-cluster"
        className="text-input"
        placeholder="Enter fund cluster"
      />
    </div>
  </div>
);
 
const StyledTableCell = styled(TableCell)(({ isHeader }) => ({
  fontWeight: isHeader ? "bold" : "normal",
  fontSize: isHeader ? "16px" : "14px",
  color: isHeader ? "#0f1d9f" : "#333333",
  textAlign: "center",
  borderBottom: "2px solid #979797",
  padding: "10px 16px",
}));


const StyledTableContainer = styled(TableContainer)({
  marginTop: "10px",
  marginLeft: "0px",
  marginRight: "20px",
  width: "100%",
  maxWidth: "1490px",
  borderRadius: "10px",
  border: "1px solid #979797",
  overflowY: "auto",
});




function DH_PAR_ICS2() {
  const { ids  } = useParams();

  const navigate = useNavigate();
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isReportMenuOpen, setReportMenuOpen] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [userRole, setUserRole] = useState("");
  
    useEffect(() => {
      const storedFirstName = localStorage.getItem("firstName");
      const storeduserRole = localStorage.getItem("userRole");
      if (storedFirstName || storeduserRole) {
          setFirstName(storedFirstName);
          setUserRole(storeduserRole);
      } else {
          navigate("/login"); // Redirect to login if no first name is found
      }

        if (storeduserRole === "DEPARTMENT HEAD")  {
          navigate("/dh-par-ics2/:ids")
        }

        else if (storeduserRole === "CUSTODIAN") {
          navigate("/ctn-home-1")
        }

        else if (storeduserRole === "ADMIN") {
          navigate("/home-1")
        }

        else {
          navigate("/")
        }
  }, [navigate]);
  
  const handleListItemClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    Swal.fire({
      icon: "question",
      title: "Are you sure?",
      text: "Do you really want to log out?",
      showCancelButton: true, // Show the "No" button
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "No, Stay",
      background: "#f9f9f9", // Light background
      color: "#333", // Dark text color for contrast
      confirmButtonColor: "#d33", // Red color for "Yes" button
      cancelButtonColor: "#0F1D9F", // Blue color for "No" button
      customClass: {
        popup: "minimal-popup", // Add a custom class for further styling
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Perform logout logic
        localStorage.clear(); // Clear user data
        navigate('/'); // Redirect to login page
      } else {
        // Optional: Handle "No" button click (if needed)
        console.log("User chose to stay logged in.");
      }
    });
  };

  const toggleReportMenu = () => {
    setReportMenuOpen((prevOpen) => !prevOpen);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption1, setSelectedOption1] = useState("");
  const [tableData, setTableData] = useState([]);
  const [dates, setDate] = useState("");
  const [formIds, setFormIds] = useState("");
  const [stickerData, setStickerData] = useState([]);

  useEffect(() => {
    const fetchStickerData = async () => {
      try {
        const response = await axios.get(`http://ppemanagement.andrieinthesun.com/getDataSticker.php`, {
          params: { ids: ids }
        })
        console.log("Sticker data response:", response.data.data);
        setStickerData(response.data.data);
      } catch (error) {
        console.error("Error fetching sticker data:", error);
      }
    };

    fetchStickerData();
  }, []);

  useEffect(() => {
    if(ids[0] === 'i'){
      setSelectedOption1('optionA');
    }
    const getItemID = async () => {
      console.log("Fetching data for IDs:", ids);
      try {
        const response = await axios.get(`http://ppemanagement.andrieinthesun.com/get_item.php`, {
          params: { ids: ids }, // Send `ids` as a query parameter
        });
        console.log("Response data:", response.data.data[0].datess);
        setTableData(response.data.data);
        setDate(response.data.data[0].datess);
        setFormIds(response.data.data[0].form_id);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getItemID();
  }, [ids])

  const tableRef = useRef();


  const handleDropdownChange1 = (event) => {
    setSelectedOption1(event.target.value);
  };


  const handleExportPDF = () => {
    const reportType = selectedOption1 === 'optionA'
      ? 'INVENTORY CUSTODIAN SLIP'
      : 'PROPERTY ACKNOWLEDGEMENT RECEIPT';

    const content = `
      <div style="font-family: Arial, sans-serif; font-size: 10px; padding: 20px;">
        <div style="text-align: center; font-size: 20px; font-weight: bold;">
          ${reportType}
        </div>
        <div style="text-align: center; font-size: 11px;">
          FOR NEW PROPERTY ACCOUNTABILITY
        </div>

        <div style="margin-top: 40px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
          <div>
            <strong>Date:</strong>
            <u style="font-size: 13px; line-height: .5;">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              ${dates}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </u>
          </div>
          <div>
            <strong>Date:</strong>
            <u style="font-size: 13px; line-height: .5;">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              ${formIds}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </u>
          </div>
        </div>

        <table border="1" cellspacing="0" cellpadding="10" style="width:100%; margin-top: 30px; border-collapse: collapse; font-size: 10px; text-align: center;">
          <thead>
            <tr>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Description</th>
              <th>Property No.</th>
              <th>Date Acquired</th>
              <th>Unit Cost</th>
              <th>Total Cost</th>
            </tr>
          </thead>
          <tbody>
            ${tableData.map(row => `
              <tr>
                <td>${row.quantity}</td>
                <td>${row.serial_no}</td>
                <td>${row.description}</td>
                <td>${row.propertyNo}</td>
                <td>${row.date_acquisition}</td>
                <td>${row.unit_price}</td>
                <td>${row.total_price}</td>
              </tr>`).join('')}
          </tbody>
        </table>

        <div style="margin-top: 90px; display: flex; justify-content: space-around;">
          <div style="text-align: center; font-size: 10px; font-weight: bold;">
            <div>Issued by:</div>
            <div style="border-top: 1px solid black; margin-top: 30px;"></div>
            <div>Signature over Printed Name of FAD Authorized Representative</div>
            <div style="border-top: 1px solid black; margin-top: 30px;"></div>
            <div>Date</div>
          </div>
          <div style="text-align: center; font-size: 10px; font-weight: bold;">
            <div>Received by:</div>
            <div style="border-top: 1px solid black; margin-top: 30px;"></div>
            <div>Signature over Printed Name of End User</div>
            <div style="border-top: 1px solid black; margin-top: 30px;"></div>
            <div>Position/Office</div>
            <div style="border-top: 1px solid black; margin-top: 30px;"></div>
            <div>Date</div>
          </div>
        </div>
      </div>
    `;

    const element = document.createElement('div');
    element.innerHTML = content;

    html2pdf().set({
      margin: 0.5,
      filename: `${ids.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }).from(element).save();
  };

  const handlePrintSticker = async () => {
    console.log("Printing stickers for IDs:", ids);
    const pdf = new jsPDF("p", "mm", "a4");
    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const stickerWidth = pageWidth / 2;
    const stickerHeight = 70;
    const gap = 10; // Gap between stickers
    const marginTop = 10;
    let currentY = marginTop;

    for (let i = 0; i < stickerData.length; i++) {
      const item = stickerData[i];

      if (currentY + stickerHeight > pageHeight - marginTop) {
        pdf.addPage();
        currentY = marginTop;
      }
  
      const x = (pageWidth - stickerWidth) / 2;

      const borderRadius = 1; // Adjust the border radius as needed
      pdf.setDrawColor(0);
      pdf.setLineWidth(0.5);
      pdf.roundedRect(x, currentY, stickerWidth, stickerHeight, borderRadius, borderRadius);

      const imageUrl = "/ppe_logo.png"; // Replace with the actual image path or base64 string
      const imageWidth = 30; // Adjust the image width
      const imageHeight = 30; // Adjust the image height
      const imageX = x + (stickerWidth - imageWidth) / 2; // Center the image horizontally within the box
      const imageY = currentY + (stickerHeight - imageHeight) / 2; // Center the image vertically within the box
      pdf.addImage(imageUrl, "PNG", imageX, imageY, imageWidth, imageHeight);

      // Add text at the top of the box
      pdf.setFontSize(8.5);
      pdf.setFont("helvetica", "bold");
      pdf.text("LOCAL GOVERNMENT UNIT OF DAET", x + 3, currentY + 6.5);

      pdf.setFontSize(6);
      const text = "NO. " + item.item_id;
      const textWidth = pdf.getTextWidth(text);
      pdf.setFont("helvetica", "normal");
      pdf.text(text, x + stickerWidth - textWidth - 5, currentY + 6.3);

      const texts = "Inventory Tag";
      const textWidths = pdf.getTextWidth(texts);
      pdf.setFont("helvetica", "normal");
      pdf.text(texts, x + stickerWidth - textWidths - 13, currentY + 9);

      pdf.setFontSize(7.5);
      pdf.setFont("helvetica", "bold");
      pdf.text("GOVERNMENT PROPERTY", x + 3, currentY + 10);


      pdf.setLineWidth(0.2);

      const departmentText = item.department || ""; // Assuming `item.department` contains the value you want to display
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");
      const departmentTextWidth = pdf.getTextWidth(departmentText);
      const departmentTextX = x + (stickerWidth - departmentTextWidth) / 2; // Center the text horizontally
      const departmentTextY = currentY + 17; // Position the text just above the line
      pdf.text(departmentText, departmentTextX, departmentTextY);

      const lineStartX = x + 35; // Start 3mm from the left edge of the box
      const lineEndX = x + stickerWidth - 35; // End 3mm from the right edge of the box
      const lineY = currentY + 18; // Position the line just below the "GOVERNMENT PROPERTY" text
      pdf.line(lineStartX, lineY, lineEndX, lineY); // Draw the horizontal line

      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");
      const officeText = "Office / Location:";
      const officeTextWidth = pdf.getTextWidth(officeText);
      pdf.text(officeText, x + (stickerWidth - officeTextWidth) / 2, lineY + 3);

      
      const articleText = "Article:";
      const articleTextWidth = pdf.getTextWidth(articleText);
      const articleY = lineY + 11; // Position 10mm below the line
      pdf.text(articleText, x + 3, articleY); // Align "Article" to the left inside the box

      const descriptionText = item.description || ""; // Assuming `item.description` contains the value you want to display
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");
      const descriptionTextWidth = pdf.getTextWidth(descriptionText);
      const descriptionTextX = x + articleTextWidth + 15;
      const descriptionTextY = articleY - 1; // Position the text just above the line
      pdf.text(descriptionText, descriptionTextX, descriptionTextY);

      // Draw a line beside "Article"
      const articleLineStartX = x + 3 + articleTextWidth + 2; // Start the line right after "Article" with a 2mm gap
      const articleLineEndX = x + stickerWidth - 3; // End the line near the right edge of the box
      pdf.line(articleLineStartX, articleY, articleLineEndX, articleY); // Draw the line

      const propertyText = "Property No.";
      const propertyTextWidth = pdf.getTextWidth(propertyText);
      const propertyY = articleY + 4.5; // Position 10mm below the "Article" line
      pdf.text(propertyText, x + 3, propertyY); // Align "Property No." to the left
      
      const itemIdText = item.item_id || ""; // Assuming `item.item_id` contains the value you want to display
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");
      const itemIdTextWidth = pdf.getTextWidth(itemIdText);
      const itemIdTextX = x + propertyTextWidth + 10; // Align the text to the left
      const itemIdTextY = propertyY - 1; // Position the text just above the line
      pdf.text(itemIdText, itemIdTextX, itemIdTextY);

      // Draw a line beside "Property No."
      const propertyLineStartX = x + 3 + propertyTextWidth + 2; // Start the line right after "Property No." with a 2mm gap
      const propertyLineEndX = x + stickerWidth / 2 - 5; // End the line halfway through the box
      pdf.line(propertyLineStartX, propertyY, propertyLineEndX, propertyY); // Draw the line

      // Add "Serial No." next to the line
      const serialText = "Serial No.:";
      const serialTextWidth = pdf.getTextWidth(serialText);
      const serialTextX = propertyLineEndX + 5; // Start "Serial No." 5mm after the first line
      pdf.text(serialText, serialTextX, propertyY); // Position "Serial No." next to the line

      const serialNoText = item.serial_no || ""; // Assuming `item.serial_no` contains the value you want to display
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");
      const serialNoTextWidth = pdf.getTextWidth(serialNoText);
      const serialNoTextX = serialTextX + 22; // Align the text to the same starting point as "Serial No."
      const serialNoTextY = propertyY - 1; // Position the text just above the line
      pdf.text(serialNoText, serialNoTextX, serialNoTextY);

      // Draw a line beside "Serial No."
      const serialLineStartX = serialTextX + serialTextWidth + 2; // Start the line right after "Serial No." with a 2mm gap
      const serialLineEndX = x + stickerWidth - 3; // End the line near the right edge of the box
      pdf.line(serialLineStartX, propertyY, serialLineEndX, propertyY); // Draw the line

      const serviceableText = "Serviceable";
      const serviceableTextWidth = pdf.getTextWidth(serviceableText);
      const serviceableY = propertyY + 4.5; // Position 10mm below the "Article" line
      pdf.text(serviceableText, x + 3, serviceableY); // Align "Property No." to the left
    
      // Draw a line beside "Property No."
      const serviceableLineStartX = x + 3 + serviceableTextWidth + 2; // Start the line right after "Property No." with a 2mm gap
      const serviceableLineEndX = x + stickerWidth / 2 - 5; // End the line halfway through the box
      pdf.line(serviceableLineStartX, serviceableY, serviceableLineEndX, serviceableY); // Draw the line
  
      const unserviceableText = "Unserviceable";
      const unserviceableTextWidth = pdf.getTextWidth(unserviceableText);
      const unserviceableTextX = serviceableLineEndX + 5; // Start "Serial No." 5mm after the first line
      pdf.text(unserviceableText, unserviceableTextX, serviceableY); // Position "Serial No." next to the line
  
      // Draw a line beside "Serial No."
      const unserviceableStartX = unserviceableTextX + unserviceableTextWidth + 2; // Start the line right after "Serial No." with a 2mm gap
      const unserviceableLineEndX = x + stickerWidth - 3; // End the line near the right edge of the box
      pdf.line(unserviceableStartX, serviceableY, unserviceableLineEndX, serviceableY); // Draw the line
  
      // Add "Unit / Quantity" and "Total Cost" with lines beside them
      const unitText = "Unit / Quantity:";
      const unitTextWidth = pdf.getTextWidth(unitText);
      const unitY = serviceableY + 4.5; // Position below "Serviceable" line
      pdf.text(unitText, x + 3, unitY); // Align "Unit / Quantity" to the left

      const quantityText = item.quantity ? String(item.quantity) : ""; // Assuming `item.quantity` contains the value you want to display
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");
      const quantityTextWidth = pdf.getTextWidth(quantityText);
      const quantityTextX = x + unitTextWidth + 10; // Align the text to the left
      const quantityTextY = unitY - 1; // Position the text just above the line
      pdf.text(quantityText, quantityTextX, quantityTextY);
  
      // Draw a line beside "Unit / Quantity"
      const unitLineStartX = x + 3 + unitTextWidth + 2; // Start the line right after "Unit / Quantity" with a 2mm gap
      const unitLineEndX = x + stickerWidth / 2 - 5; // End the line halfway through the box
      pdf.line(unitLineStartX, unitY, unitLineEndX, unitY); // Draw the line
  
      // Add "Total Cost" next to the line
      const totalCostText = "Total Cost:";
      const totalCostTextWidth = pdf.getTextWidth(totalCostText);
      const totalCostX = unitLineEndX + 5; // Start "Total Cost" 5mm after the first line
      pdf.text(totalCostText, totalCostX, unitY); // Position "Total Cost" next to the line

      const unitPriceText = item.unit_price ? String(item.unit_price) : ""; // Assuming `item.unit_price` contains the value you want to display
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");
      const unitPriceTextWidth = pdf.getTextWidth(unitPriceText);
      const unitPriceTextX = totalCostX + 23; // Align the text to the same starting point as "Total Cost"
      const unitPriceTextY = unitY - 1; // Position the text just above the line
      pdf.text(unitPriceText, unitPriceTextX, unitPriceTextY);
  
      // Draw a line beside "Total Cost"
      const totalCostLineStartX = totalCostX + totalCostTextWidth + 2; // Start the line right after "Total Cost" with a 2mm gap
      const totalCostLineEndX = x + stickerWidth - 3; // End the line near the right edge of the box
      pdf.line(totalCostLineStartX, unitY, totalCostLineEndX, unitY); // Draw the line
  
      // Add two lines and a QR code below the second line
      const line1Y = unitY + 9; // Position the first line 6mm below "Unit / Quantity"
      const line2Y = line1Y + 2; // Position the second line 6mm below the first line
  
      // Calculate the width for each line
      const lineWidth = (stickerWidth - 20) / 3; // Divide the space into three parts (two lines and QR code)
      const line1StartX = x + 8; // Start the first line from the left margin
      const line1EndX = line1StartX + lineWidth; // End the first line
      const line2StartX = line1EndX + 10; // Leave a 10mm gap and start the second line
      const line2EndX = line2StartX + lineWidth; // End the second line
  
      // Draw the first line
      pdf.line(line1StartX, line1Y, line1EndX, line1Y);
  
      // Draw the second line
      pdf.line(line2StartX, line1Y, line2EndX, line1Y);
  
      const dateAcquiredText = "Date (Acquired)";
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");
      pdf.text(dateAcquiredText, x + 13, line2Y + 1); // Position the label

      const dateAcquiredValue = item.date_acquisition || "";
      pdf.text(dateAcquiredValue, x + 15, line2Y - 3);

      const dateCountedText = "Date (Counted)";
      const dateAcquiredTextWidth = pdf.getTextWidth(dateAcquiredText);
      const dateCountedX = x + 8 + dateAcquiredTextWidth + 26;
      pdf.text(dateCountedText, dateCountedX, line2Y + 1);

      const dateCountedValue = item.date || "";
      pdf.text(dateCountedValue, dateCountedX + 3, line2Y - 3);
  
      const lineUnderDateY = line2Y + 1 + 7; // Position 6mm below "Date (Acquired)" and "Date (Counted)"
  
      // Calculate the width for each line
      const lineUnderDateWidth = (stickerWidth - 20) / 3; // Divide the space into two equal parts
      const lineUnderDateStartX1 = x + 8; // Start the first line from the left margin
      const lineUnderDateEndX1 = lineUnderDateStartX1 + lineUnderDateWidth; // End the first line
      const lineUnderDateStartX2 = lineUnderDateEndX1 + 10; // Leave a 10mm gap and start the second line
      const lineUnderDateEndX2 = lineUnderDateStartX2 + lineUnderDateWidth;
  
      pdf.line(lineUnderDateStartX1, lineUnderDateY, lineUnderDateEndX1, lineUnderDateY);

      // Draw the second line
      pdf.line(lineUnderDateStartX2, lineUnderDateY, lineUnderDateEndX2, lineUnderDateY);

      // Add "COA Representative" text
      const coaRepresentativeText = "COA Representative:";
      const coaRepresentativeY = lineUnderDateY + 3; // Position 6mm below the line
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");
      pdf.text(coaRepresentativeText, x + 11, coaRepresentativeY); // Align "COA Representative" to the left

      // Add "Property Custodian" text
      const propertyCustodianText = "Property Custodian:";
      const coaRepresentativeTextWidth = pdf.getTextWidth(coaRepresentativeText);
      const propertyCustodianX = x + 3 + coaRepresentativeTextWidth + 24; // Add a 20mm gap after "COA Representative"
      pdf.text(propertyCustodianText, propertyCustodianX, coaRepresentativeY);

      // Add item.custodian_name above the "Property Custodian" line
      const custodianName = item.custodian_name || ""; // Assuming `item.custodian_name` contains the value
      const custodianNameX = propertyCustodianX; // Align with "Property Custodian"
      const custodianNameY = lineUnderDateY - 2; // Position the text just above the line
      pdf.text(custodianName, custodianNameX, custodianNameY);

      // Add a QR code to the right of the second line
      const qrCodeX = line2EndX + 5; // Position the QR code 10mm to the right of the second line
      const qrCodeY = line1Y - 7; // Align the QR code vertically with the lines
      const qrCodeSize = 25; // Set the size of the QR code
      const qrCodeText = item.item_id; // Replace with your QR code content
      const logoUrl = "/ppe_logo.png";

      try {
        const qrCodeImage = await generateQRCode(qrCodeText); // Wait for QR code generation
        if (qrCodeImage) {
          // Add the QR code to the PDF
          pdf.addImage(qrCodeImage, "PNG", qrCodeX, qrCodeY, qrCodeSize, qrCodeSize);
      
          // Create a white square "hole" in the center of the QR code
          const logoSize = qrCodeSize / 5; // Set the logo size to 1/3 of the QR code size
          const logoX = qrCodeX + (qrCodeSize - logoSize) / 2; // Center the logo horizontally within the QR code
          const logoY = qrCodeY + (qrCodeSize - logoSize) / 2; // Center the logo vertically within the QR code
          pdf.setFillColor(255, 255, 255); // Set the fill color to white
          pdf.rect(logoX, logoY, logoSize, logoSize, "F"); // Draw a filled rectangle (white square)
      
          pdf.addImage(qrCodeImage, "PNG", qrCodeX, qrCodeY, qrCodeSize, qrCodeSize);
          console.log("QR Code Content:", qrCodeText);
        } else {
          console.error("Failed to generate QR code.");
        }
      } catch (error) {
        console.error("Error generating QR code:", error);
      }

      currentY += stickerHeight + gap;

    }

    pdf.save(`${ids.replace(/\s+/g, '_')}Sticker.pdf`);
  }


  async function generateQRCode(text) {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(text);
      return qrCodeDataURL;
    } catch (error) {
      console.error("Error generating QR code:", error);
      return null;
    }
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredTableData = tableData.filter((row) => {
    return (
      row.quantity.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.serial_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.propertyNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.date_acquisition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.unit_price.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.total_price.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });


  return (
    <div style={{ display: "flex" }}>
      <Header />

      <Drawer
              variant="permanent"
              sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                  width: drawerWidth,
                  boxSizing: "border-box",
                  marginTop: "4rem",
                  backgroundColor: "#FFFF",
                  cursor: "pointer",
                },
              }}
            >
              <List>
                <ListItem button onClick={() => handleListItemClick("/dh-home-1")} >
                  <ListItemIcon>
                    <HomeIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItem>
                <ListItem button onClick={() => handleListItemClick("/dh-purchase-request")} >
                  <ListItemIcon>
                    <AssignmentIcon/>
                  </ListItemIcon>
                  <ListItemText primary="Purchase Request" />
                </ListItem>
                <ListItem button onClick={() => handleListItemClick("/dh-purchase-list")} >
                  <ListItemIcon>
                    <AssignmentIcon />
                  </ListItemIcon>
                  <ListItemText primary="Purchase List" />
                </ListItem>
                <ListItem button onClick={() => handleListItemClick("/dh-inspection")}>
                  <ListItemIcon>
                    <ReportIcon />
                  </ListItemIcon>
                  <ListItemText primary="Inspection" />
                </ListItem>
                <ListItem button onClick={toggleReportMenu}>
                  <ListItemIcon>
                    <ReportIcon />
                  </ListItemIcon>
                  <ListItemText primary="Records" />
                  {isReportMenuOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={isReportMenuOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItem
                      button
                      style={{ paddingLeft: 32, color: "#0F1D9F" }}
                      onClick={() => handleListItemClick("/dh-parics1")}
                    >
                      <ListItemIcon>
                                      <AssignmentIcon style={{ color: "#0F1D9F"}}/>
                                    </ListItemIcon>
                      <ListItemText primary="PAR & ICS" />
                    </ListItem>
                    <ListItem
                      button
                      style={{ paddingLeft: 32 }}
                      onClick={() => handleListItemClick("/dh-inventory")}
                    >
                      <ListItemIcon>
                                      <AssignmentIcon />
                                    </ListItemIcon>
                      <ListItemText primary="Inventory" />
                    </ListItem>
                  </List>
                </Collapse>
                <ListItem button onClick={() => handleListItemClick("/dh-notification")}>
                  <ListItemIcon>
                    <Notifications />
                  </ListItemIcon>
                  <ListItemText primary="Notification" />
                </ListItem>
                <ListItem button onClick={() => handleListItemClick("/dh-profile")}>
                  <ListItemIcon>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItem>
                <ListItem button onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItem>
              </List>
            </Drawer>

      <div
        style={{
          flexGrow: 1,
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          overflowX: "hidden",
          height: "100vh",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Header and Buttons */}
        <div className="header-section-container">
          <div className="header-content">
            <div className="left-column">
              <h1>PAR and ICS Records</h1>
              <p>Generate and View Inventory, Issuance, Inspections, and Status Reports</p>
            </div>


            <button className="print-button" onClick={handlePrintSticker} style={buttonStyles}>
              <PrintIcon style={{ marginRight: "10px" }} />
              Print Sticker
            </button>
            <button className="print-button" onClick={handleExportPDF} style={buttonStyles}>
              <PrintIcon style={{ marginRight: "10px" }} />
              Print Report
            </button>
          </div>
        </div>


        {/* Search and Dropdown */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ flex: 1 }}
            InputProps={{
              startAdornment: <SearchIcon />,
            }}
          />


          {/* Dropdown Selection */}
          {/* <FormControl style={{ minWidth: "150px" }}>
            <InputLabel>Report Type</InputLabel>
            <Select value={selectedOption1} onChange={handleDropdownChange1} label="Report Type">
              <MenuItem value="optionA">Property Acknowledgement Receipt(PAR)</MenuItem>
              <MenuItem value="optionB">Inventory Custodian Slip (ICS)</MenuItem>
            </Select>
          </FormControl> */}
        </div>


        {/* Table Data */}
        <StyledTableContainer ref={tableRef} component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell isHeader={true}>Quantity</StyledTableCell>
                <StyledTableCell isHeader={true}>Serial No.</StyledTableCell>
                <StyledTableCell isHeader={true}>Description</StyledTableCell>
                <StyledTableCell isHeader={true}>Property No.</StyledTableCell>
                <StyledTableCell isHeader={true}>Date Acquired</StyledTableCell>
                <StyledTableCell isHeader={true}>Unit Cost</StyledTableCell>
                <StyledTableCell isHeader={true}>Total Cost</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTableData.map((row, index) => (
                <TableRow key={index}>
                  <StyledTableCell>{row.quantity}</StyledTableCell>
                  <StyledTableCell>{row.serial_no}</StyledTableCell>
                  <StyledTableCell>{row.description}</StyledTableCell>
                  <StyledTableCell>{row.propertyNo}</StyledTableCell> {/* Assuming you want to show 'procsid_range' */}
                  <StyledTableCell>{row.date_acquisition}</StyledTableCell> {/* Assuming you have a dateAcquired column */}
                  <StyledTableCell>{row.unit_price}</StyledTableCell>
                  <StyledTableCell>{row.total_price}</StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>


      </div>
    </div>
  );
}


export default DH_PAR_ICS2;