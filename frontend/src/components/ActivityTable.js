import React from 'react';

const ActivityTable = () => {
  const activities = [
    { id: 1, user: 'John Doe', event: 'Music Festival', status: 'Confirmed', date: '2023-10-25' },
    { id: 2, user: 'Jane Smith', event: 'Tech Conference', status: 'Pending', date: '2023-10-26' },
    { id: 3, user: 'Mike Brown', event: 'Art Workshop', status: 'Confirmed', date: '2023-10-27' },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">User</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {activities.map((activity) => (
            <tr key={activity.id}>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{activity.user}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{activity.event}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activity.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {activity.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityTable;
