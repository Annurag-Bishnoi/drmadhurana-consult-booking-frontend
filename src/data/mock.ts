import doctorImg from "@/assets/dr-loverpreet.jpg";

export const doctor = {
  name: "Dr. Loverpreet Singh",
  specialty: "General & Laparoscopic Surgeon",
  experience: "15+ Years",
  qualification: "MBBS, MS (General Surgery), FMAS",
  rating: 4.9,
  reviews: 1284,
  patients: "10,000+",
  image: doctorImg,
  bio: "Dr. Loverpreet Singh is a board-certified general and laparoscopic surgeon with over 15 years of experience treating patients across India. He specializes in minimally invasive gastrointestinal procedures, hernia repair, and gallbladder surgery, and is known for a warm, patient-first approach.",
  education: [
    { degree: "MBBS", institute: "Government Medical College, Amritsar", year: "2005" },
    { degree: "MS General Surgery", institute: "PGIMER, Chandigarh", year: "2010" },
    { degree: "Fellowship in Minimal Access Surgery", institute: "World Laparoscopy Hospital, Delhi", year: "2012" },
  ],
  expertise: [
    "General Surgery",
    "Laparoscopic Surgery",
    "Gastrointestinal Surgery",
    "Hernia Treatment",
    "Gallbladder Surgery",
    "Post-operative Consultation",
  ],
  hospitals: ["Fortis Hospital, Mohali", "Max Super Speciality, Chandigarh", "Apollo Clinic, Amritsar"],
  awards: [
    "Best Laparoscopic Surgeon — Punjab Medical Excellence 2022",
    "Patient Choice Award 2021 (Practo)",
    "Young Surgeon of the Year — IMA 2016",
  ],
};

export type ConsultationType = "chat" | "voice" | "video";

export const consultationOptions: Record<ConsultationType, {
  id: ConsultationType;
  title: string;
  tagline: string;
  description: string;
  fee: number;
  duration: string;
  response: string;
}> = {
  chat: {
    id: "chat",
    title: "Chat Consultation",
    tagline: "Message the doctor securely",
    description: "Response-based secure medical conversation. Ideal for follow-ups, reports and small concerns.",
    fee: 499,
    duration: "24 hr window",
    response: "Reply within 30 mins",
  },
  voice: {
    id: "voice",
    title: "Voice Consultation",
    tagline: "Talk directly with the doctor",
    description: "Scheduled private voice call. Great when you want to explain symptoms in detail.",
    fee: 799,
    duration: "15 mins",
    response: "Scheduled slot",
  },
  video: {
    id: "video",
    title: "Video Consultation",
    tagline: "Face-to-face online visit",
    description: "Secure HD video appointment with visual examination and prescription.",
    fee: 1199,
    duration: "20 mins",
    response: "Scheduled slot",
  },
};

export const timeSlots = ["10:00 AM", "11:30 AM", "2:00 PM", "4:30 PM", "7:00 PM"];

export type AppointmentStatus = "upcoming" | "completed" | "cancelled" | "in-progress";

export interface Appointment {
  id: string;
  patientId: string;
  patient: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  type: ConsultationType;
  date: string;
  time: string;
  status: AppointmentStatus;
  reason: string;
  fee: number;
}

export const patients = [
  { id: "P-1001", name: "Rahul Sharma", age: 34, gender: "Male" as const, lastVisit: "2026-07-12", lastType: "video" as ConsultationType, status: "Active" },
  { id: "P-1002", name: "Priya Verma", age: 28, gender: "Female" as const, lastVisit: "2026-07-10", lastType: "chat" as ConsultationType, status: "Active" },
  { id: "P-1003", name: "Amit Patel", age: 45, gender: "Male" as const, lastVisit: "2026-07-08", lastType: "voice" as ConsultationType, status: "Follow-up" },
  { id: "P-1004", name: "Sneha Kapoor", age: 39, gender: "Female" as const, lastVisit: "2026-07-05", lastType: "video" as ConsultationType, status: "Active" },
  { id: "P-1005", name: "Vikram Singh", age: 52, gender: "Male" as const, lastVisit: "2026-06-30", lastType: "chat" as ConsultationType, status: "Discharged" },
  { id: "P-1006", name: "Ananya Iyer", age: 31, gender: "Female" as const, lastVisit: "2026-07-14", lastType: "video" as ConsultationType, status: "Active" },
  { id: "P-1007", name: "Rohit Mehta", age: 47, gender: "Male" as const, lastVisit: "2026-07-11", lastType: "voice" as ConsultationType, status: "Post-op" },
  { id: "P-1008", name: "Kavya Nair", age: 26, gender: "Female" as const, lastVisit: "2026-07-13", lastType: "chat" as ConsultationType, status: "Active" },
  { id: "P-1009", name: "Manish Gupta", age: 58, gender: "Male" as const, lastVisit: "2026-07-02", lastType: "video" as ConsultationType, status: "Follow-up" },
  { id: "P-1010", name: "Ishita Rao", age: 22, gender: "Female" as const, lastVisit: "2026-07-15", lastType: "chat" as ConsultationType, status: "Active" },
];

