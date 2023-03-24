import { v4 as uuidv4 } from 'uuid'
import './style.css'

const form = document.getElementById('form') as HTMLFormElement
const formInput = document.getElementById('new-task-input') as HTMLInputElement
const toggleAllBtn = document.getElementById('toggle-all') as HTMLInputElement
const taskList = document.getElementById('task-list') as HTMLUListElement
const itemsLeft = document.getElementById('itemsLeft') as HTMLSpanElement

type Task = {
  id: string
  title: string
  isFinished: boolean
}

const tasks: Task[] = loadTasksHandler()
if (tasks != null) tasks.forEach(task => addTaskHandler(task))

function unCompletedCountHandler(tasks: Task[]) {
  itemsLeft.textContent = tasks.filter(task => task.isFinished == false).length.toString() + ' items left'
}
unCompletedCountHandler(tasks)

form.addEventListener('submit', e => {
  e.preventDefault()

  if (formInput.value === '' || formInput.value === null) return

  const newTask: Task = {
    id: uuidv4(),
    title: formInput.value,
    isFinished: false
  }

  tasks.push(newTask)
  saveTasksHandler(tasks)
  unCompletedCountHandler(tasks)

  addTaskHandler(newTask)
  formInput.value = ''
})

toggleAllBtn.addEventListener('click', () => {
  if (tasks.filter(task => task.isFinished == false).length > 0) {
    const updatedArray = tasks.map(item => {
      item.isFinished = true
      return item
    })
    saveTasksHandler(updatedArray)
    taskList.textContent = ''
    updatedArray.forEach(item => addTaskHandler(item))
  } else {
    const updatedArray = tasks.map(item => {
      item.isFinished = false
      return item
    })
    saveTasksHandler(updatedArray)
    taskList.textContent = ''
    updatedArray.forEach(item => addTaskHandler(item))
  }
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

  if (newTask.isFinished == true) {
    taskInput.classList.add('completed-task')
    checkbox.checked = true
    unCompletedCountHandler(tasks)
  }

  checkbox.addEventListener('click', () => {
    newTask.isFinished = !newTask.isFinished
    const changedItem = tasks.findIndex(item => item.id == newTask.id)
    tasks[changedItem].isFinished = newTask.isFinished
    saveTasksHandler(tasks)
    unCompletedCountHandler(tasks)
    taskInput.classList.toggle('completed-task')
  })

  deleteBtn.addEventListener('click', () => {
    const removeItem = tasks.findIndex(item => item.id == newTask.id)
    tasks.splice(removeItem, 1)
    saveTasksHandler(tasks)
    unCompletedCountHandler(tasks)
    item.remove()
  })

  item.append(checkbox, taskInput, deleteBtn)
  taskList.append(item)
}

function saveTasksHandler(tasks: Task[]) {
  localStorage.setItem('TASKS', JSON.stringify(tasks))
}

function loadTasksHandler() {
  const taskJSON = localStorage.getItem('TASKS')
  if (taskJSON === null || taskJSON === '') return []
  return JSON.parse(taskJSON)
}
