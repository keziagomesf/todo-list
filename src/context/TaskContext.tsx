"use client"; 

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Task } from "@/types/task";

interface TaskContextType {
  task: Task[];
  addTask: (title: string, description: string) => void;
  removeTask: (id: string) => void;
  editTask: (id: string, newTask: Partial<Task>) => void;
  changeStatus: (id: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [task, setTask] = useState<Task[]>([]);

  // Verificar se o código está rodando no cliente
  useEffect(() => {
    // Só acessar o localStorage no cliente
    if (typeof window !== "undefined") {
      const taskSave = localStorage.getItem("tarefas");
      if (taskSave) {
        setTask(JSON.parse(taskSave));
      }
    }
  }, []);

  // Salvar as tarefas no localStorage sempre que o estado mudar
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tarefas", JSON.stringify(task));
    }
  }, [task]);

  const addTask = (title: string, description: string) => {
    setTask((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title,
        description,
        status: "pendente",
      },
    ]);
  };

  const removeTask = (id: string) => {
    setTask((prev) => prev.filter((t) => t.id !== id));
  };

  const editTask = (id: string, newTask: Partial<Task>) => {
    setTask((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...newTask } : t))
    );
  };

  const changeStatus = (id: string) => {
    setTask((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "pendente" ? "concluida" : "pendente" }
          : t
      )
    );
  };

  return (
    <TaskContext.Provider
      value={{
        task,
        addTask,
        removeTask,
        editTask,
        changeStatus,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTask deve ser usado dentro de TaskProvider");
  return context;
};
