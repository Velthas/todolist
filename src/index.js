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

    // Inform us of where the task is in the task array for manipulation later
    newTask.taskIndex = this.tasks.indexOf(newTask);
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
    // Pass the task you want to delete
    'deleteTask':  function() {
      // Uses the project index and task index we stored to delete the task
      projects[this.projectIndex].tasks.splice(this.taskIndex, 1);
    },
    'move': function(direction) {
            // Get its project
            const project = projects[this.projectIndex];
            // Make a copy of the task
            const task = this;
            //Deletes the task from its original position
            this.deleteTask();
            // Get the new location index
            const newPosition = direction === 'up' ? this.taskIndex - 1 : this.taskIndex + 1;
            // Use splice to insert our task at the appropriate position.
            project.tasks.splice(newPosition, 0, task);
            // Update position
            updatePositions();
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
    // It basically creates a new empty object that points to ProjectMethods
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

    // This creates a new task using the taskMethod object as the ''prototype''
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
    // Specifies where it is in the project array
    let position = projects.indexOf(projectObject);
    projectObject.position = position;
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
    // For safety reasons, just return a copy of it;
    const copyOfProjects = projects;
    return copyOfProjects;
  }

  // This function replaces the position, taskIndex and projectIdex values
  // When a task is deleted or moved, we need to do this to prevent mix-ups
  function updatePositions() {
    for(let i = 0; i < projects.length; i++) {
      projects[i].position = i;
      for(let k = 0; k < projects[i].tasks.length; k++){

        const task = projects[i].tasks[k];
        task.projectIndex = i;
        task.taskIndex = k;
      }
    }
  }

  // If a copy of the projects exist in storage, then copy it to replace the empty projects array
  // When the page first loads
  function updateFromLocalStorage(storedProjects) {
    projects = storedProjects;

    // Now our projects and tasks are lacking their original methods.
    // My logic is: create a new object that points to the objet with methods.
    // Then lump all the properties of the 'real' project or task object with that one.
    // That way, we will have an object that is capable of inheriting those methods
    // And at the same time preserve all of the original info. 
    // We can join the two objects using Object.assign.
    for(let i = 0; i < projects.length; i++) {
      // The first loop will iterate through the projects
      const objWithMethods = Object.create(projectMethods);
      projects[i] = Object.assign(objWithMethods, projects[i]);

      // The second loop handles the tasks
      for(let k = 0; k < projects[i].tasks.length; k++) {
        const taskObjWithMethods = Object.create(taskMethods);
        projects[i].tasks[k] = Object.assign(taskObjWithMethods, projects[i].tasks[k]);
      }
    }
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
    returnArrayLength,
    returnProject,
    deleteProject,
    returnProjectsArray,
    updateFromLocalStorage,
    changeTaskPosition,
  };
})();

// This IIFE handles projects that exist for every user
const defaultProjects = (function () {

  // This is a copy of the displayProject function method of projects
  // It only serves to trick the applicationFlow function into
  // Thinking it's dealing with a real project 
    const displayProject = function() {
        domElements.deleteGeneratedDivs('.taskEntry');
        const length = this.tasks.length;
        // Iterate over the task array
        for (let i = 0; i < length; i++) {
        // Get the task from the tasks array within the project
        const taskObject = this.tasks[i];

        //Notice how this copy of the function does not change taskIndex nor projectIndex
        // Creates the div and appends it to the task section
        taskObject.displayTask();
      }
    }

  // Home holds all tasks regardless of urgency
  const home = {
    name: 'Home',
    icon: homeIcon,
    tasks: [],
    standard: true,
    'displayProject': displayProject,
  };
  // Gathers all the projects that are due today
  const today = {
    name: 'Today',
    icon: todayIcon,
    tasks: [],
    standard: true,
    'displayProject': displayProject,
  };
  // Gathers all the tasks with high priority
  const urgent = {
    name: 'Urgent',
    icon: urgentIcon,
    tasks: [],
    standard: true,
    'displayProject': displayProject,
  };

  // This functions stores all the tasks inside the standard projects
  // It looks at all the tasks and sorts them after verifying conditions
  function populateStandardProjects() {
    const projectsArrayLength = projectData.returnArrayLength();

    // Loop over each project, and then their entire tasklist
    for (let i = 0; i < projectsArrayLength; i++) {
      const project = projectData.returnProject(i);

      for (let j = 0; j < project.tasks.length; j++) {
        // Store here to avoid pointless repetition
        const task = project.tasks[j];

        // Keep track of the project index and task index
        // Just a failsafe at this point because we have them already stored and safe
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

  // I use this function to clear the storage each time
  // This way we avoid task being reappended infinitely 
  function clearStandardProjects() {
    home.tasks = [];
    today.tasks = [];
    urgent.tasks = [];
  }

  // Standard projects are already hard coded into the html
  // So we need to bind their respective objects to them
  // Since it's just three, we can do so manually
  function bindEventListeners() {
    const homeDiv = document.querySelector('#home');
    const todayDiv = document.querySelector('#today');
    const urgentDiv = document.querySelector('#urgent');
   

    homeDiv.addEventListener('click', () => {
      clearStandardProjects();
      populateStandardProjects();
      applicationFlow.displayTaskList(home);
      domElements.deleteAddProjectIcon();
      domElements.removeArrows();
      domElements.setActive(homeDiv);
      domElements.removeArrows();
    });

    todayDiv.addEventListener('click', () => {
      clearStandardProjects();
      populateStandardProjects();
      applicationFlow.displayTaskList(today);
      domElements.deleteAddProjectIcon();
      domElements.removeArrows();
      domElements.setActive(todayDiv);
      domElements.removeArrows();
    });

    urgentDiv.addEventListener('click', () => {
      clearStandardProjects();
      populateStandardProjects();
      applicationFlow.displayTaskList(urgent);
      domElements.deleteAddProjectIcon();
      domElements.removeArrows();
      domElements.setActive(urgentDiv);
      domElements.removeArrows();
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
