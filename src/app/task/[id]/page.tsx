'use client';

import { useTask } from "@/context/TaskContext";
import { useParams } from "next/navigation";

export default function TaskDetailPage() {
  const { id } = useParams();
  const { task } = useTask();

  const selectedTask = task.find((t) => t.id === id);

  if (!selectedTask) {
    return <p className="p-6 text-red-500">Tarefa não encontrada.</p>;
  }

  return (
    <div className="p-6 bg-gray-800 min-h-screen text-white">
      <h2 className="text-3xl font-bold mb-4">{selectedTask.title}</h2>
      <p className="text-lg">{selectedTask.description}</p>
    </div>
  );
}
