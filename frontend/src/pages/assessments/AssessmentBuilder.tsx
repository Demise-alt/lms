"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/GlassCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, GripVertical } from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

interface Question {
  id: string
  type: "mcq" | "true_false" | "short_answer"
  question: string
  options?: string[]
  correctAnswer?: string
  points: number
}

export function AssessmentBuilder() {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      type: "mcq",
      question: "What is the primary purpose of Salesforce Lightning?",
      options: ["CRM", "ERP", "CMS", "All of above"],
      correctAnswer: "CRM",
      points: 10
    }
  ])

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: "mcq",
      question: "",
      options: ["", "", "", ""],
      points: 10
    }
    setQuestions([...questions, newQuestion])
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return
    const items = Array.from(questions)
    const [reorderItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderItem)
    setQuestions(items)
  }

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Assessment Builder</h2>
        <Button onClick={addQuestion} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="questions">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {questions.map((q, index) => (
                <Draggable key={q.id} draggableId={q.id} index={index}>
                  {(provided, _snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="mb-4"
                    >
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <div className="flex items-start gap-3">
                          <div {...provided.dragHandleProps} className="pt-2">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline">Question {index + 1}</Badge>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <Input placeholder="Enter question" defaultValue={q.question} />
                            {q.type === "mcq" && (
                              <div className="space-y-2">
                                {q.options?.map((opt, i) => (
                                  <Input
                                    key={i}
                                    placeholder={`Option ${i + 1}`}
                                    defaultValue={opt}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </GlassCard>
  )
}
