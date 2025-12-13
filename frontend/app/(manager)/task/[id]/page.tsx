interface TaskDetailProps {
  params: {
    id: string;
  };
}

export default function TaskDetailPage({ params }: TaskDetailProps) {
  const { id } = params;

  // Fake data (дараа backend-оос татна)
  const task = {
    title: "Fix UI bug",
    reminder: "Finish before Friday",
    checklist: [
      { id: 1, text: "Analyze issue", done: true },
      { id: 2, text: "Fix problem", done: false },
      { id: 3, text: "Test solution", done: false },
    ],
    logs: [
      "Task created",
      "Assigned to Staff A",
      "Checklist item 1 completed",
    ],
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        Даалгаврын дэлгэрэнгүй (ID: {id})
      </h2>

      {/* Reminder */}
      <div className="bg-yellow-100 p-4 rounded mb-4">
        <strong>Сануулах:</strong> {task.reminder}
      </div>

      {/* Checklist */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h3 className="font-semibold mb-2">Шалгах жагсаалт</h3>
        {task.checklist.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <input type="checkbox" checked={item.done} readOnly />
            <span className={item.done ? "line-through" : ""}>
              {item.text}
            </span>
          </div>
        ))}
      </div>

      {/* Logs */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Үйл ажиллагааны түүх</h3>
        <ul className="list-disc ml-5 text-sm text-gray-600">
          {task.logs.map((log, i) => (
            <li key={i}>{log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
