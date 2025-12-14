"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Sidebar } from "@/components/sidebar"
import { useAuth } from "@/lib/auth-context"
import { useTaskStore } from "@/lib/task-store"
import { TaskCard } from "@/components/task-card"
import { TaskDialog } from "@/components/task-dialog"
import { TaskTimeline } from "@/components/task-timeline"
import type { Task, TaskStatus } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LayoutGrid, List } from "lucide-react"

const MOCK_EMPLOYEES = [
  { id: "2", name: "Sarah Employee" },
  { id: "4", name: "John Tech" },
  { id: "5", name: "Emma Support" },
]

export default function TasksPage() {
  const { user } = useAuth()
  const { tasks, getTasksByAssignee, getTasksByClient, getTaskHistory } = useTaskStore()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setDialogOpen(true)
  }

  const getFilteredTasks = () => {
    if (user?.role === "manager") {
      return tasks
    } else if (user?.role === "employee") {
      return getTasksByAssignee(user.id)
    } else if (user?.role === "client") {
      return getTasksByClient(user.id)
    }
    return []
  }

  const filteredTasks = getFilteredTasks()

  const getTasksByStatus = (status: TaskStatus) => {
    return filteredTasks.filter((task) => task.status === status)
  }

  const priorityColors = {
    low: "bg-gray-100 text-gray-700",
    medium: "bg-blue-100 text-blue-700",
    high: "bg-orange-100 text-orange-700",
    urgent: "bg-red-100 text-red-700",
  }

  const renderTaskGrid = (taskList: Task[]) => {
    if (taskList.length === 0) {
      return (
        <Card>
          <CardContent className="flex min-h-[200px] items-center justify-center">
            <p className="text-muted-foreground">Даалгавар олдсонгүй</p>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {taskList.map((task) => (
          <TaskCard key={task.id} task={task} onClick={() => handleTaskClick(task)} />
        ))}
      </div>
    )
  }

  const renderTaskTable = (taskList: Task[]) => {
    if (taskList.length === 0) {
      return (
        <Card>
          <CardContent className="flex min-h-[200px] items-center justify-center">
            <p className="text-muted-foreground">Даалгавар олдсонгүй</p>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Хүсэлт</TableHead>
                <TableHead>Хэрэглэгч</TableHead>
                <TableHead>Хуваарилагдсан Ажилтан</TableHead>
                <TableHead>Төлөвийн Хугацаа</TableHead>
                <TableHead>Чухал байдал</TableHead>
                <TableHead>Үүсгэсэн Огноо</TableHead>
                <TableHead>Үйлдлүүд</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taskList.map((task) => {
                const history = getTaskHistory(task.id)
                return (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>{task.clientName}</TableCell>
                    <TableCell>{task.assignedToName || "Unassigned"}</TableCell>
                    <TableCell>
                      <TaskTimeline task={task} history={history} />
                    </TableCell>
                    <TableCell>
                      <Badge className={priorityColors[task.priority]} variant="secondary">
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{new Date(task.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleTaskClick(task)}>
                        Үзэх
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Даалгаврууд</h1>
                <p className="text-muted-foreground">Даалгавруудыг үзэж, удирдах</p>
              </div>
              {user?.role === "manager" && (
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <LayoutGrid className="h-4 w-4 mr-2" />
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === "table" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                  >
                    <List className="h-4 w-4 mr-2" />
                    Table
                  </Button>
                </div>
              )}
            </div>

            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">Бүх</TabsTrigger>
                <TabsTrigger value="pending">Хүлээгдэж буй</TabsTrigger>
                <TabsTrigger value="in_progress">Идэвхтэй</TabsTrigger>
                <TabsTrigger value="in_review">Шалгаж буй</TabsTrigger>
                <TabsTrigger value="completed">Дууссан</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {user?.role === "manager" && viewMode === "table"
                  ? renderTaskTable(filteredTasks)
                  : renderTaskGrid(filteredTasks)}
              </TabsContent>

              <TabsContent value="pending" className="space-y-4">
                {user?.role === "manager" && viewMode === "table"
                  ? renderTaskTable(getTasksByStatus("pending"))
                  : renderTaskGrid(getTasksByStatus("pending"))}
              </TabsContent>

              <TabsContent value="in_progress" className="space-y-4">
                {user?.role === "manager" && viewMode === "table"
                  ? renderTaskTable(getTasksByStatus("in_progress"))
                  : renderTaskGrid(getTasksByStatus("in_progress"))}
              </TabsContent>

              <TabsContent value="in_review" className="space-y-4">
                {user?.role === "manager" && viewMode === "table"
                  ? renderTaskTable(getTasksByStatus("in_review"))
                  : renderTaskGrid(getTasksByStatus("in_review"))}
              </TabsContent>

              <TabsContent value="completed" className="space-y-4">
                {user?.role === "manager" && viewMode === "table"
                  ? renderTaskTable(getTasksByStatus("completed"))
                  : renderTaskGrid(getTasksByStatus("completed"))}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      <TaskDialog
        task={selectedTask}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        employees={MOCK_EMPLOYEES}
        showAssignment={user?.role === "manager"}
        showStatusChange={user?.role === "employee" || user?.role === "manager"}
      />
    </ProtectedRoute>
  )
}
