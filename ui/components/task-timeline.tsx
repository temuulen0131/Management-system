"use client"

import type { Task, TaskHistory } from "@/lib/types"
import { CheckCircle, Circle, Clock, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface TaskTimelineProps {
  task: Task
  history: TaskHistory[]
}

const statusConfig = {
  pending: { label: "Pending", color: "text-gray-500", bgColor: "bg-gray-100", icon: Circle },
  in_progress: { label: "In Progress", color: "text-orange-500", bgColor: "bg-orange-100", icon: Clock },
  in_review: { label: "In Review", color: "text-blue-500", bgColor: "bg-blue-100", icon: AlertCircle },
  completed: { label: "Completed", color: "text-green-500", bgColor: "bg-green-100", icon: CheckCircle },
}

export function TaskTimeline({ task, history }: TaskTimelineProps) {
  const timelineEvents = [
    { status: "pending", reached: true, timestamp: task.createdAt },
    {
      status: "in_progress",
      reached: task.status === "in_progress" || task.status === "in_review" || task.status === "completed",
      timestamp: history.find((h) => h.details.includes("in_progress"))?.createdAt || null,
    },
    {
      status: "in_review",
      reached: task.status === "in_review" || task.status === "completed",
      timestamp: history.find((h) => h.details.includes("in_review"))?.createdAt || null,
    },
    {
      status: "completed",
      reached: task.status === "completed",
      timestamp: history.find((h) => h.details.includes("completed"))?.createdAt || null,
    },
  ]

  return (
    <div className="flex items-center gap-2">
      {timelineEvents.map((event, index) => {
        const config = statusConfig[event.status as keyof typeof statusConfig]
        const Icon = config.icon
        const isLast = index === timelineEvents.length - 1

        return (
          <div key={event.status} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full",
                  event.reached ? config.bgColor : "bg-gray-100",
                )}
              >
                <Icon className={cn("h-4 w-4", event.reached ? config.color : "text-gray-400")} />
              </div>
            </div>
            {!isLast && <div className={cn("h-0.5 w-12", event.reached ? "bg-primary" : "bg-gray-200")} />}
          </div>
        )
      })}
    </div>
  )
}
