"use client"

import { Fragment, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Sidebar } from "@/components/sidebar"
import { useTaskStore } from "@/lib/task-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TaskTimeline } from "@/components/task-timeline"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight } from "lucide-react"

// Mock client data
const MOCK_CLIENTS = [
  { id: "3", name: "Mike Client", email: "mike@company.com" },
  { id: "6", name: "Lisa Business", email: "lisa@business.com" },
]

export default function ClientsPage() {
  const { tasks, getTasksByClient, getTaskHistory } = useTaskStore()
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const toggleRow = (taskId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId)
    } else {
      newExpanded.add(taskId)
    }
    setExpandedRows(newExpanded)
  }

  const priorityColors = {
    low: "bg-gray-100 text-gray-700",
    medium: "bg-blue-100 text-blue-700",
    high: "bg-orange-100 text-orange-700",
    urgent: "bg-red-100 text-red-700",
  }

  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Харилцагчийн хүсэлт</h1>
              <p className="text-muted-foreground">Харилцагчийн гаргасан хүсэлтийн дэлгэрэнгүй мэдээлэл</p>
            </div>

            {MOCK_CLIENTS.map((client) => {
              const clientTasks = getTasksByClient(client.id)

              if (clientTasks.length === 0) return null

              return (
                <Card key={client.id}>
                  <CardHeader>
                    <CardTitle>{client.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{client.email}</p>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12"></TableHead>
                          <TableHead>Хүсэлтийн гарчиг</TableHead>
                          <TableHead>Хариуцаж авсан ажилтан</TableHead>
                          <TableHead>Төлөв</TableHead>
                          <TableHead>Эрэмбэ</TableHead>
                          <TableHead>Үүссэн он</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clientTasks.map((task) => {
                          const isExpanded = expandedRows.has(task.id)
                          const history = getTaskHistory(task.id)

                          return (
                            <Fragment key={task.id}>
                              <TableRow className="cursor-pointer hover:bg-muted/50">
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleRow(task.id)}
                                    className="h-8 w-8 p-0"
                                  >
                                    {isExpanded ? (
                                      <ChevronDown className="h-4 w-4" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4" />
                                    )}
                                  </Button>
                                </TableCell>
                                <TableCell className="font-medium">{task.title}</TableCell>
                                <TableCell>{task.assignedToName || "Unassigned"}</TableCell>
                                <TableCell>
                                  <TaskTimeline task={task} history={history} />
                                </TableCell>
                                <TableCell>
                                  <Badge className={priorityColors[task.priority]} variant="secondary">
                                    {task.priority}
                                  </Badge>
                                </TableCell>
                                <TableCell>{new Date(task.createdAt).toLocaleDateString()}</TableCell>
                              </TableRow>
                              {isExpanded && (
                                <TableRow>
                                  <TableCell colSpan={6} className="bg-muted/20">
                                    <div className="space-y-4 p-4">
                                      <div>
                                        <h4 className="font-semibold mb-1">Description</h4>
                                        <p className="text-sm text-muted-foreground">{task.description}</p>
                                      </div>
                                      <div>
                                        <h4 className="font-semibold mb-2">Хүсэлтийн түүх</h4>
                                        <div className="space-y-2">
                                          {history.length > 0 ? (
                                            history.map((entry) => (
                                              <div
                                                key={entry.id}
                                                className="flex items-start gap-2 text-sm border-l-2 border-primary pl-3"
                                              >
                                                <div className="flex-1">
                                                  <p className="font-medium">{entry.details}</p>
                                                  <p className="text-xs text-muted-foreground">
                                                    {entry.userName} • {new Date(entry.createdAt).toLocaleString()}
                                                  </p>
                                                </div>
                                              </div>
                                            ))
                                          ) : (
                                            <p className="text-sm text-muted-foreground">Хоосон</p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </Fragment>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
