import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import PoolFocalDashboard from './pages/PoolFocalDashboard'; // 👈 የፑል ተቆጣጣሪ ገጽ
import YearlyAttendance from './pages/YearlyAttendance'; // 🟢 1. የዓመታዊ ክትትል ገጹን እዚህ Import አድርግ
import SupervisorReportsDashboard from './pages/SupervisorReportsDashboard'; // 🟢 3. አዲሱ የሱፐርቫይዘር ሪፖርት መቆጣጠሪያ ገጽ

import Home from "./pages/Home";

import About from "./pages/About";

import News from "./pages/News";

import Leadership from "./pages/Leadership";

import Services from "./pages/Services";

import TrackApplication from "./pages/TrackApplication";

import ResultChecker from "./pages/ResultChecker";

import StaffAvailability from "./pages/StaffAvailability";

import Contact from "./pages/Contact";

import ApplyService from "./pages/ApplyService";

import AdminDashboard from "./pages/AdminDashboard"; 

import IctNewsDashboard from "./pages/IctNewsDashboard"; 

import StaffRegistrarDashboard from "./pages/StaffRegistrarDashboard"; 

import Login from "./pages/Login"; // 👈 የሎጊን ገጽ Import ተደርጓል

import NotFound from "./pages/NotFound";



export default function App() {

  return (

    <Routes>

      {/* መደበኛ የዌብሳይቱ ገጾች ከ Layout (Navbar/Footer) ጋር */}

      <Route element={<Layout />}>

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/news" element={<News />} />

        <Route path="/leadership" element={<Leadership />} />

        <Route path="/services" element={<Services />} />

        <Route path="/services/apply" element={<ApplyService />} />

        <Route path="/track" element={<TrackApplication />} />

        <Route path="/results" element={<ResultChecker />} />

        <Route path="/staff" element={<StaffAvailability />} />

        <Route path="/contact" element={<Contact />} />

        {/* 🟢 የሎጊን ሮውት ከ Layout ጋር እንዲሆን እዚህ ተካቷል */}

        <Route path="/login" element={<Login />} />

      </Route>



      {/* የአድሚን ዳሽቦርድ ገጽ (ማመልከቻ እና ኮንታክት መቆጣጠሪያ) */}

      <Route path="/admin" element={<AdminDashboard />} />



      {/* የ ICT ባለሙያው ዜናዎች ብቻ የሚቆጣጠርበት ገጽ */}

      <Route path="/ict-news-admin" element={<IctNewsDashboard />} />



      {/* የሰራተኞች መመዝገቢያ እና ማስተዳደሪያ ገጽ (Staff Registrar) */}

      <Route path="/staff-registrar" element={<StaffRegistrarDashboard />} />



      {/* 🟢 የፑል ተቆጣጣሪ ዳሽቦርድ ሮውት */}

      <Route path="/pool-dashboard" element={<PoolFocalDashboard />} />

      
      {/* 🟢 የዓመታዊ መገኘት ክትትል ዳሽቦርድ ሮውት */}

      <Route path="/attendance-dashboard" element={<YearlyAttendance />} />

      {/* 🟢 የሶስቱን ፎካሎች (Comm, Civil, Admin) ሪፖርት በፓስዎርድ 123456 መቆጣጠሪያ ሮውት */}
      <Route path="/supervisor-reports" element={<SupervisorReportsDashboard />} />



      {/* የ 404 ስህተት ገጽ */}

      <Route path="*" element={<NotFound />} />

    </Routes>

  );

}