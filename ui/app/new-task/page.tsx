"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { Sidebar } from "@/components/sidebar"
import { useAuth } from "@/lib/auth-context"
import { useTaskStore } from "@/lib/task-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { TaskPriority } from "@/lib/types"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function NewTaskPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { addTask } = useTaskStore()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<TaskPriority>("medium")
  const [dueDate, setDueDate] = useState<Date>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    setIsSubmitting(true)

    addTask({
      title,
      description,
      status: "pending",
      priority,
      clientId: user.id,
      clientName: user.name,
      assignedToId: null,
      assignedToName: null,
      createdById: user.id,
      createdByName: user.name,
      dueDate: dueDate || null,
    })

    setIsSubmitting(false)
    router.push("/dashboard")
  }

  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-2xl space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Даалгавар өгөх</h1>
              <p className="text-muted-foreground">Манай IT багт шинэ дэмжлэгийн хүсэлт үүсгээрэй</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Даалгаврын дэлгэрэнгүй</CardTitle>
                <CardDescription>Таны дэмжлэгийн хүсэлтийн талаар мэдээлэл өгнө үү</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Task Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="Brief description of the issue"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Description <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Provide detailed information about your request..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={6}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Та хүсэлтийнхээ талаархи холбогдох дэлгэрэнгүй мэдээлэл, алдааны мэдэгдэл, эсвэл асуудлыг дахин үүсгэх алхмуудыг оруулна уу
                    </p>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="priority">
                        Priority <span className="text-destructive">*</span>
                      </Label>
                      <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                        <SelectTrigger id="priority">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Бага - Хүлээж болно</SelectItem>
                          <SelectItem value="medium">Дунд - Энгийн ач холбогдол</SelectItem>
                          <SelectItem value="high">Өндөр - Чухал</SelectItem>
                          <SelectItem value="urgent">Яаралтай - Шаардлагатай асуудал</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Due Date (Optional)</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="dueDate"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !dueDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="rounded-lg border bg-muted/50 p-4">
                    <h3 className="mb-2 font-semibold">Дараах үйл явц явагдана</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>1. Таны хүсэлтийг манай IT менежер хянах болно</li>
                      <li>2. Техникч таны даалгаварт томилогдох болно</li>
                      <li>3. Та хяналтын самбараас явцыг хянах боломжтой болно</li>
                      <li>4. Статус өөрчлөгдөхөд шинэчлэлтүүдийг хүлээн авах болно</li>
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" disabled={isSubmitting} className="flex-1">
                      {isSubmitting ? "Submitting..." : "Submit Task"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
                      Болих
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
