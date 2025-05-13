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
import Home_1 from "./pages/Home_1.jsx";
import Department from "./pages/Department.jsx";
import PurchaseList from "./pages/PurchaseList.jsx";
import PurchaseListView from "./pages/PurchaseListView.jsx";
import Inspection from "./pages/Inspection.jsx";
import DH_Home_1 from "./pages/DH_Home_1.jsx";
import DH_PurchaseRequest from "./pages/DeptHeadPages/DH_PurchaseRequest.jsx";
import DH_PurchaseList from "./pages/DeptHeadPages/DH_PurchaseList.jsx";
import DH_PurchaseListView from "./pages/DeptHeadPages/DH_PurchaseListView.jsx";
import DH_PAR_ICS1 from "./pages/DeptHeadPages/DH_PAR_ICS1.jsx";
import DH_InventoryReport from "./pages/DeptHeadPages/DH_InventoryReport.jsx";
import DH_Inspection from "./pages/DeptHeadPages/DH_Inspection.jsx";
import DH_Notification from "./pages/DeptHeadPages/DH_Notification.jsx";
import DH_Profile from "./pages/DeptHeadPages/DH_Profile.jsx";
import CTN_Home_1 from "./pages/CTN_Home_1.jsx";
import CTN_PurchaseRequest from "./pages/CTN_PurchaseRequest.jsx";
import CTN_PurchaseList from "./pages/CTN_PurchaseList.jsx";
import CTN_PurchaseListView from "./pages/CTN_PurchaseListView.jsx";
import CTN_PAR_ICS1 from "./pages/CTN_PAR_ICS1.jsx";
import CTN_InventoryReport from "./pages/CTN_InventoryReport.jsx";
import CTN_Notification from "./pages/CTN_Notification.jsx";
import CTN_Profile from "./pages/CTN_Profile.jsx";



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
        <Route path="/home-1" element={<Home_1 />} />
        <Route path="/department" element={<Department />} />
        <Route path="/purchase-list" element={<PurchaseList />} />
        <Route path="/purchase-list-view/:requestId" element={<PurchaseListView />} />
        <Route path="/inspection" element={<Inspection />} />
        <Route path="/dh-home-1" element={<DH_Home_1 />} />
        <Route path="/dh-purchase-request" element={<DH_PurchaseRequest />} />
        <Route path="/dh-purchase-list" element={<DH_PurchaseList />} />
        <Route path="/dh-purchase-list-view/:requestId" element={<DH_PurchaseListView />} />
        <Route path="/dh-parics1" element={<DH_PAR_ICS1 />} />
        <Route path="/dh-inventory" element={<DH_InventoryReport />} />
        <Route path="/dh-notification" element={<DH_Notification />} />
        <Route path="/dh-profile" element={<DH_Profile />} />
        <Route path="/dh-inspection" element={<DH_Inspection />} />
        <Route path="/ctn-home-1" element={<CTN_Home_1 />} />
        <Route path="/ctn-purchase-request" element={<CTN_PurchaseRequest />} />
        <Route path="/ctn-purchase-list" element={<CTN_PurchaseList />} />
        <Route path="/ctn-purchase-list-view/:requestId" element={<CTN_PurchaseListView />} />
        <Route path="/ctn-parics1" element={<CTN_PAR_ICS1 />} />
        <Route path="/ctn-inventory" element={<CTN_InventoryReport />} />
        <Route path="/ctn-notification" element={<CTN_Notification />} />
        <Route path="/ctn-profile" element={<CTN_Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
