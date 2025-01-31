import React from 'react'
import Calendar from "react-calendar";
import "./CalendarStyle.css"

const CalendarView = ({ selectedDate, setSelectedDate }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-1/3">
    <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">📅 Calendar</h2>
    <Calendar
      onChange={setSelectedDate}
      value={selectedDate}
      className="custom-calendar"
    />
  </div>
);
export default CalendarView