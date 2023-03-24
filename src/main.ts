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

function unCompletedCountHandler() {
  const data = loadTasksHandler()
  const count = data.filter(task => task.isFinished == false).length
  itemsLeft.textContent = count.toString() + ' items left'
  if (count == 0) toggleAllBtn.classList.add('clicked')
  else toggleAllBtn.classList.remove('clicked')
}
unCompletedCountHandler()

form.addEventListener('submit', e => {
  e.preventDefault()

  if (formInput.value === '' || formInput.value === null) return

  const newTask: Task = {
    id: uuidv4(),
    title: formInput.value,
    isFinished: false
  }

  const data = loadTasksHandler()
  data.push(newTask)
  saveTasksHandler(data)
  unCompletedCountHandler()

  addTaskHandler(newTask)
  formInput.value = ''
})

toggleAllBtn.addEventListener('click', () => {
  const data = loadTasksHandler()
  if (data.filter(task => task.isFinished == false).length > 0) {
    const updatedArray = data.map(item => {
      item.isFinished = true
      return item
    })
    saveTasksHandler(updatedArray)
    taskList.textContent = ''
    updatedArray.forEach(item => addTaskHandler(item))
    unCompletedCountHandler()
  } else {
    const updatedArray = data.map(item => {
      item.isFinished = false
      return item
    })
    saveTasksHandler(updatedArray)
    taskList.textContent = ''
    updatedArray.forEach(item => addTaskHandler(item))
  }
  unCompletedCountHandler()
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
    unCompletedCountHandler()
  }

  checkbox.addEventListener('click', () => {
    newTask.isFinished = !newTask.isFinished
    const data = loadTasksHandler()
    const changedItem = data.findIndex(item => item.id == newTask.id)
    data[changedItem].isFinished = newTask.isFinished
    saveTasksHandler(data)
    unCompletedCountHandler()
    taskInput.classList.toggle('completed-task')
  })

  deleteBtn.addEventListener('click', () => {
    const data = loadTasksHandler()
    const removeItem = data.findIndex(item => item.id == newTask.id)
    data.splice(removeItem, 1)
    saveTasksHandler(data)
    console.log(data)

    unCompletedCountHandler()
    item.remove()
  })

  item.append(checkbox, taskInput, deleteBtn)
  taskList.append(item)
}

function saveTasksHandler(tasks: Task[]) {
  localStorage.setItem('TASKS', JSON.stringify(tasks))
}

function loadTasksHandler(): Task[] {
  const taskJSON = localStorage.getItem('TASKS')
  if (taskJSON === null || taskJSON === '') return []
  return JSON.parse(taskJSON)
}

const allBtn = document.getElementById('all-btn') as HTMLButtonElement
const activeBtn = document.getElementById('active-btn') as HTMLButtonElement
const completedBtn = document.getElementById('completed-btn') as HTMLButtonElement
const clearCompletedBtn = document.getElementById('clear-completed') as HTMLButtonElement

allBtn.addEventListener('click', () => {
  taskList.textContent = ''
  const data = loadTasksHandler()
  data.forEach(item => addTaskHandler(item))
})

activeBtn.addEventListener('click', () => {
  taskList.textContent = ''
  const data = loadTasksHandler()
  const activeTasks = data.filter(item => item.isFinished == false)
  activeTasks.forEach(item => addTaskHandler(item))
})

completedBtn.addEventListener('click', () => {
  taskList.textContent = ''
  const data = loadTasksHandler()
  const completedTasks = data.filter(item => item.isFinished == true)
  completedTasks.forEach(item => addTaskHandler(item))
})

clearCompletedBtn.addEventListener('click', () => {
  taskList.textContent = ''
  const data = loadTasksHandler()
  const updatedArray = data.filter(item => item.isFinished == false)
  saveTasksHandler(updatedArray)
  updatedArray.forEach(item => addTaskHandler(item))
})