export const appointments: Appointment[] = [
  { id: "CONS-1024", patientId: "P-1001", patient: "Rahul Sharma", age: 34, gender: "Male", type: "chat", date: "2026-07-18", time: "10:00 AM", status: "in-progress", reason: "Abdominal discomfort", fee: 499 },
  { id: "CONS-1025", patientId: "P-1006", patient: "Ananya Iyer", age: 31, gender: "Female", type: "video", date: "2026-07-18", time: "11:30 AM", status: "upcoming", reason: "Gallbladder review", fee: 1199 },
  { id: "CONS-1026", patientId: "P-1003", patient: "Amit Patel", age: 45, gender: "Male", type: "voice", date: "2026-07-18", time: "2:00 PM", status: "upcoming", reason: "Post-op follow-up", fee: 799 },
  { id: "CONS-1027", patientId: "P-1004", patient: "Sneha Kapoor", age: 39, gender: "Female", type: "video", date: "2026-07-18", time: "4:30 PM", status: "upcoming", reason: "Hernia consultation", fee: 1199 },
  { id: "CONS-1028", patientId: "P-1002", patient: "Priya Verma", age: 28, gender: "Female", type: "chat", date: "2026-07-19", time: "10:00 AM", status: "upcoming", reason: "Report review", fee: 499 },
  { id: "CONS-1029", patientId: "P-1010", patient: "Ishita Rao", age: 22, gender: "Female", type: "video", date: "2026-07-19", time: "11:30 AM", status: "upcoming", reason: "Second opinion", fee: 1199 },
  { id: "CONS-1030", patientId: "P-1007", patient: "Rohit Mehta", age: 47, gender: "Male", type: "voice", date: "2026-07-19", time: "7:00 PM", status: "upcoming", reason: "Stitch removal advice", fee: 799 },
  { id: "CONS-1031", patientId: "P-1008", patient: "Kavya Nair", age: 26, gender: "Female", type: "chat", date: "2026-07-20", time: "2:00 PM", status: "upcoming", reason: "Acidity concern", fee: 499 },
  { id: "CONS-1015", patientId: "P-1005", patient: "Vikram Singh", age: 52, gender: "Male", type: "chat", date: "2026-07-15", time: "10:00 AM", status: "completed", reason: "Diet advice", fee: 499 },
  { id: "CONS-1016", patientId: "P-1009", patient: "Manish Gupta", age: 58, gender: "Male", type: "video", date: "2026-07-14", time: "11:30 AM", status: "completed", reason: "Post-op review", fee: 1199 },
  { id: "CONS-1017", patientId: "P-1001", patient: "Rahul Sharma", age: 34, gender: "Male", type: "video", date: "2026-07-12", time: "4:30 PM", status: "completed", reason: "Initial consultation", fee: 1199 },
  { id: "CONS-1018", patientId: "P-1002", patient: "Priya Verma", age: 28, gender: "Female", type: "chat", date: "2026-07-10", time: "7:00 PM", status: "completed", reason: "Report review", fee: 499 },
  { id: "CONS-1019", patientId: "P-1003", patient: "Amit Patel", age: 45, gender: "Male", type: "voice", date: "2026-07-08", time: "2:00 PM", status: "completed", reason: "Follow-up", fee: 799 },
  { id: "CONS-1020", patientId: "P-1004", patient: "Sneha Kapoor", age: 39, gender: "Female", type: "video", date: "2026-07-05", time: "10:00 AM", status: "completed", reason: "Hernia consult", fee: 1199 },
  { id: "CONS-1021", patientId: "P-1006", patient: "Ananya Iyer", age: 31, gender: "Female", type: "video", date: "2026-07-03", time: "11:30 AM", status: "completed", reason: "Second opinion", fee: 1199 },
  { id: "CONS-1022", patientId: "P-1007", patient: "Rohit Mehta", age: 47, gender: "Male", type: "voice", date: "2026-07-01", time: "4:30 PM", status: "completed", reason: "Pre-op consult", fee: 799 },
  { id: "CONS-1023", patientId: "P-1008", patient: "Kavya Nair", age: 26, gender: "Female", type: "chat", date: "2026-06-28", time: "7:00 PM", status: "cancelled", reason: "Acidity", fee: 499 },
];

