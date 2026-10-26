import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addEvent, editEvent, fetchEventById } from "../eventApi.js";

const BLANK = { name: "", description: "", date: "", venue: "", totalRegistrations: 0 };
const MAX_DESC = 300;

export default function ManageEvent() {
  const { id } = useParams();
  const editing = Boolean(id);
  const go = useNavigate();
  const [values, setValues] = useState(BLANK);
  const [problem, setProblem] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!editing) {
      setValues(BLANK);
      return;
    }
    fetchEventById(id)
      .then((ev) =>
        setValues({
          name: ev.name,
          description: ev.description,
          date: ev.date.slice(0, 10),
          venue: ev.venue,
          totalRegistrations: ev.totalRegistrations,
        })
      )
      .catch((error) => setProblem(error.message));
  }, [id, editing]);

  const handleField = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const submitForm = async (e) => {
    e.preventDefault();
    setSending(true);
    setProblem("");
    try {
      if (editing) {
        await editEvent(id, { ...values, totalRegistrations: Number(values.totalRegistrations) });
      } else {
        const { totalRegistrations, ...newEvent } = values;
        await addEvent(newEvent);
      }
      go("/");
    } catch (error) {
      setProblem(error.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="panel sheet">
      <h1>{editing ? "Update event" : "Add a new event"}</h1>
      <p className="soft">
        {editing ? "Change whatever needs fixing, then save." : "Enter the details below to publish an event."}
      </p>

      {problem && <div className="warn">{problem}</div>}

      <form onSubmit={submitForm}>
        <label>
          Event Name
          <input name="name" value={values.name} onChange={handleField}
            placeholder="Annual Tech Symposium" required />
        </label>

        <label>
          Event Description
          <textarea name="description" rows="4" maxLength={MAX_DESC} value={values.description}
            onChange={handleField} placeholder="What is this event about?" required />
          <small className="counter">{values.description.length} / {MAX_DESC}</small>
        </label>

        <div className="pair">
          <label>
            Event Date
            <input type="date" name="date" value={values.date} onChange={handleField} required />
          </label>
          <label>
            Venue
            <input name="venue" value={values.venue} onChange={handleField}
              placeholder="Seminar Hall B" required />
          </label>
        </div>

        {editing && (
          <label>
            Total Registrations
            <input type="number" min="0" name="totalRegistrations"
              value={values.totalRegistrations} onChange={handleField} />
          </label>
        )}

        <div className="sheet-btns">
          <button type="button" className="btn plain" onClick={() => go("/")}>Cancel</button>
          <button type="submit" className="btn solid" disabled={sending}>
            {sending ? "Saving…" : editing ? "Save changes" : "Create event"}
          </button>
        </div>
      </form>
    </section>
  );
}
