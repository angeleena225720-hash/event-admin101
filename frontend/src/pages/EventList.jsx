import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllEvents, removeEvent } from "../eventApi.js";

const prettyDate = (value) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  });

// an event counts as past once its day has fully ended
const hasEnded = (value) => {
  const day = new Date(value);
  day.setUTCHours(23, 59, 59, 999);
  return day < new Date();
};

const SORTERS = {
  dateAsc: (a, b) => new Date(a.date) - new Date(b.date),
  dateDesc: (a, b) => new Date(b.date) - new Date(a.date),
  name: (a, b) => a.name.localeCompare(b.name),
  signups: (a, b) => b.totalRegistrations - a.totalRegistrations,
};

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [busy, setBusy] = useState(true);
  const [problem, setProblem] = useState("");
  const [query, setQuery] = useState("");
  const [when, setWhen] = useState("all");
  const [sortKey, setSortKey] = useState("dateAsc");
  const [pending, setPending] = useState(null);
  const [notice, setNotice] = useState("");
  const go = useNavigate();

  const refresh = async () => {
    try {
      setEvents(await fetchAllEvents());
      setProblem("");
    } catch (error) {
      setProblem(error.message);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const flash = (text) => {
    setNotice(text);
    setTimeout(() => setNotice(""), 2500);
  };

  const confirmRemoval = async () => {
    try {
      await removeEvent(pending._id);
      setPending(null);
      flash("Event removed");
      refresh();
    } catch (error) {
      setPending(null);
      setProblem(error.message);
    }
  };

  const visible = useMemo(() => {
    const text = query.toLowerCase();
    return events
      .filter((ev) => `${ev.eventId} ${ev.name} ${ev.venue}`.toLowerCase().includes(text))
      .filter((ev) => when === "all" || (when === "past") === hasEnded(ev.date))
      .sort(SORTERS[sortKey]);
  }, [events, query, when, sortKey]);

  const signupTotal = events.reduce((sum, ev) => sum + (ev.totalRegistrations || 0), 0);
  const comingUp = events.filter((ev) => !hasEnded(ev.date)).length;

  return (
    <>
      <section className="heading">
        <div>
          <h1>Events overview</h1>
          <p className="soft">Everything you have scheduled, with sign-up counts.</p>
        </div>
        <button className="btn solid" onClick={() => go("/add")}>+ New event</button>
      </section>

      <section className="figures">
        <div className="figure"><span>Events</span><b>{events.length}</b></div>
        <div className="figure"><span>Coming up</span><b>{comingUp}</b></div>
        <div className="figure"><span>Sign-ups</span><b>{signupTotal}</b></div>
      </section>

      <section className="panel">
        <div className="toolbar">
          <input
            className="field-search"
            placeholder="Search by id, name or venue"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="chips">
            {["all", "upcoming", "past"].map((choice) => (
              <button
                key={choice}
                className={when === choice ? "chip chip-on" : "chip"}
                onClick={() => setWhen(choice)}
              >
                {choice}
              </button>
            ))}
          </div>
          <select className="sorter" value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
            <option value="dateAsc">Date: earliest first</option>
            <option value="dateDesc">Date: latest first</option>
            <option value="name">Name: A to Z</option>
            <option value="signups">Most sign-ups</option>
          </select>
        </div>

        {problem && <div className="warn">{problem}</div>}

        {busy ? (
          <p className="nothing">Fetching events…</p>
        ) : visible.length === 0 ? (
          <p className="nothing">No events to show here yet.</p>
        ) : (
          <table className="grid">
            <thead>
              <tr>
                <th>Event ID</th>
                <th>Event Name</th>
                <th>Event Date</th>
                <th>Venue</th>
                <th>Total Registrations</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((ev) => (
                <tr key={ev._id}>
                  <td data-label="ID"><span className="tag">{ev.eventId}</span></td>
                  <td data-label="Name" className="bold">{ev.name}</td>
                  <td data-label="Date">
                    {prettyDate(ev.date)}{" "}
                    <span className={hasEnded(ev.date) ? "state state-past" : "state state-soon"}>
                      {hasEnded(ev.date) ? "Past" : "Upcoming"}
                    </span>
                  </td>
                  <td data-label="Venue">{ev.venue}</td>
                  <td data-label="Sign-ups">{ev.totalRegistrations}</td>
                  <td data-label="Actions">
                    <div className="row-btns">
                      <button className="btn soft-blue" onClick={() => go(`/edit/${ev._id}`)}>Update</button>
                      <button className="btn soft-red" onClick={() => setPending(ev)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {pending && (
        <div className="backdrop" onClick={() => setPending(null)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Remove this event?</h3>
            <p>“{pending.name}” will be deleted permanently.</p>
            <div className="dialog-btns">
              <button className="btn plain" onClick={() => setPending(null)}>Keep it</button>
              <button className="btn soft-red" onClick={confirmRemoval}>Yes, delete</button>
            </div>
          </div>
        </div>
      )}

      {notice && <div className="snack">{notice}</div>}
    </>
  );
}
