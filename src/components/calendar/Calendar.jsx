import { useState } from "react";
import CalendarGrid from "./CalendarGrid";
import CalendarHeader from "./CalendarHeader";

export default function Calendar({ disabledDates = [], onSelectDate }) {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const generateDays = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];

    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    return days;
  };

  const days = generateDays(currentYear, currentMonth);

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

  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  const handleDateClick = (date) => {
    const dateStr = date.toISOString().split("T")[0];

    if (!checkIn) {
      setCheckIn(dateStr);
      onSelectDate(dateStr);
      return;
    }

    if (checkIn && !checkOut && dateStr > checkIn) {
      setCheckOut(dateStr);
      onSelectDate({ checkIn, checkOut: dateStr });
      return;
    }

    setCheckIn(dateStr);
    setCheckOut(null);
    onSelectDate(dateStr);
  };

  return (
    <>
      <CalendarHeader
        month={currentMonth}
        year={currentYear}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />

      <CalendarGrid
        days={days}
        disabledDates={disabledDates}
        checkIn={checkIn}
        checkOut={checkOut}
        onDateClick={handleDateClick}
      />
    </>
  );
}
