/* eslint-disable wrap-iife */
// Importing style sheets
import './style.css';
import './projectForm.css';
import './mediaQueries.css';

// Need this for standard projects
import { isToday } from 'date-fns';

// This is for project icons
import star from './images/star.svg';
import cards from './images/playing-cards.svg';
import shopping from './images/shopping-bag.svg';
import heart from './images/heart.svg';
import book from './images/book-alt.svg';

//  This is for standard project icons
import homeIcon from './images/home.svg';
import todayIcon from './images/time-twenty-four.svg';
import urgentIcon from './images/engine-warning.svg';

// Modules
import domElements from './domElements';
import applicationFlow from './applicationFlow';

// This is where the project info is segregated
const projectData = (function () {
  // Array with icon urls
  const icons = [star, cards, shopping, heart, book];
  // The one array with projects
  let projects = [];

  // Factory functions to create projects
  function createProject(name, icon) {
    // This will be an array of objects containing the tasks
    const tasks = [];
    // This will tell us at what position the array is and will be reassigned dynamically
    const position = 0;

    return {
      name,
      icon,
      tasks,
      position,
    };
  }

  // Factory function to create tasks
  function createTask(name, description, date, priority) {
    // Completed will be useful later and position is to once again identify and delete tasks
    return {
      name,
      description,
      date,
      priority,
      completed: false,
    };
  }

  // Used in combination with radio buttons to retrieve icon URL
  function extractIcon(index) {
    return icons[index];
  }

  // This pushes new project into the projects
  function addProject(projectObject) {
    projects.push(projectObject);
  }

  // Use this to service the project to a for loop for display
  function returnProject(index) {
    return projects[index];
  }

  // Returns lenght of array
  function returnArrayLength() {
    return projects.length;
  }

  // Remove a project from the project array
  function deleteProject(position) {
    projects.splice(position, 1);
  }

  // Adds new task to the project at the specified index
  function addTask(index, newTask) {
    projects[index].tasks.push(newTask);
  }

  // Removes a task by looking at the tasks array of a project and splicing the array
  function removeTask(objectIndex, taskIndex) {
    projects[objectIndex].tasks.splice(taskIndex, 1);
  }

  // After a task is edited, the old one is replaced with the new one
  function replaceEditedTask(task) {
    projects[task.projectIndex].tasks[task.taskIndex] = task;
  }

  // This returns the project array for storing in localstorage
  function returnProjectsArray() {
    return projects;
  }

  // If a copy of the projects exist in storage, then copy it to replace the empty projects array
  // When the page first loads
  function updateFromLocalStorage(storedProjects) {
    projects = storedProjects;
  }

  function changeTaskPosition(task, newlocationindex) {
    //First, deletes the task from its original position
    removeTask(task.projectIndex, task.taskIndex);
    const project = returnProject(task.projectIndex);
    project.tasks.splice(newlocationindex, 0, task);
}

  return {
    extractIcon,
    createProject,
    createTask,
    addProject,
    addTask,
    removeTask,
    returnArrayLength,
    returnProject,
    deleteProject,
    replaceEditedTask,
    returnProjectsArray,
    updateFromLocalStorage,
    changeTaskPosition,
  };
})();

// This IIFE handles projects that exist for every user
const defaultProjects = (function () {
  // Notice how standard projects have a property of standard
  // Home holds all tasks regardless of urgency
  const home = {
    name: 'Home',
    icon: homeIcon,
    tasks: [],
    standard: true,
  };
  // Gathers all the projects that are due today
  const today = {
    name: 'Today',
    icon: todayIcon,
    tasks: [],
    standard: true,
  };
  // Gathers all the tasks with high priority
  const urgent = {
    name: 'Urgent',
    icon: urgentIcon,
    tasks: [],
    standard: true,
  };

  function populateStandardProjects() {
    const projectsArrayLength = projectData.returnArrayLength();

    // Loop over each project, and then their entire tasklist
    for (let i = 0; i < projectsArrayLength; i++) {
      const project = projectData.returnProject(i);

      for (let j = 0; j < project.tasks.length; j++) {
        // Store here to avoid pointless repetition
        const task = project.tasks[j];
        // Keep track of the project index and task index
        task.projectIndex = i;
        task.taskIndex = j;

        // Push into home regardless of anything
        home.tasks.push(task);

        // Not using break statements here because a task might be in different standard projects
        if (task.priority === 'high') urgent.tasks.push(task);
        if (isToday(new Date(task.date))) today.tasks.push(task);
      }
    }
  }

  function clearStandardProjects() {
    home.tasks = [];
    today.tasks = [];
    urgent.tasks = [];
  }

  function bindEventListeners() {
    const homeDiv = document.querySelector('#home');
    const todayDiv = document.querySelector('#today');
    const urgentDiv = document.querySelector('#urgent');

    homeDiv.addEventListener('click', () => {
      clearStandardProjects();
      populateStandardProjects();
      domElements.showProjectInterface(home);
      domElements.deleteAddProjectIcon();
      domElements.removeArrows();
      domElements.setActive(homeDiv);
    });

    todayDiv.addEventListener('click', () => {
      clearStandardProjects();
      populateStandardProjects();
      domElements.showProjectInterface(today);
      domElements.deleteAddProjectIcon();
      domElements.removeArrows();
      domElements.setActive(todayDiv);
    });

    urgentDiv.addEventListener('click', () => {
      clearStandardProjects();
      populateStandardProjects();
      domElements.showProjectInterface(urgent);
      domElements.deleteAddProjectIcon();
      domElements.removeArrows();
      domElements.setActive(urgentDiv);
    });
  }

  // Standard project images have to be loaded manually, else they won't show
  function addImages() {
    const homeImg = document.querySelector('#home img');
    homeImg.src = homeIcon;

    const urgentImg = document.querySelector('#urgent img');
    urgentImg.src = urgentIcon;

    const todayImg = document.querySelector('#today img');
    todayImg.src = todayIcon;
  }

  addImages();
  bindEventListeners();
})();

const localStorageFunctions = (function () {
  // Retrieves a copy of stored projects, stringifies them and stores them in localstorage.
  function updateStoredProjects() {
    // First get a copy of the array from projectData
    const array = projectData.returnProjectsArray();
    // Then stringify the array using the JSON function for storage.
    // Objects and functions must be converted to string to store in json format
    localStorage.setItem('projects', JSON.stringify(array));
  }

  // Check if the projects array is already in local storage on page load
  // If it isn't, add it through setItem.
  if (!localStorage.getItem('projects')) {
    updateStoredProjects();
  } else {
    // If projects are in storage, parse the stringified array using the JSON function parse
    const storedProjects = JSON.parse(localStorage.getItem('projects'));
    // This function replaces the empty array with the parsed one
    projectData.updateFromLocalStorage(storedProjects);
    applicationFlow.displayProjects();
  }

  return { updateStoredProjects };
})();

export { projectData, localStorageFunctions };
