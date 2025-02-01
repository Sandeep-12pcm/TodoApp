import Calendar from "react-calendar";

const CalendarView = ({ selectedDate, setSelectedDate, tasks }) => {
  const hasReminder = (date) => {
    return tasks.some(
      (task) => task.reminder && new Date(task.reminder).toDateString() === date.toDateString()
    );
  };

  return (
    <div className="w-1/3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-2xl">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Calendar</h2>
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileClassName={({ date }) =>
          hasReminder(date) ? "bg-green-300 dark:bg-green-600 rounded-full" : ""
        }
      />
    </div>
  );
};

export default CalendarView;
