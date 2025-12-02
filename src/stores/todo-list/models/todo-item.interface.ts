export interface TodoItem {
  id: string
  description: string
  fulfilled: boolean
  date?: Date | string
}
