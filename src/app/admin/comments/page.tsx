"use client";

const mockComments = [
  { id: 1, anime: "Attack on Titan", user: "OtakuQueen", content: "This episode was amazing!", date: "2024-07-16", status: "active" },
  { id: 2, anime: "Demon Slayer", user: "AnimeFan123", content: "Animation quality is top notch.", date: "2024-07-15", status: "pinned" },
  { id: 3, anime: "Jujutsu Kaisen", user: "MangaMaster", content: "Can't wait for the next season!", date: "2024-07-14", status: "hidden" },
];

export default function AdminCommentsPage() {
  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Comment Moderation</h2>
        <div className="flex gap-2">
          <select className="px-2 py-1 rounded bg-gray-800 text-white border border-gray-700 text-sm">
            <option>Anime: All</option>
            <option>Attack on Titan</option>
            <option>Demon Slayer</option>
            <option>Jujutsu Kaisen</option>
          </select>
          <select className="px-2 py-1 rounded bg-gray-800 text-white border border-gray-700 text-sm">
            <option>User: All</option>
            <option>OtakuQueen</option>
            <option>AnimeFan123</option>
            <option>MangaMaster</option>
          </select>
          <select className="px-2 py-1 rounded bg-gray-800 text-white border border-gray-700 text-sm">
            <option>Status: All</option>
            <option>Active</option>
            <option>Pinned</option>
            <option>Hidden</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 rounded-xl overflow-hidden text-left text-sm md:text-base">
          <thead className="bg-gray-800 text-gray-200">
            <tr>
              <th className="p-3">Anime</th>
              <th className="p-3">User</th>
              <th className="p-3">Content</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockComments.map((c) => (
              <tr key={c.id} className="border-b border-gray-800 hover:bg-gray-800/60 transition-colors">
                <td className="p-3 font-semibold text-white">{c.anime}</td>
                <td className="p-3">{c.user}</td>
                <td className="p-3 max-w-[200px] truncate">{c.content}</td>
                <td className="p-3">{c.date}</td>
                <td className="p-3 capitalize">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${c.status === "active" ? "bg-green-700 text-green-200" : c.status === "pinned" ? "bg-blue-700 text-blue-200" : "bg-yellow-700 text-yellow-200"}`}>{c.status}</span>
                </td>
                <td className="p-3 flex gap-2 flex-wrap">
                  <button className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs">Edit</button>
                  <button className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs">Delete</button>
                  <button className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs">Pin</button>
                  <button className="px-2 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-xs">Hide</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Mobile card layout */}
        <div className="md:hidden flex flex-col gap-4 mt-4">
          {mockComments.map((c) => (
            <div key={c.id} className="bg-gray-900 rounded-xl p-4 flex flex-col gap-2 shadow">
              <div className="font-bold text-white text-lg">{c.anime}</div>
              <div className="text-gray-400 text-xs mb-1">User: {c.user}</div>
              <div className="text-gray-400 text-xs mb-1">{c.content}</div>
              <div className="text-gray-400 text-xs mb-1">{c.date}</div>
              <div className="flex gap-2 text-xs mb-1">
                <span className={`capitalize px-2 py-1 rounded font-bold ${c.status === "active" ? "bg-green-700 text-green-200" : c.status === "pinned" ? "bg-blue-700 text-blue-200" : "bg-yellow-700 text-yellow-200"}`}>{c.status}</span>
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                <button className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs">Edit</button>
                <button className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs">Delete</button>
                <button className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs">Pin</button>
                <button className="px-2 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-xs">Hide</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 