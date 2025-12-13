import Link from "next/link";

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-4">
        <h1 className="text-xl font-bold mb-6">Менежерийн харилцах хэсэг</h1>
        <nav className="space-y-3 flex flex-col bg-gray-800 p-3 rounded">
          <Link href="/dashboard">Дүн шинжилгээ</Link>
          <Link href="/request">Хүсэлтүүд</Link>
          <Link href="/task">Даалгаврууд</Link>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 bg-gray-200 text-black">{children}</main>
    </div>
  );
}
