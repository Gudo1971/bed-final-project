import { useState } from "react";

export default function Calendar({ disabledDates = [], onSelectDate }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysOfWeek = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const jsDay = new Date(currentYear, currentMonth, 1).getDay();
const firstDay = jsDay === 0 ? 6 : jsDay - 1; 


  const formatDate = (y, m, d) => {
  const month = String(m + 1).padStart(2, "0");
  const day = String(d).padStart(2, "0");
  return `${y}-${month}-${day}`;
};


  const isDisabled = (dateString) => disabledDates.includes(dateString);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>{"<"}</button>
        <h3>
          {currentYear} - {currentMonth + 1}
        </h3>
        <button onClick={handleNextMonth}>{">"}</button>
      </div>

      <div className="calendar-grid">
        {daysOfWeek.map((d) => (
          <div key={d} className="calendar-day-header">
            {d}
          </div>
        ))}

        {[...Array(firstDay === 0 ? 6 : firstDay - 1)].map((_, i) => (
          <div key={"empty-" + i} className="calendar-empty"></div>
        ))}

        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const dateString = formatDate(currentYear, currentMonth, day);
          const disabled = isDisabled(dateString);

          return (
            <div
              key={day}
              className={`calendar-day ${disabled ? "disabled" : ""}`}
              onClick={() => !disabled && onSelectDate && onSelectDate(dateString)}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