export interface ChatMessage {
  id: string;
  from: "doctor" | "patient";
  text: string;
  time: string;
}

export const chatThreads: Record<string, { patient: string; consultationId: string; lastSeen: string; unread: number; messages: ChatMessage[] }> = {
  "P-1001": {
    patient: "Rahul Sharma",
    consultationId: "CONS-1024",
    lastSeen: "Just now",
    unread: 2,
    messages: [
      { id: "m1", from: "doctor", text: "Hello Rahul, how can I help you today?", time: "10:02 AM" },
      { id: "m2", from: "patient", text: "I've been experiencing abdominal discomfort for the past few days.", time: "10:03 AM" },
      { id: "m3", from: "doctor", text: "Please describe the location and severity of the pain (1–10).", time: "10:04 AM" },
      { id: "m4", from: "patient", text: "Upper right side, dull ache, about 6/10 after meals.", time: "10:05 AM" },
      { id: "m5", from: "doctor", text: "Any nausea, fever, or vomiting? Have you had a recent ultrasound?", time: "10:06 AM" },
    ],
  },
  "P-1002": {
    patient: "Priya Verma",
    consultationId: "CONS-1028",
    lastSeen: "12 min ago",
    unread: 0,
    messages: [
      { id: "m1", from: "patient", text: "Doctor, sharing my latest blood report.", time: "Yesterday" },
      { id: "m2", from: "doctor", text: "Received. Values look normal, we'll discuss tomorrow.", time: "Yesterday" },
    ],
  },
  "P-1006": {
    patient: "Ananya Iyer",
    consultationId: "CONS-1025",
    lastSeen: "1 hr ago",
    unread: 1,
    messages: [
      { id: "m1", from: "patient", text: "Should I fast before the video call?", time: "9:15 AM" },
      { id: "m2", from: "doctor", text: "No fasting needed. Keep your reports handy.", time: "9:20 AM" },
    ],
  },
  "P-1008": {
    patient: "Kavya Nair",
    consultationId: "CONS-1031",
    lastSeen: "3 hr ago",
    unread: 0,
    messages: [
      { id: "m1", from: "patient", text: "Feeling much better after the medicines. Thank you!", time: "Mon" },
      { id: "m2", from: "doctor", text: "Glad to hear. Continue for another 5 days.", time: "Mon" },
    ],
  },
};

export const earnings = {
  today: 5895,
  week: 42380,
  month: 184500,
  monthly: [
    { month: "Jan", value: 145000 },
    { month: "Feb", value: 158000 },
    { month: "Mar", value: 162000 },
    { month: "Apr", value: 171000 },
    { month: "May", value: 176000 },
    { month: "Jun", value: 180000 },
    { month: "Jul", value: 184500 },
  ],
  breakdown: [
    { type: "Chat", value: 42000 },
    { type: "Voice", value: 58500 },
    { type: "Video", value: 84000 },
  ],
};

export const patientProfile = {
  id: "P-1001",
  name: "Rahul Sharma",
  email: "rahul.sharma@example.com",
  phone: "+91 98123 45678",
  age: 34,
  gender: "Male",
  city: "Chandigarh",
};

export const consultationTypeLabel = (t: ConsultationType) =>
  t === "chat" ? "Chat" : t === "voice" ? "Voice Call" : "Video Call";
