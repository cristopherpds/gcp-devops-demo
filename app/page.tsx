'use client'

import { useState, useEffect } from 'react'
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

interface Task {
  id: string
  title: string
  completed: boolean
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'tasks'), (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task)))
    })
    return () => unsubscribe()
  }, [])

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newTask.trim()) {
      await addDoc(collection(db, 'tasks'), { title: newTask, completed: false })
      setNewTask('')
    }
  }

  const toggleTask = async (id: string, completed: boolean) => {
    await updateDoc(doc(db, 'tasks', id), { completed: !completed })
  }

  const deleteTask = async (id: string) => {
    await deleteDoc(doc(db, 'tasks', id))
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold text-blue-600 mb-8">
          Mi Portfolio DevOps en GCP
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Lista de Tareas CRUD</h2>
          
          <form onSubmit={addTask} className="mb-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Nueva tarea"
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button type="submit" className="mt-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Agregar Tarea
            </button>
          </form>

          <ul>
            {tasks.map((task) => (
              <li key={task.id} className="flex items-center justify-between border-b py-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id, task.completed)}
                    className="mr-2"
                  />
                  <span className={task.completed ? 'line-through' : ''}>{task.title}</span>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <a
            href="https://cloud.google.com/firestore"
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600 bg-white shadow-md"
          >
            <h3 className="text-2xl font-bold">Firestore en GCP &rarr;</h3>
            <p className="mt-4 text-xl">
              Base de datos NoSQL escalable para aplicaciones web y móviles.
            </p>
          </a>

          <a
            href="https://cloud.google.com/build"
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600 bg-white shadow-md"
          >
            <h3 className="text-2xl font-bold">CI/CD con Cloud Build &rarr;</h3>
            <p className="mt-4 text-xl">
              Automatización del proceso de integración y despliegue continuo en GCP.
            </p>
          </a>

          <a
            href="https://cloud.google.com/run"
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600 bg-white shadow-md"
          >
            <h3 className="text-2xl font-bold">Despliegue en Cloud Run &rarr;</h3>
            <p className="mt-4 text-xl">
              Ejecución de contenedores sin servidor en una plataforma totalmente gestionada.
            </p>
          </a>

          <a
            href="https://www.terraform.io/"
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600 bg-white shadow-md"
          >
            <h3 className="text-2xl font-bold">Infraestructura como Código &rarr;</h3>
            <p className="mt-4 text-xl">
              Gestión de la infraestructura en GCP utilizando Terraform.
            </p>
          </a>
        </div>
      </main>
    </div>
  )
}