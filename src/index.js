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

  // Object to use for inheritance
  const projectMethods = {
    //TODO: FIX FOR INHERITANCE
    'insertTask': function() {
    // Extract the data of the task into an array
    const taskInfo = domElements.getTaskData();
    // Uses a factory to create the task
    const newTask = createTask(
      taskInfo[0],
      taskInfo[1],
      taskInfo[2],
      taskInfo[3]
    );
    // Assigns the task the position of its project so it can be retrieved later for deletion
    newTask.projectIndex = this.position;

    // Append the task to the project's task array
    this.tasks.push(newTask);
    },
    // Pass the task you want to delete
    'deleteTask':  function(task) {
      const indexOfTask = this.tasks.indexOf(task);
      // Removes the task from the project's task array
      this.tasks.splice(indexOfTask, 1);
      
      // Displays the project again
      this.displayProject();
    },
    'displayProject': function() {
      domElements.deleteGeneratedDivs('.taskEntry');
      const length = this.tasks.length;
      // Iterate over the task array
      for (let i = 0; i < length; i++) {
        // Get the task from the tasks array within the project
        const taskObject = this.tasks[i];
        // Information about what project the task is related to is now on the task itself
        taskObject.projectIndex = this.position;
        // Reassign task index to make sure everything is in place
        taskObject.taskIndex = i;
        // Creates the div and appends it to the task section
        taskObject.displayTask();
      }
   },
  }

  const taskMethods = {
    'editTask': function() {
      // Extract the data from the form
      const data = domElements.getTaskData();
      // Change the data of the object
      this.name = data[0];
      this.description = data[1];
      this.date = data[2];
      this.priority = data[3];
  
      // Update the local storage of the project array when a task is edited
      localStorageFunctions.updateStoredProjects();
      },
    'changeCompletion': function() {
        switch (true) {
          case this.completed === true:
            this.completed = false;
            break;
          case this.completed === false:
            this.completed = true;
        }
      },
      'displayTask': function() {
        domElements.createTaskDiv(this);
      },
  }

  // Factory function to create projects
  function createProject(name, icon) {
    // This will be an array of objects containing the tasks
    const tasks = [];
    // This will store the project's position in the array of projects
    const position = 0;
    // Signals that this project is not a predefined one, so user generated
    const standard = false;

    // Our project acquired its method through this line
    // It basically makes it point to the projectMethods object
    // So when that method is not found on the project itself
    // It refers back to that object, and carries out the task.
    let newProject = Object.create(projectMethods);

    // Assign properties to object
    newProject.name = name;
    newProject.icon = icon;
    newProject.tasks = tasks;
    newProject.position = position;
    newProject.standard = standard;

    return newProject;
  }

  // Factory function to create tasks
  function createTask(name, description, date, priority) {

    // This creates a new task using the taskMethod object as the prototype
    // This means the new task can use all of taskMethods's methods. Coolio.
    const newTask = Object.create(taskMethods);

    // Set properties on the new object
    newTask.name = name;
    newTask.description = description;
    newTask.date = date;
    newTask.priority = priority;
    newTask.completed = false;

    // Return
    return newTask;

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

  // This returns the project array for storing in localstorage
  function returnProjectsArray() {
    return projects;
  }

  // If a copy of the projects exist in storage, then copy it to replace the empty projects array
  // When the page first loads
  function updateFromLocalStorage(storedProjects) {
    projects = storedProjects;

    // Now our projects and tasks are lacking their original methods.
    // We use Object.assign to lump the two objects together
    for(let i = 0; i < projects.length; i++) {
      // The first loop will iterate through the projects
      projects[i] = Object.assign(projects[i], projectMethods);
      console.log(projects[i])

      // The second loop handles the tasks
      for(let k = 0; k < projects[i].tasks.length; k++) {
        projects[i].tasks[k] = Object.assign(projects[i].tasks[k], taskMethods);
        console.log(projects[i].tasks[k])
      }
    }


  }

  return {
    extractIcon,
    createProject,
    createTask,
    addProject,
    returnArrayLength,
    returnProject,
    deleteProject,
    returnProjectsArray,
    updateFromLocalStorage,
  };
})();

// This IIFE handles projects that exist for every user
const defaultProjects = (function () {
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
      domElements.setActive(homeDiv);
    });

    todayDiv.addEventListener('click', () => {
      clearStandardProjects();
      populateStandardProjects();
      domElements.showProjectInterface(today);
      domElements.deleteAddProjectIcon();
      domElements.setActive(todayDiv);
    });

    urgentDiv.addEventListener('click', () => {
      clearStandardProjects();
      populateStandardProjects();
      domElements.showProjectInterface(urgent);
      domElements.deleteAddProjectIcon();
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
