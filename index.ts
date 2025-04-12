
document.body.style.backgroundColor = "#111";
document.body.style.color = "white";

const elements= document.createElement('h1');
elements.textContent = "Todo List Tasks ";
elements.style.textAlign ='center';
elements.style.margin='0';

elements.style.width='100%';
document.body.append(elements);


// Create container
const container = document.createElement('div') as HTMLDivElement;
container.style.maxWidth = '100%';
container.style.margin = '50px auto';
container.style.fontFamily = 'Arial, sans-serif';
container.style.backgroundColor = "black";
container.style.margin = "10px";



// Input group
const inputGroup = document.createElement('div') as HTMLDivElement;
inputGroup.style.display = 'flex';
inputGroup.style.alignItems = 'center';
inputGroup.style.gap = '10px';

const addCompletedCheckbox = document.createElement('input') as HTMLInputElement;
addCompletedCheckbox.type = 'checkbox';
addCompletedCheckbox.title = 'Mark as completed';

const input = document.createElement('input') as HTMLInputElement;
input.style.color = 'black';
input.style.backgroundColor = "#facf23";
input.type = 'text';
input.placeholder = 'Add a new task...';
input.style.flex = '1';
input.style.padding = '10px';

const button = document.createElement('button') as HTMLButtonElement;
button.textContent = 'Add';
button.style.width = '150px';
button.style.borderRadius = '8px';
button.style.backgroundColor = '#facf23';

button.style.padding = '10px 20px';
button.style.cursor = 'pointer';

inputGroup.appendChild(addCompletedCheckbox);
inputGroup.appendChild(input);
inputGroup.appendChild(button);

// Task list
const list = document.createElement('ul') as HTMLUListElement;
list.style.listStyle = 'none';
list.style.padding = '0';
list.style.marginTop = '10px';


// Counter at bottom
const countDisplay = document.createElement('li')as HTMLLIElement;
countDisplay.style.marginTop = '15px';
countDisplay.style.fontWeight = 'bold';
countDisplay.style.paddingTop = '10px';
countDisplay.style.border = '2px solid #ff6528';
countDisplay.style.padding = '10px';
countDisplay.style.alignItems ='center';
countDisplay.style.textAlign ='center';


// Append all
container.appendChild(inputGroup);
container.appendChild(list);
document.body.appendChild(container);

// --- Update Count Logic ---
function updateCounts():void {
  const allTasks = Array.from(list.children).filter((li) => li !== countDisplay);
  const completed = allTasks.filter((li) => {
    const checkbox = li.querySelector('input[type="checkbox"]') as HTMLInputElement;
    return checkbox?.checked;
  }).length;

  const notCompleted = allTasks.length - completed;
  countDisplay.textContent = `✅ Completed: ${completed} | ❌ Not Completed: ${notCompleted}`;

  // Always move countDisplay to bottom
  list.appendChild(countDisplay);
}

// --- Load Tasks from localStorage ---
function loadTasks():void {
  const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  savedTasks.forEach((task: Task) => {
    addTask(task.text, task.iscompleted);
  });
}


// --- Save Tasks to localStorage ---
interface Task {
  text: string;
  iscompleted: boolean;
}
function saveTasks():void {
  const tasks:Task[] = [];
  const allTasks = Array.from(list.children).filter((li) => li !== countDisplay);

  allTasks.forEach((li) => {
    const checkbox = li.querySelector('input[type="checkbox"]') as HTMLInputElement;
    const taskText = li.querySelector('span') as HTMLElement;
    tasks.push({
      text: taskText.textContent || '',
      iscompleted: checkbox.checked
    });
  });
  
  localStorage.setItem('tasks', JSON.stringify(tasks));
}


