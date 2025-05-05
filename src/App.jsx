import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/Home.jsx';
import PPE_Entry from './pages/PPE_Entry.jsx';
import Login from './features/Auth/Login.jsx';
import AccountManagement from "./pages/AccountManagement.jsx";
import Inven_Inspect from "./pages/Inven_Inspect.jsx";
import Inventory_report1 from "./pages/InventoryReport.jsx";
import ManageTables from "./pages/ManageTables.jsx";
import AddAccount from "./pages/AddAccount.jsx";
import PAR_ICS1 from "./pages/PAR_ICS1.jsx";
import Home_encoder from "./pages/Home(encoder).jsx";
import Home_user from "./pages/Home(user).jsx";
import PAR_ICS2 from "./pages/PAR_ICS2.jsx";
import Profile from "./pages/Profile.jsx";
import Item_history from "./pages/Item_history.jsx";
import Inspection_Scanner from "./pages/Inspection_Scanner.jsx";
import ForgotPassword from "./features/Auth/ForgotPassword.jsx";
import EncoderPPE_Entry from "./pages/EncoderPages/EconderPPE_Entry.jsx";
import EncoderInven_Inspect from "./pages/EncoderPages/EncoderInven_Inspect.jsx";
import EncoderPAR_ICS1 from "./pages/EncoderPages/EncoderPAR_ICS1.jsx";
import EncoderInventoryReport from "./pages/EncoderPages/EncoderInventoryReport.jsx";
import EncoderProfile from "./pages/EncoderPages/EncoderProfile.jsx";
import UserPAR_ICS1 from "./pages/UserPages/UserPAR_ICS1.jsx";
import UserInventoryReport from "./pages/UserPages/UserInventoryReport.jsx";
import UserProfile from "./pages/UserPages/UserProfile.jsx";
import Notification from "./pages/Notification.jsx";
import PurchaseRequest from "./pages/PurchaseRequest.jsx";
import ApprovePR from "./pages/ApprovePR.jsx";
import ListPR from "./pages/ListPR.jsx";


function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect the default route to /login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Define routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/ppe-entry" element={<PPE_Entry />} />
        <Route path="/account-management" element={<AccountManagement />} />
        <Route path="/inven-inspect" element={<Inven_Inspect />} />
        <Route path="/inventory" element={<Inventory_report1 />} />
        <Route path="/manage-tables" element={<ManageTables />} />
        <Route path="/add-account" element={<AddAccount />} />
        <Route path="/par-ics" element={<PAR_ICS1 />} />
        <Route path="/home-encoder" element={<Home_encoder />} />
        <Route path="/home-user" element={<Home_user />} />
        <Route path="/par-ics2" element={<PAR_ICS2 />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/item-history" element={<Item_history />} />
        <Route path="/inspec-scanner" element={<Inspection_Scanner />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/encoder-ppeentry" element={<EncoderPPE_Entry />} />
        <Route path="/encoder-inveninspect" element={<EncoderInven_Inspect />} />
        <Route path="/encoder-parics1" element={<EncoderPAR_ICS1 />} />
        <Route path="/encoder-invreport" element={<EncoderInventoryReport />} />
        <Route path="/encoder-profile" element={<EncoderProfile />} />
        <Route path="/user-parics1" element={<UserPAR_ICS1 />} />
        <Route path="/user-invreport" element={<UserInventoryReport />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/purchase-request" element={<PurchaseRequest />} />
        <Route path="/approve-pr" element={<ApprovePR />} />
        <Route path="/list-pr" element={<ListPR />} />
      </Routes>
    </Router>
  );
}

export default App;
