export const news = [
  {
    id: 1,
    category: "Public Notice",
    date: "August 18, 2026",
    title: "Digital Service Portal Now Available",
    excerpt: "Citizens can submit selected service requests online and track progress using a unique tracking ID."
  },
  {
    id: 2,
    category: "Administration",
    date: "August 12, 2026",
    title: "Citizen Service Desk Working Hours",
    excerpt: "The district service desk is available during official working hours for digital and in-person support."
  },
  {
    id: 3,
    category: "Education",
    date: "August 08, 2026",
    title: "Result Verification Service",
    excerpt: "Registered candidates can verify selected examination and educational results through the public result checker."
  }
];

export const leaders = [
  { name: "Mr. Abebe Tadesse", role: "Wereda Administrator", initials: "AT", bio: "Responsible for district administration, public service coordination and strategic delivery." },
  { name: "Ms. Marta Kebede", role: "Head of Human Resources", initials: "MK", bio: "Leads civil-service personnel administration, attendance and performance management." },
  { name: "Mr. Dawit Alemu", role: "Head of Citizen Services", initials: "DA", bio: "Coordinates citizen-facing services and digital application workflows." }
];

export const services = [
  { id: "residency", icon: "Home", title: "Residency Certificate", description: "Request an official residency certificate without visiting multiple service desks.", requirements: ["Valid identification", "Kebele information", "Active phone number"] },
  { id: "support", icon: "FileText", title: "Official Support Letter", description: "Submit a request for an official support or confirmation letter.", requirements: ["Valid identification", "Request reason", "Supporting document where applicable"] },
  { id: "tracking", icon: "Search", title: "Application Tracking", description: "Check the current status and officer remarks of an existing request.", requirements: ["Unique tracking ID"] },
  { id: "result", icon: "GraduationCap", title: "Result Checker", description: "Verify published examination or educational results using a registration number.", requirements: ["Registration number"] }
];

export const staff = [
  { name: "Abebe Tadesse", department: "Citizen Services", position: "Desk Officer", status: "On Duty", phone: "+251 900 000 001" },
  { name: "Marta Kebede", department: "Human Resources", position: "HR Manager", status: "On Duty", phone: "+251 911 111 111" },
  { name: "Dawit Alemu", department: "Education", position: "Education Officer", status: "On Leave", phone: "+251 922 222 222" },
  { name: "Selamawit Bekele", department: "Administration", position: "Records Officer", status: "On Duty", phone: "+251 933 333 333" }
];