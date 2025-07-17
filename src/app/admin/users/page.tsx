"use client";

const mockUsers = [
  {
    id: "1",
    username: "AnimeFan123",
    email: "animefan123@example.com",
    avatar: "https://i.pravatar.cc/100?img=1",
    joinDate: "2023-01-15",
  },
  {
    id: "2",
    username: "OtakuQueen",
    email: "otakuqueen@example.com",
    avatar: "https://i.pravatar.cc/100?img=2",
    joinDate: "2022-11-03",
  },
  {
    id: "3",
    username: "MangaMaster",
    email: "mangamaster@example.com",
    avatar: "https://i.pravatar.cc/100?img=3",
    joinDate: "2024-02-20",
  },
];

export default function AdminUsersPage() {
  return (
    <div className="max-w-3xl mx-auto w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">User Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 rounded-xl overflow-hidden text-left text-sm md:text-base">
          <thead className="bg-gray-800 text-gray-200">
            <tr>
              <th className="p-3">Avatar</th>
              <th className="p-3">Username</th>
              <th className="p-3">Email</th>
              <th className="p-3">Join Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((user) => (
              <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/60 transition-colors">
                <td className="p-3">
                  <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full object-cover" />
                </td>
                <td className="p-3 font-semibold text-white max-w-[120px] truncate">{user.username}</td>
                <td className="p-3 max-w-[180px] truncate">{user.email}</td>
                <td className="p-3">{new Date(user.joinDate).toLocaleDateString()}</td>
                <td className="p-3 flex gap-2">
                  <button className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs">Edit</button>
                  <button className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Mobile card layout */}
        <div className="md:hidden flex flex-col gap-4 mt-4">
          {mockUsers.map((user) => (
            <div key={user.id} className="bg-gray-900 rounded-xl p-4 flex gap-4 shadow">
              <img src={user.avatar} alt={user.username} className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
              <div className="flex-1 flex flex-col gap-1">
                <div className="font-bold text-white text-lg">{user.username}</div>
                <div className="text-gray-400 text-xs mb-1">{user.email}</div>
                <div className="text-gray-400 text-xs mb-1">Joined: {new Date(user.joinDate).toLocaleDateString()}</div>
                <div className="flex gap-2 mt-2">
                  <button className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs">Edit</button>
                  <button className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 