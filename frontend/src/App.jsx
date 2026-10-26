import { Routes, Route } from "react-router-dom";
import TopBar from "./components/TopBar.jsx";
import EventList from "./pages/EventList.jsx";
import ManageEvent from "./pages/ManageEvent.jsx";

export default function App() {
  return (
    <>
      <TopBar />
      <main className="shell">
        <Routes>
          <Route path="/" element={<EventList />} />
          <Route path="/add" element={<ManageEvent />} />
          <Route path="/edit/:id" element={<ManageEvent />} />
        </Routes>
      </main>
    </>
  );
}
