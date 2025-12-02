import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { TodoItem } from '@/stores/todo-list/models/todo-item.interface.ts'

export const useTodoListStore = defineStore('todo-list', () => {
  const todoList = ref<TodoItem[]>([])
  const STORAGE_KEY = 'todo-list'

  function saveTodoList() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todoList.value))
  }

  function addTodo(item: TodoItem) {
    todoList.value.unshift(item)
    saveTodoList()
  }

  function removeTodo(id: string) {
    todoList.value = todoList.value.filter((item) => item.id !== id)
    saveTodoList()
  }

  function toggleFulfilled(id: string, fulfilled: boolean): void {
    const index = todoList.value.findIndex((todo) => todo.id === id)
    if (index === -1) return

    todoList.value = todoList.value.map((todo) =>
      todo.id === id ? { ...todo, fulfilled: fulfilled } : todo,
    )
    saveTodoList()
  }

  function updateTodo(id: string, description: string) {
    const exist = todoList.value.some((todo) => todo.id === id)
    if (!exist) return

    todoList.value = todoList.value.map((todo) =>
      todo.id === id ? { ...todo, description } : todo,
    )
    saveTodoList()
  }

  function loadTodoList() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) {
        todoList.value = []
        return
      }
      const parsed = JSON.parse(raw) as TodoItem[]

      console.log(todoList.value)
      todoList.value = parsed.map((i) => ({
        ...i,
        date: typeof i.date === 'string' ? i.date : i.date?.toString(),
      }))
    } catch {
      todoList.value = []
    }
  }

  return {
    todoList,
    addTodo,
    removeTodo,
    loadTodoList,
    toggleFulfilled,
    updateTodo,
  }
})
