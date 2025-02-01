import React from 'react'

const UpNextTasks = ({ tasks }) => {
    const upcomingTasks = tasks.filter((task) => task.reminder && new Date(task.reminder) > new Date());

    return (
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mt-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">📅 Up-Next</h2>
            <ul>
                {upcomingTasks.length > 0 ? (
                    upcomingTasks.map((task) => (
                        <li key={task.id} className="p-3 border-b hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg">
                            <span className="text-lg font-medium">{task.text}</span>
                            <span className="text-gray-500 text-sm ml-2">({new Date(task.reminder).toLocaleString()})</span>
                        </li>
                    ))
                ) : (
                    <p className="text-gray-500">No upcoming reminders.</p>
                )}
            </ul>
        </div>
    );
};
export default UpNextTasks