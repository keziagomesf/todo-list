"use client";

import { useTask } from "@/context/TaskContext";
import { useState } from "react";

export default function Home() {
  const {task, addTask, removeTask, editTask, changeStatus} = useTask();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div>
      <h1>Minhas Tarefas</h1>
      <div>
        <input 
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titulo da tarefa"
        />
        <textarea 
        placeholder="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        />
        <button>Adicionar Tarefa</button>
      </div>

      <div>
        <h2>Tarefas Pendentes</h2>
        <div></div>
      </div>
    </div>

  );
}
