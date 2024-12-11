// Elements
var searchInput = document.getElementById("search_input");
var addBtn = document.getElementById("btn_add");
var addTask = document.getElementById("btn_addTask");
var formAddTask = document.getElementById("form_add");
var popUp = document.getElementById("popup");
var updateBtn = document.getElementById("btn_updateTask");
var iconMood = document.getElementById("icon_mood");

// inputs Element
var sectionInput = document.getElementById("section");
var categoryInput = document.getElementById("category");
var titleInput = document.getElementById("title");
var descInput = document.getElementById("description");

// Variables
var tasks = JSON.parse(localStorage.getItem("tasks")) || [];

var taskCategory = {
    nextUp: document.getElementById("nextUp"),
    inProgress: document.getElementById("inProgress"),
    done: document.getElementById("done"),
}
display();

// Functions
function addNewTask() {
    if (sectionInput.value !== "" && categoryInput.value !== "" && titleInput.value !== "" && descInput.value !== "") {
        var taskObj = {
            section: sectionInput.value,
            category: categoryInput.value,
            title: titleInput.value,
            desc: descInput.value,
        }
        tasks.push(taskObj);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        display();
        updateCounter(taskObj.section); // Update the counter for the section after adding a task
        formAddTask.classList.replace("d-flex", "d-none");
        reset();
    } else {
        popUp.classList.replace("d-none", "d-flex");
        setTimeout(() => {
            popUp.classList.replace("d-flex", "d-none");
        }, 2000);
    }
}

function display(filteredTasks) {
    for (let key in taskCategory) {
        taskCategory[key].querySelector(".tasks").innerHTML = "";
    }
     // If no filtered tasks are provided, show all tasks
    const tasksToDisplay = filteredTasks || tasks;
    for(var i = 0; i < tasksToDisplay.length; i++){
        var newTask = `
        <div
        class="item_caption d-flex flex-column justify-content-start align-items-start row-gap-2 rounded-4 m-auto mt-2 mb-2 p-3"
        >
            <h3 class="fs-4">${tasksToDisplay[i].title}</h3>
            <p class="mb-0">${tasksToDisplay[i].desc}</p>
            <span class="text-dark category ${tasksToDisplay[i].category}">${tasksToDisplay[i].category}</span>
            <div
                class="icons d-flex justify-content-center align-items-center column-gap-2 mt-2"
            >
                <i onclick="serUpdateTask(${i})" class="fa-solid fa-pen-to-square fa-bounce" style="color: #74C0FC;"></i>
                <i onclick="deleteTask(${i})" class="fa-solid fa-trash fa-shake" style="color: #FFD43B;"></i>
            </div>
        </div>
        `

        taskCategory[tasksToDisplay[i].section].querySelector(".tasks").innerHTML += newTask;
    }
    updateCounterForAllSections();

}

function deleteTask(index) {
    const taskSection = tasks[index].section; // Get the section of the task being deleted

    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    display();
    // Update the counter for the section after task deletion
    updateCounter(taskSection);
}

// Function to update the counter for a specific section
function updateCounter(section) {
    const sectionTasks = tasks.filter(task => task.section === section); // Filter tasks by section
    const counterElement = document.getElementById(`counter-${section}`);
    // console.log(counterElement);
    counterElement.innerHTML = sectionTasks.length; // Update counter with the number of tasks in that section
}

// Function to update the counters for all sections
function updateCounterForAllSections() {
    for (let section in taskCategory) {
        updateCounter(section);
    }
}

var indexItem;

function serUpdateTask(index) {
    indexItem = index;
    formAddTask.classList.replace("d-none", "d-flex");
    
    sectionInput.value = tasks[index].section;
    categoryInput.value = tasks[index].category;
    titleInput.value = tasks[index].title;
    descInput.value = tasks[index].desc;
    
    updateBtn.classList.replace("d-none", "d-block");
    addTask.classList.replace("d-block", "d-none");
}

function updateTask() {
    tasks[indexItem].section = sectionInput.value
    tasks[indexItem].category = categoryInput.value
    tasks[indexItem].title = titleInput.value
    tasks[indexItem].desc = descInput.value

    formAddTask.classList.replace("d-flex", "d-none");

    localStorage.setItem("tasks", JSON.stringify(tasks));
    display();

    updateBtn.classList.replace("d-block", "d-none");
    addTask.classList.replace("d-none", "d-block");
    reset();
}

function searchTask() {
    var text = searchInput.value.toLowerCase(); // Get the search input and convert it to lowercase for case-insensitive comparison

    // Filter the tasks based on the search query
    var filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(text));

    // If the search input is empty, display all tasks, otherwise display only the filtered tasks
    if (text === "") {
        display();  // Display all tasks if search is cleared
    } else {
        // Display the filtered tasks
        display(filteredTasks); 
    }
}

function reset() {
    sectionInput.value = "";
    categoryInput.value = "";
    titleInput.value = "";
    descInput.value = "";
}

// Events
searchInput.addEventListener("input",searchTask )

addBtn.addEventListener("click", function () {
    formAddTask.classList.replace("d-none", "d-flex");
});

formAddTask.addEventListener("click", function (e) {
    if (e.target.id == "form_add") {
        formAddTask.classList.replace("d-flex", "d-none");
    }
})

const body = document.body;

// Check for the saved theme in localStorage
let currentTheme = localStorage.getItem('theme') || 'light'; // Defaults to light if no theme is saved
body.setAttribute('data-theme', currentTheme); // Set the current theme on page load

// Add event listener to toggle theme when icon is clicked
iconMood.addEventListener('click', function() {
    if(iconMood.classList.contains("fa-lightbulb")){
        iconMood.classList.replace("fa-lightbulb", "fa-moon");
    }else{
        iconMood.classList.replace("fa-moon", "fa-lightbulb");
    }
    // Toggle between 'light' and 'dark' theme
    if (body.getAttribute('data-theme') === 'dark') {
        body.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light'); // Save the light theme to localStorage
    } else {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark'); // Save the dark theme to localStorage
    }
});
