import { useContext, useState, ReactNode } from "react";
import { createContext } from "react";
import {Task} from "@/types/task";

interface TaskContextType {
    tasks: Task[];
    addTask: (title: string, description: string) => void;
    removeTask: (id:string) => void;
    editTask: (id:string, newTask:Partial<Task>) => void;
    changeStatus: (id: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined> (undefined);

export const TaskProvider = ({children}: {children: ReactNode}) => {
    const [tasks, setTasks] = useState<Task[]>([]);


const addTask = (title: string, description: string) => {
    setTasks((prev) => [...prev, {
        id:Date.now().toString(),
        title,
        description,
        status: "pendente"
    }])
}

const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
}

const editTask = (id: string, newTask:Partial<Task>) => {
    setTasks((prev) =>
    prev.map((t) => (t.id === id ? { ...t, ...newTask } : t))
    );
};

const changeStatus = (id: string) => {
    setTasks((prev) =>
    prev.map((t) =>
    t.id === id ? {...t, status: t.status === "pendente" ? "concluida" : "pendente"} : t
))
}

return (
    <TaskContext.Provider
    value={{
        tasks,
        addTask,
        removeTask,
        editTask,
        changeStatus,
    }} >
        {children}
    </TaskContext.Provider>
)
}
export const useTask = () => {
    const context = useContext(TaskContext);
    if (!context) throw new Error ("useTask deve ser usado dentro de TaskProvider");
    return context;
}