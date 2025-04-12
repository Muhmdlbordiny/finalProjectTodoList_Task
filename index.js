document.body.style.backgroundColor = "#111";
document.body.style.color = "white";
var elements = document.createElement('h1');
elements.textContent = "Todo List Tasks ";
elements.style.textAlign = 'center';
elements.style.margin = '0';
elements.style.width = '100%';
document.body.append(elements);
// Create container
var container = document.createElement('div');
container.style.maxWidth = '100%';
container.style.margin = '50px auto';
container.style.fontFamily = 'Arial, sans-serif';
container.style.backgroundColor = "black";
container.style.margin = "10px";
// Input group
var inputGroup = document.createElement('div');
inputGroup.style.display = 'flex';
inputGroup.style.alignItems = 'center';
inputGroup.style.gap = '10px';
var addCompletedCheckbox = document.createElement('input');
addCompletedCheckbox.type = 'checkbox';
addCompletedCheckbox.title = 'Mark as completed';
var input = document.createElement('input');
input.style.color = 'black';
input.style.backgroundColor = "#facf23";
input.type = 'text';
input.placeholder = 'Add a new task...';
input.style.flex = '1';
input.style.padding = '10px';
var button = document.createElement('button');
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
var list = document.createElement('ul');
list.style.listStyle = 'none';
list.style.padding = '0';
list.style.marginTop = '10px';
// Counter at bottom
var countDisplay = document.createElement('li');
countDisplay.style.marginTop = '15px';
countDisplay.style.fontWeight = 'bold';
countDisplay.style.paddingTop = '10px';
countDisplay.style.border = '2px solid #ff6528';
countDisplay.style.padding = '10px';
countDisplay.style.alignItems = 'center';
countDisplay.style.textAlign = 'center';
// Append all
container.appendChild(inputGroup);
container.appendChild(list);
document.body.appendChild(container);
// --- Update Count Logic ---
function updateCounts() {
    var allTasks = Array.from(list.children).filter(function (li) { return li !== countDisplay; });
    var completed = allTasks.filter(function (li) {
        var checkbox = li.querySelector('input[type="checkbox"]');
        return checkbox === null || checkbox === void 0 ? void 0 : checkbox.checked;
    }).length;
    var notCompleted = allTasks.length - completed;
    countDisplay.textContent = "\u2705 Completed: ".concat(completed, " | \u274C Not Completed: ").concat(notCompleted);
    // Always move countDisplay to bottom
    list.appendChild(countDisplay);
}
// --- Load Tasks from localStorage ---
function loadTasks() {
    var savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    savedTasks.forEach(function (task) {
        addTask(task.text, task.iscompleted);
    });
}
function saveTasks() {
    var tasks = [];
    var allTasks = Array.from(list.children).filter(function (li) { return li !== countDisplay; });
    allTasks.forEach(function (li) {
        var checkbox = li.querySelector('input[type="checkbox"]');
        var taskText = li.querySelector('span');
        tasks.push({
            text: taskText.textContent || '',
            iscompleted: checkbox.checked
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
// --- Add Task ---
function addTask(task, isCompleted) {
    var listItem = document.createElement('li');
    listItem.style.padding = '10px';
    listItem.style.border = '1px solid #ccc';
    listItem.style.marginTop = '5px';
    listItem.style.display = 'flex';
    listItem.style.alignItems = 'center';
    listItem.style.justifyContent = 'space-between';
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = isCompleted;
    checkbox.style.marginRight = '10px';
    var taskText = document.createElement('span');
    taskText.textContent = task;
    taskText.style.flex = '1';
    if (isCompleted) {
        taskText.style.textDecoration = 'line-through';
        taskText.style.opacity = '0.6';
    }
    checkbox.addEventListener('change', function () {
        var checked = checkbox.checked;
        taskText.style.textDecoration = checked ? 'line-through' : 'none';
        taskText.style.opacity = checked ? '0.6' : '1';
        updateCounts();
        saveTasks();
    });
    var editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.style.marginLeft = '10px';
    editBtn.style.cursor = 'pointer';
    editBtn.style.width = '70px';
    editBtn.style.backgroundColor = '#8743a8';
    editBtn.style.color = 'white';
    editBtn.style.borderRadius = '8px';
    var deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.style.marginLeft = '5px';
    deleteBtn.style.width = '70px';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.style.backgroundColor = '#8743a8';
    deleteBtn.style.color = 'white';
    deleteBtn.style.borderRadius = '8px';
    var isEditing = false;
    var currentEditInput = null;
    var currentTaskText = null;
    editBtn.addEventListener('click', function () {
        if (!isEditing) {
            // Enter edit mode
            var editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.value = taskText.textContent || '';
            editInput.style.flex = '1';
            // Replace taskText with editInput in the parent
            var parent_1 = taskText.parentElement;
            if (!parent_1)
                return;
            parent_1.replaceChild(editInput, taskText);
            editBtn.textContent = 'Save'; // Change button to save
            isEditing = true;
            // Track the current elements for save phase
            currentEditInput = editInput;
            currentTaskText = taskText;
        }
        else {
            // Save mode - after editing
            if (!currentEditInput || !currentTaskText)
                return; // Ensure currentEditInput and currentTaskText are not null
            var newTaskText = currentEditInput.value.trim();
            if (newTaskText === '')
                return; // Don't save if the input is empty
            // Replace input with the new task text
            currentTaskText.textContent = newTaskText;
            var parent_2 = currentEditInput.parentElement;
            if (parent_2) {
                parent_2.replaceChild(currentTaskText, currentEditInput);
            }
            editBtn.textContent = 'Edit'; // Change back to edit button
            isEditing = false;
            // Save tasks after editing
            saveTasks();
        }
    });
    deleteBtn.addEventListener('click', function () {
        list.removeChild(listItem);
        updateCounts();
        saveTasks(); // Save after deletion
    });
    var leftSection = document.createElement('div');
    leftSection.style.display = 'flex';
    leftSection.style.alignItems = 'center';
    leftSection.style.flex = '1';
    leftSection.appendChild(checkbox);
    leftSection.appendChild(taskText);
    var rightSection = document.createElement('div');
    rightSection.appendChild(editBtn);
    rightSection.appendChild(deleteBtn);
    listItem.appendChild(leftSection);
    listItem.appendChild(rightSection);
    list.appendChild(listItem);
    updateCounts();
    saveTasks();
}
// Add task button
button.addEventListener('click', function () {
    var task = input.value.trim();
    var isCompleted = addCompletedCheckbox.checked;
    if (task !== '') {
        addTask(task, isCompleted);
        input.value = '';
        addCompletedCheckbox.checked = false;
    }
});
// Load tasks from localStorage when the page loads
loadTasks();