// --- Add Task ---
function addTask(task: string, isCompleted: boolean) :void{
  const listItem = document.createElement('li');
  listItem.style.padding = '10px';
  listItem.style.border = '1px solid #ccc';
  listItem.style.marginTop = '5px';
  listItem.style.display = 'flex';
  listItem.style.alignItems = 'center';
  listItem.style.justifyContent = 'space-between';

  const checkbox = document.createElement('input') as HTMLInputElement;
  checkbox.type = 'checkbox';
  checkbox.checked = isCompleted;
  checkbox.style.marginRight = '10px';

  const taskText = document.createElement('span') as HTMLSpanElement;
  taskText.textContent = task;
  taskText.style.flex = '1';
  if (isCompleted) {
    taskText.style.textDecoration = 'line-through';
    taskText.style.opacity = '0.6';
  }

  checkbox.addEventListener('change', () => {
    const checked = checkbox.checked;
    taskText.style.textDecoration = checked ? 'line-through' : 'none';
    taskText.style.opacity = checked ? '0.6' : '1';
    updateCounts();
    saveTasks();
  });

  const editBtn = document.createElement('button') as HTMLButtonElement;
  editBtn.textContent = 'Edit';
  editBtn.style.marginLeft = '10px';
  editBtn.style.cursor = 'pointer';
  editBtn.style.width = '70px';
  editBtn.style.backgroundColor = '#8743a8';
  editBtn.style.color = 'white';
  editBtn.style.borderRadius = '8px';


  const deleteBtn = document.createElement('button') as HTMLButtonElement;
  deleteBtn.textContent = 'Delete';
  deleteBtn.style.marginLeft = '5px';
  deleteBtn.style.width = '70px';
  deleteBtn.style.cursor = 'pointer';
  deleteBtn.style.backgroundColor = '#8743a8';
  deleteBtn.style.color = 'white';
  deleteBtn.style.borderRadius = '8px';

  let isEditing = false;
  let currentEditInput: HTMLInputElement | null = null;
  let currentTaskText: HTMLElement | null = null;

  editBtn.addEventListener('click', () => {
    if (!isEditing) {
      // Enter edit mode
      const editInput = document.createElement('input') as HTMLInputElement;
      editInput.type = 'text';
      editInput.value = taskText.textContent || '';
      editInput.style.flex = '1';
      

      // Replace taskText with editInput in the parent
      const parent = taskText.parentElement;
      if (!parent) return;

      parent.replaceChild(editInput, taskText);
      editBtn.textContent = 'Save'; // Change button to save
      isEditing = true;

      // Track the current elements for save phase
      currentEditInput = editInput;
      currentTaskText = taskText;

    } else {
      // Save mode - after editing
      if (!currentEditInput || !currentTaskText) return; // Ensure currentEditInput and currentTaskText are not null

      const newTaskText = currentEditInput.value.trim();
      if (newTaskText === '') return; // Don't save if the input is empty

      // Replace input with the new task text
      currentTaskText.textContent = newTaskText;
      const parent = currentEditInput.parentElement;
      if (parent) {
        parent.replaceChild(currentTaskText, currentEditInput);
      }

      editBtn.textContent = 'Edit'; // Change back to edit button
      isEditing = false;

      // Save tasks after editing
      saveTasks();
    }
  });

  deleteBtn.addEventListener('click', () => {
    list.removeChild(listItem);
    updateCounts();
    saveTasks(); // Save after deletion
  });

  const leftSection = document.createElement('div') as HTMLDivElement;
  leftSection.style.display = 'flex';
  leftSection.style.alignItems = 'center';
  leftSection.style.flex = '1';
  leftSection.appendChild(checkbox);
  leftSection.appendChild(taskText);

  const rightSection = document.createElement('div') as HTMLDivElement;
  rightSection.appendChild(editBtn);
  rightSection.appendChild(deleteBtn);

  listItem.appendChild(leftSection);
  listItem.appendChild(rightSection);

  list.appendChild(listItem);

  updateCounts();
  saveTasks();
}

// Add task button
button.addEventListener('click', () => {
  const task = input.value.trim();
  const isCompleted = addCompletedCheckbox.checked;

  if (task !== '') {
    addTask(task, isCompleted);
    input.value = '';
    addCompletedCheckbox.checked = false;
  }
});

// Load tasks from localStorage when the page loads
loadTasks();

