import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";

const localizer = momentLocalizer(moment);

function Calendar() {
  return (
    <div className="dashboard">
      <Navbar onLogout={async () => {}} userEmail="" />

      <section className="hero">
        <h1>📅 Calendar</h1>
        <p>View and manage your schedule.</p>
      </section>

      <div className="calendar-container">
        <BigCalendar
          localizer={localizer}
          events={[]}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
        />
      </div>
    </div>
  );
}

export default Calendar;
