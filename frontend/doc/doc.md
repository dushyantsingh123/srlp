📁 Frontend Documentation
🎨 SRLP Frontend Documentation
📌 Project Overview

Frontend is built using:

React (Vite)
TypeScript
Axios
React Router
React Query (TanStack)
⚙️ Setup
1. Create Project
npm create vite@latest frontend
2. Install Dependencies
npm install
npm install axios react-router-dom @tanstack/react-query
🧱 Project Structure
frontend/
 ├── src/
 │   ├── api/
 │   ├── pages/
 │   ├── components/
 │   ├── routes/
 │   ├── App.tsx
 │   └── main.tsx
🌐 API Integration
Axios Setup

Create file:

src/api/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export default api;
🔐 Auth Flow (Frontend)
Register Page
Input:
Company Name
Email
Password
API Call:
POST /api/auth/register
🔄 Data Fetching (React Query)
useMutation({
  mutationFn: registerUser,
});
🧠 Why React Query?
Caching API data
Auto refetch
Better state handling than manual useState
🧭 Routing
<BrowserRouter>
  <Routes>
    <Route path="/register" element={<Register />} />
  </Routes>
</BrowserRouter>
🚀 Run Frontend
npm run dev
🔗 Backend Connection
Backend runs on: http://localhost:5000
Frontend connects via Axios
🧠 Key Concepts
Concept	Explanation
Axios	API calls
React Query	Server state management
Router	Navigation
Components	UI structure
🚀 Next Steps
Login Page
JWT storage (localStorage)
Protected routes
Dashboard UI