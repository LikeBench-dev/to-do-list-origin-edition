<script setup lang="ts">
import { Edit16Regular, Save20Regular, Delete28Regular } from '@vicons/fluent'
import { NIcon, NInput, NCheckbox } from 'naive-ui'
import type { TodoItem } from '@/stores/todo-list/models/todo-item.interface.ts'
import { ref, toRefs } from 'vue'
import { useTodoListStore } from '@/stores/todo-list/todo-list.store.ts'

const todoListStore = useTodoListStore()

const props = defineProps<{ todo: TodoItem }>()

const { fulfilled, description } = toRefs(props.todo)

const isDisabled = ref(true)
const hasError = ref(false)

function editTodo(): void {
  if (isDisabled.value) {
    isDisabled.value = false
  } else {
    if (!description.value) {
      hasError.value = true
      return
    }

    todoListStore.updateTodo(props.todo.id, description.value)
    isDisabled.value = true
  }

  hasError.value = false
}
</script>

<template>
  <div
    class="flex items-center justify-center min-w-[250px] border-solid border rounded-sm border-slate-300 px-5 !py-2 mb-5"
  >
    <n-checkbox
      v-model:checked="fulfilled"
      size="large"
      @update:checked="todoListStore.toggleFulfilled(todo.id, fulfilled)"
    />

    <n-input
      class="mx-5"
      :disabled="isDisabled"
      :status="(hasError ? 'error'  : '') as any"
      v-model:value="description"
      @keydown.enter.prevent="editTodo"
      placeholder="Описание задачи"
    />

    <n-icon
      v-if="isDisabled"
      class="cursor-pointer"
      :size="18"
      :component="Edit16Regular"
      @click="editTodo"
    />
    <n-icon
      color="green"
      v-else
      class="cursor-pointer"
      :size="18"
      :component="Save20Regular"
      @click="editTodo"
    />

    <n-icon
      class="ml-3 cursor-pointer"
      color="red"
      :size="18"
      :component="Delete28Regular"
      @click="todoListStore.removeTodo(todo.id)"
    />
  </div>
</template>

<style scoped></style>
