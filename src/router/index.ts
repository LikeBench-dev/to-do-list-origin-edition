import { createRouter, createWebHistory } from 'vue-router'
import TodoList from '@/pages/todo-list.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      component: TodoList,
    },
  ],
})

export default router
