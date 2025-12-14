"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Sidebar } from "@/components/sidebar"
import { useTaskStore } from "@/lib/task-store-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle } from "lucide-react"
import { Fragment, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight } from "lucide-react"
import { api } from "@/lib/api-client"

export default function EmployeesPage() {
  const { tasks } = useTaskStore()
  const [expandedEmployee, setExpandedEmployee] = useState<string | null>(null)
  const [employees, setEmployees] = useState<any[]>([])

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const data = await api.getUsers('employee')
        setEmployees(data)
      } catch (error) {
        console.error('Error fetching employees:', error)
      }
    }
    fetchEmployees()
  }, [])

  const getEmployeeStats = (employeeId: string) => {
    const employeeTasks = tasks.filter((t) => t.assignedToId === employeeId)
    return {
      total: employeeTasks.length,
      active: employeeTasks.filter((t) => t.status === "in_progress").length,
      completed: employeeTasks.filter((t) => t.status === "completed").length,
      tasks: employeeTasks,
    }
  }

  const toggleEmployee = (employeeId: string) => {
    setExpandedEmployee(expandedEmployee === employeeId ? null : employeeId)
  }

  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Ажилчид</h1>
              <p className="text-muted-foreground">Ажилчдын гүйцэтгэл ба даалгаврын хяналт</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Ажилчдын үйл ажиллагаа</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Ажилтны нэр</TableHead>
                      <TableHead>Үүрэг</TableHead>
                      <TableHead>Нийт хүсэлт</TableHead>
                      <TableHead>Идэвхтэй хүсэлт</TableHead>
                      <TableHead>Дуусгасан хүсэлт</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => {
                      const stats = getEmployeeStats(employee.id.toString())
                      const isExpanded = expandedEmployee === employee.id
                      const completedTasks = stats.tasks.filter((t) => t.status === "completed")

                      return (
                        <Fragment key={employee.id}>
                          <TableRow>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleEmployee(employee.id)}
                                className="h-8 w-8 p-0"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                    {(employee.first_name && employee.last_name
                                      ? `${employee.first_name} ${employee.last_name}`
                                      : employee.username)
                                      .split(" ")
                                      .map((n: string) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{employee.first_name && employee.last_name ? `${employee.first_name} ${employee.last_name}` : employee.username}</p>
                                  <p className="text-xs text-muted-foreground">{employee.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{employee.role}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{stats.total}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-orange-100 text-orange-700" variant="secondary">
                                {stats.active}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-green-100 text-green-700" variant="secondary">
                                {stats.completed}
                              </Badge>
                            </TableCell>
                          </TableRow>
                          {isExpanded && (
                            <TableRow>
                              <TableCell colSpan={6} className="bg-muted/20">
                                <div className="p-4 space-y-3">
                                  <div className="flex items-center gap-2 mb-3">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <h4 className="font-semibold">Дууссан даалгаврууд</h4>
                                  </div>
                                  {completedTasks.length > 0 ? (
                                    <div className="space-y-2">
                                      {completedTasks.map((task) => (
                                        <div
                                          key={task.id}
                                          className="flex items-center justify-between p-2 bg-background rounded-md border"
                                        >
                                          <div className="flex-1">
                                            <p className="font-medium text-sm">{task.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                              Client: {task.clientName} • Priority: {task.priority}
                                            </p>
                                          </div>
                                          <p className="text-xs text-muted-foreground whitespace-nowrap">
                                            {new Date(task.updatedAt).toLocaleDateString()}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-muted-foreground">Одоогоор дууссан даалгавар алга</p>
                                  )}
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
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
