"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Sidebar } from "@/components/sidebar"
import { useAuth } from "@/lib/auth-context"
import { useTaskStore } from "@/lib/task-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskCard } from "@/components/task-card"
import { TaskDialog } from "@/components/task-dialog"
import { AnalyticsChart } from "@/components/analytics-chart"
import type { Task } from "@/lib/types"
import { ClipboardList, CheckCircle, Clock, AlertCircle } from "lucide-react"

// Mock employees for manager
const MOCK_EMPLOYEES = [
  { id: "2", name: "Sarah Employee" },
  { id: "4", name: "John Tech" },
  { id: "5", name: "Emma Support" },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const { tasks, getTasksByAssignee, getTasksByClient } = useTaskStore()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setDialogOpen(true)
  }

  const renderManagerDashboard = () => {
    const totalTasks = tasks.length
    const pendingTasks = tasks.filter((t) => t.status === "pending").length
    const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length
    const completedTasks = tasks.filter((t) => t.status === "completed").length
    const unassignedTasks = tasks.filter((t) => !t.assignedToId)

    // Tasks completed per employee
    const employeeTaskCounts = MOCK_EMPLOYEES.map((emp) => {
      const completedByEmployee = tasks.filter((t) => t.assignedToId === emp.id && t.status === "completed").length
      return {
        name: emp.name,
        tasks: completedByEmployee,
      }
    })

    // Average resolution time over last 7 days (mock data for now)
    const resolutionTimeData = [
      { day: "Mon", hours: 4.5 },
      { day: "Tue", hours: 3.8 },
      { day: "Wed", hours: 5.2 },
      { day: "Thu", hours: 4.1 },
      { day: "Fri", hours: 3.5 },
      { day: "Sat", hours: 2.9 },
      { day: "Sun", hours: 3.2 },
    ]

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Manager Dashboard</h1>
          <p className="text-muted-foreground">Overview of all tasks and performance analytics</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTasks}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTasks}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressTasks}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTasks}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <AnalyticsChart
            type="bar"
            title="Tasks Completed per Employee"
            data={employeeTaskCounts}
            dataKey="tasks"
            xAxisKey="name"
            color="#3b82f6"
          />
          <AnalyticsChart
            type="line"
            title="Average Resolution Time (Last 7 Days)"
            data={resolutionTimeData}
            dataKey="hours"
            xAxisKey="day"
            color="#f59e0b"
          />
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Unassigned Tasks</h2>
            <p className="text-sm text-muted-foreground">Tasks waiting to be assigned to employees</p>
          </div>

          {unassignedTasks.length === 0 ? (
            <Card>
              <CardContent className="flex min-h-[200px] items-center justify-center">
                <p className="text-muted-foreground">No unassigned tasks</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {unassignedTasks.map((task) => (
                <TaskCard key={task.id} task={task} onClick={() => handleTaskClick(task)} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Recent Tasks</h2>
            <p className="text-sm text-muted-foreground">All tasks in the system</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks
              .slice()
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 6)
              .map((task) => (
                <TaskCard key={task.id} task={task} onClick={() => handleTaskClick(task)} />
              ))}
          </div>
        </div>
      </div>
    )
  }

  const renderEmployeeDashboard = () => {
    const myTasks = getTasksByAssignee(user!.id)
    const todoTasks = myTasks.filter((t) => t.status === "pending" || t.status === "in_progress")
    const completedTasks = myTasks.filter((t) => t.status === "completed")

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Employee Dashboard</h1>
          <p className="text-muted-foreground">Your assigned tasks</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Tasks</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myTasks.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">To Do</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todoTasks.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTasks.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Active Tasks</h2>
            <p className="text-sm text-muted-foreground">Tasks assigned to you</p>
          </div>

          {myTasks.length === 0 ? (
            <Card>
              <CardContent className="flex min-h-[200px] items-center justify-center">
                <p className="text-muted-foreground">No tasks assigned yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {myTasks.map((task) => (
                <TaskCard key={task.id} task={task} onClick={() => handleTaskClick(task)} />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderClientDashboard = () => {
    const myTasks = getTasksByClient(user!.id)
    const pendingTasks = myTasks.filter((t) => t.status === "pending")
    const inProgressTasks = myTasks.filter((t) => t.status === "in_progress")
    const completedTasks = myTasks.filter((t) => t.status === "completed")

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Client Dashboard</h1>
          <p className="text-muted-foreground">Track your support requests</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTasks.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressTasks.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTasks.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">My Requests</h2>
            <p className="text-sm text-muted-foreground">Your submitted support tickets</p>
          </div>

          {myTasks.length === 0 ? (
            <Card>
              <CardContent className="flex min-h-[200px] items-center justify-center">
                <p className="text-muted-foreground">No support requests submitted yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {myTasks.map((task) => (
                <TaskCard key={task.id} task={task} onClick={() => handleTaskClick(task)} />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8">
          {user?.role === "manager" && renderManagerDashboard()}
          {user?.role === "employee" && renderEmployeeDashboard()}
          {user?.role === "client" && renderClientDashboard()}
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
