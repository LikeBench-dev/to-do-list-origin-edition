<script setup lang="ts">
import {
  type FormInst,
  NButton,
  NInput,
  NForm,
  NFormItem,
  NTabs,
  NTabPane,
  useMessage,
  type FormItemRule,
  type FormValidationError,
} from 'naive-ui'
import { v7 as uuidv7 } from 'uuid'
import { useTodoListStore } from '@/stores/todo-list/todo-list.store.ts'
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import TodoEditor from '@/components/todo-editor.vue'

const todoListStore = useTodoListStore()

const { todoList } = storeToRefs(todoListStore)

const formRef = ref<FormInst | null>(null)
const formValue = ref({
  description: '',
})

const message = useMessage()
const rules = {
  description: {
    required: true,
    trigger: ['input'],
    validator: (rule: FormItemRule, value: string) => {
      if (!value) {
        return new Error('Поле обязательно для заполнения')
      }
    },
  },
}

function handleValidateClick() {
  console.log(formRef)
  formRef.value?.validate((errors: Array<FormValidationError> | undefined) => {
    console.log('errors', errors)

    if (!errors) {
      todoListStore.addTodo({
        ...formValue.value,
        id: uuidv7(),
        fulfilled: false,
      })

      resetForm()
      message.success('Сохранено')
    } else {
      console.log(errors)
    }
  })
}

function resetForm() {
  formValue.value.description = ''
}

onMounted(() => {
  todoListStore.loadTodoList()
})
</script>

<template>
  <div class="flex flex-col w-full h-dvh items-center justify-center">
    <div class="flex flex-col min-h-[600px] items-center">
      <h1 class="text-xl font-bold mb-2">Your ToDo List!</h1>

      <n-form
        class="flex flex-col items-start justify-center"
        ref="formRef"
        inline
        :label-width="80"
        :model="formValue"
        :rules="rules"
        size="medium"
      >
        <div class="flex items-center justify-center">
          <n-form-item path="description" class="min-w-[250px]">
            <n-input
              @keydown.enter.prevent="handleValidateClick"
              v-model:value="formValue.description"
              placeholder="Описание задачи"
            />
          </n-form-item>
          <n-button @click.prevent="handleValidateClick" type="primary">naive-ui</n-button>
        </div>
      </n-form>

      <div class="flex flex-col" v-if="todoList.length">
        <n-tabs type="segment" animated class="min-w-[330px]">
          <n-tab-pane name="not_completed" tab="Активные">
            <template v-if="todoList.some((t) => !t.fulfilled)">
              <todo-editor
                v-for="todo in todoList.filter((item) => !item.fulfilled)"
                :key="todo.id"
                :todo="todo"
              />
            </template>
            <p v-else>Вы выполнили все задачи!</p>
          </n-tab-pane>
          <n-tab-pane name="completed" tab="Завершенные">
            <template v-if="todoList.some((t) => t.fulfilled)">
              <todo-editor
                v-for="todo in todoList.filter((item) => item.fulfilled)"
                :key="todo.id"
                :todo="todo"
              />
            </template>
            <p v-else>Вы не выполнили ни одной задачи :(</p>
          </n-tab-pane>
          <n-tab-pane name="all" tab="Все">
            <todo-editor v-for="todo in todoList" :key="todo.id" :todo="todo" />
          </n-tab-pane>
        </n-tabs>
      </div>
      <p v-else>Список пуст</p>
    </div>
  </div>
</template>

<style scoped></style>
