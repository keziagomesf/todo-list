"use client";

import { useTask } from "@/context/TaskContext";
import { Task } from "@/types/task";
import { useState } from "react";
import Link from "next/link";
import { TrashIcon, PencilIcon, CheckIcon } from "@heroicons/react/24/solid";

export default function Home() {
  const { task, addTask, removeTask, editTask, changeStatus } = useTask();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [search, setSearch] = useState("");

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const taskFilter = task.filter((task) => {
    const matchStatus =
      filterStatus === "todos" || task.status === filterStatus;
    const matchSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase());

    return matchStatus && matchSearch;
  });

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setIsModalOpen(true);
  };

  const saveEditedTask = () => {
    if (editingTask) {
      editTask(editingTask.id, { title, description });
      closeModal();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTitle("");
    setDescription("");
  };

  const TaskItem = ({ task }: { task: Task }) => {
    return (
      <div className="bg-gray-600 p-4 rounded-lg shadow-md flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{task.title}</h3>
        </div>
        <div className="flex space-x-2">
          <Link href={`/task/${task.id}`}>
            <button className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700 transition">
              Ver Detalhes
            </button>
          </Link>
          <button
            onClick={() => changeStatus(task.id)}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700 transition"
          >
            <CheckIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => removeTask(task.id)}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700 transition"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => openEditModal(task)}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700 transition"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-400 text-white min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className=" bg-gray-800 mx-auto mb-8 rounded-md">
        <h1 className="text-3xl font-bold text-center p-5 text-gray-100 mb-8">
          Minhas Tarefas
        </h1>
        {/* Barra de Pesquisa e Filtro */}
        <div className="flex justify-between items-center space-x-4 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar Tarefas"
            className="w-full sm:w-80 p-2 ml-6 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2"
          />
          <select
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 mr-6 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2"
          >
            <option value="todos">Todos</option>
            <option value="pendente">Pendentes</option>
            <option value="concluida">Concluídas</option>
          </select>
        </div>

        {/* Formulário de Tarefa */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título da tarefa"
            className="w-full p-3 mb-4 bg-gray-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
          <textarea
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 mb-4 bg-gray-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
          <button
            onClick={() => {
              if (title.trim() && description.trim()) {
                addTask(title, description);
                setTitle("");
                setDescription("");
              }
            }}
            disabled={!title.trim() || !description.trim()}
            className={`w-full py-2 text-white rounded-md transition ${
              title.trim() && description.trim()
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-500 cursor-not-allowed"
            }`}
          >
            Adicionar Tarefa
          </button>
        </div>
      </div>

      {/* Seção de Tarefas Pendentes */}
      <div className="bg-gray-800 rounded-md p-5">
        <div className="max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">Tarefas Pendentes</h2>
          <div className="space-y-4">
            {taskFilter
              .filter((t) => t.status === "pendente")
              .map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
          </div>
        </div>

        {/* Seção de Tarefas Concluídas */}
        <div className="max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">Tarefas Concluídas</h2>
          <div className="space-y-4">
            {taskFilter
              .filter((t) => t.status === "concluida")
              .map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
          </div>
        </div>
      </div>

      {/* Modal de Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-2xl font-semibold text-white mb-4">Editar Tarefa</h3>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título"
              className="w-full p-3 mb-4 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição"
              className="w-full p-3 mb-4 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={saveEditedTask}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Salvar
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
