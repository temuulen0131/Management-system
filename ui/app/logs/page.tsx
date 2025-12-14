"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Sidebar } from "@/components/sidebar"
import { useTaskStore } from "@/lib/task-store-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Search } from "lucide-react"

export default function LogsPage() {
  const { taskHistory, tasks } = useTaskStore()
  const [searchQuery, setSearchQuery] = useState("")

  // Sort history by most recent first
  const sortedHistory = [...taskHistory].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  // Filter by search query
  const filteredHistory = sortedHistory.filter((entry) => {
    const task = tasks.find((t) => t.id === entry.taskId)
    const searchLower = searchQuery.toLowerCase()
    return (
      entry.details.toLowerCase().includes(searchLower) ||
      entry.userName.toLowerCase().includes(searchLower) ||
      task?.title.toLowerCase().includes(searchLower)
    )
  })

  const actionColors: Record<string, string> = {
    created: "bg-blue-100 text-blue-700",
    assigned: "bg-purple-100 text-purple-700",
    status_changed: "bg-orange-100 text-orange-700",
    priority_changed: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
  }

  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Үйл ажиллагааны бүртгэл</h1>
              <p className="text-muted-foreground">Бүх даалгаврын өөрчлөлт, үйл ажиллагааны бүрэн түүх</p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Хүсэлт, хэрэглэгч эсвэл дэлгэрэнгүйгээр хайх..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Үйл ажиллагааны цаг хугацааны хуваарь</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredHistory.length === 0 ? (
                  <div className="flex min-h-[200px] items-center justify-center">
                    <p className="text-muted-foreground">Үйл ажиллагааны бүртгэл олдсонгүй</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Цаг</TableHead>
                        <TableHead>Хүсэлт</TableHead>
                        <TableHead>Хэрэглэгч</TableHead>
                        <TableHead>Үйлдэл</TableHead>
                        <TableHead>Дэлгэрэнгүй</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredHistory.map((entry) => {
                        const task = tasks.find((t) => t.id === entry.taskId)
                        return (
                          <TableRow key={entry.id}>
                            <TableCell className="whitespace-nowrap text-sm">
                              {new Date(entry.createdAt).toLocaleString()}
                            </TableCell>
                            <TableCell className="font-medium">{task?.title || "Unknown Task"}</TableCell>
                            <TableCell>{entry.userName}</TableCell>
                            <TableCell>
                              <Badge
                                className={actionColors[entry.action] || "bg-gray-100 text-gray-700"}
                                variant="secondary"
                              >
                                {entry.action.replace(/_/g, " ")}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">{entry.details}</TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
