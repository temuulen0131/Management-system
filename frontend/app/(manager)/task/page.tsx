import Link from "next/link";

const tasks = [
  { id: "1", title: "Fix UI bug", status: "IN_PROGRESS" },
  { id: "2", title: "Database setup", status: "DONE" },
];

export default function TaskListPage() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Даалгаврууд</h2>

      <div className="space-y-3">
        {tasks.map((task) => (
          <Link
            key={task.id}
            href={`/task/${task.id}`}
            className="block bg-white p-4 rounded shadow hover:bg-gray-50"
          >
            <div className="flex justify-between">
              <span className="font-semibold">{task.title}</span>
              <span className="text-sm text-gray-500">{task.status}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
