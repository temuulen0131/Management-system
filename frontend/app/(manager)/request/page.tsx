"use client";

import { useState } from "react";

const requests = [
  { id: 1, title: "Website error", client: "Client A" },
  { id: 2, title: "System slow", client: "Client B" },
];

const staffList = ["Bataa", "Anu", "Temuulen"];

export default function ManagerRequestsPage() {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [staff, setStaff] = useState("");

  const assignTask = async () => {
    // API call later
    alert(
      `Request "${selectedRequest.title}" assigned to ${staff}`
    );
    setSelectedRequest(null);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Ирж буй хүсэлтүүд</h2>

      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="p-3">Мэдээлэл</th>
            <th className="p-3">Хэрэглэгч</th>
            <th className="p-3">Хувиарлах</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-3">{r.title}</td>
              <td className="p-3">{r.client}</td>
              <td className="p-3">
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={() => setSelectedRequest(r)}
                >
                  Хувиарлах
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Assign Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="font-semibold mb-3">Даалгавар хувиарлах</h3>

            <p className="mb-2">
              <strong>Хүсэлт:</strong> {selectedRequest.title}
            </p>

            <select
              className="w-full border p-2 mb-3"
              onChange={(e) => setStaff(e.target.value)}
            >
              <option value="">Ажилтан сонгох</option>
              {staffList.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            <textarea
              placeholder="Reminder / Note"
              className="w-full border p-2 mb-3"
            />

            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1"
                onClick={() => setSelectedRequest(null)}
              >
                Болих
              </button>
              <button
                className="bg-green-600 text-white px-3 py-1 rounded"
                onClick={assignTask}
                disabled={!staff}
              >
                Даалгавар үүсгэх
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
