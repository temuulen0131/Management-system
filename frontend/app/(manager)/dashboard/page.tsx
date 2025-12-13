export default function ManagerDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Дүн шинжилгээ</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Шинэ хүсэлтүүд</p>
          <p className="text-2xl font-bold">5</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Идэвхтэй даалгаврууд</p>
          <p className="text-2xl font-bold">8</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Дууссан</p>
          <p className="text-2xl font-bold">12</p>
        </div>
      </div>
    </div>
  );
}
