import { v4 as uuidv4 } from 'uuid'
import './style.css'

const form = document.getElementById('form') as HTMLFormElement
const formInput = document.getElementById('new-task-input') as HTMLInputElement
const toggleAllBtn = document.getElementById('toggle-all') as HTMLInputElement
const taskList = document.getElementById('task-list') as HTMLUListElement

type Task = {
  id: string
  title: string
  isFinished: boolean
}

form.addEventListener('submit', e => {
  e.preventDefault()

  if (formInput.value === '' || formInput.value === null) return

  const newTask: Task = {
    id: uuidv4(),
    title: formInput.value,
    isFinished: false
  }

  addTaskHandler(newTask)
  formInput.value = ''
})

function addTaskHandler(newTask: Task) {
  const item = document.createElement('li')
  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.classList.add('checkbox')
  const taskInput = document.createElement('input')
  taskInput.id = 'todo-item'
  taskInput.value = newTask.title
  const deleteBtn = document.createElement('div')
  deleteBtn.classList.add('hover-delete-btn')

  checkbox.addEventListener('click', () => {
    newTask.isFinished = !newTask.isFinished
    taskInput.classList.toggle('completed-task')
  })

  deleteBtn.addEventListener('click', () => {
    item.remove()
  })

  item.append(checkbox, taskInput, deleteBtn)
  taskList.append(item)
}
