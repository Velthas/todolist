import './style.css';
import './projectForm.css';
import './mediaQueries.css';

import { isToday } from 'date-fns';

import star from './images/star.svg';
import cards from './images/playing-cards.svg';
import shopping from './images/shopping-bag.svg';
import heart from './images/heart.svg';
import book from './images/book-alt.svg';

import homeIcon from './images/home.svg';
import todayIcon from './images/time-twenty-four.svg';
import urgentIcon from './images/engine-warning.svg';

import domElements from './domElements';
import applicationFlow from './applicationFlow';

const projectData = (function () {
  const icons = [star, cards, shopping, heart, book];
  let projects = [];

  const projectMethods = {
    insertTask() {
      const taskInfo = domElements.getTaskData();
      const newTask = createTask(
        taskInfo[0],
        taskInfo[1],
        taskInfo[2],
        taskInfo[3],
      );

      newTask.projectIndex = this.position;
      newTask.taskIndex = this.tasks.indexOf(newTask);

      this.tasks.push(newTask);
    },
    displayProject() {
      domElements.deleteGeneratedDivs('.taskEntry');
      const { length } = this.tasks;

      for (let i = 0; i < length; i++) {
        const taskObject = this.tasks[i];
        taskObject.projectIndex = this.position;
        taskObject.taskIndex = i;
        taskObject.displayTask();
      }
    },
  };

  const taskMethods = {
    editTask() {
      const data = domElements.getTaskData();
      [this.name, this.description, this.date, this.priority] = data;
    },
    deleteTask() {
      projects[this.projectIndex].tasks.splice(this.taskIndex, 1);
      updatePositions();
    },
    move(direction) {
      const project = projects[this.projectIndex];
      const task = this;

      this.deleteTask();
      const newPosition = direction === 'up' ? this.taskIndex - 1 : this.taskIndex + 1;
      project.tasks.splice(newPosition, 0, task);
      updatePositions();
    },
    changeCompletion() {
      this.completed = this.completed !== true;
    },
    displayTask() {
      domElements.createTaskDiv(this);
    },
  };

  // Factory for projects
  function createProject(name, icon) {
    const tasks = [];
    const position = 0;
    const standard = false;

    const newProject = Object.create(projectMethods);

    newProject.name = name;
    newProject.icon = icon;
    newProject.tasks = tasks;
    newProject.position = position;
    newProject.standard = standard;

    return newProject;
  }

  // Factory for tasks
  function createTask(name, description, date, priority) {
    const newTask = Object.create(taskMethods);

    newTask.name = name;
    newTask.description = description;
    newTask.date = date;
    newTask.priority = priority;
    newTask.completed = false;

    return newTask;
  }

  // Retrieve icon URL
  const extractIcon = (index) => icons[index];

  function addProject(projectObject) {
    projects.push(projectObject);
    projectObject.position = projects.length - 1;
  }

  const returnProject = (index) => projects[index];

  const returnArrayLength = () => projects.length;

  const deleteProject = (position) => projects.splice(position, 1);

  const returnProjectsArray = () => projects;

  function updatePositions() {
    for (let i = 0; i < projects.length; i++) {
      projects[i].position = i;

      for (let k = 0; k < projects[i].tasks.length; k++) {
        const task = projects[i].tasks[k];
        task.projectIndex = i;
        task.taskIndex = k;
      }
    }
  }

  function updateFromLocalStorage(storedProjects) {
    projects = storedProjects;

    for (let i = 0; i < projects.length; i++) {
      const objWithMethods = Object.create(projectMethods);
      projects[i] = Object.assign(objWithMethods, projects[i]);

      for (let k = 0; k < projects[i].tasks.length; k++) {
        const taskObjWithMethods = Object.create(taskMethods);
        projects[i].tasks[k] = Object.assign(taskObjWithMethods, projects[i].tasks[k]);
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
}());

const defaultProjects = (function () {
  // This version does not change the index of projects and tasks
  const displayDefaultProject = function () {
    domElements.deleteGeneratedDivs('.taskEntry');
    const { length } = this.tasks;
    for (let i = 0; i < length; i++) {
      const taskObject = this.tasks[i];
      taskObject.displayTask();
    }
  };

  // Three default projects as of today
  const home = projectData.createProject('Home', homeIcon);
  const today = projectData.createProject('Today', todayIcon);
  const urgent = projectData.createProject('Urgent', urgentIcon);
  const standardProjects = [home, today, urgent];
  standardProjects.forEach(proj => { proj.displayProject = displayDefaultProject; });

  function populateStandardProjects() {
    const projectsArrayLength = projectData.returnArrayLength();

    for (let i = 0; i < projectsArrayLength; i++) {
      const project = projectData.returnProject(i);

      for (let j = 0; j < project.tasks.length; j++) {
        const task = project.tasks[j];
        task.projectIndex = i;
        task.taskIndex = j;

        home.tasks.push(task); // All tasks are stored in home
        if (task.priority === 'high') urgent.tasks.push(task); // High priority in urgent
        if (isToday(new Date(task.date))) today.tasks.push(task); // Due today in today
      }
    }
  }

  // Used to clear before appending new tasks
  const clearStdProject = (stdProj) => { stdProj.tasks = []; };

  function bindEventListeners() {
    const homeDiv = document.querySelector('#home');
    const todayDiv = document.querySelector('#today');
    const urgentDiv = document.querySelector('#urgent');
    const standardProjectsDivs = [homeDiv, todayDiv, urgentDiv];

    standardProjectsDivs.forEach((stdProjDiv, index) => {
      stdProjDiv.addEventListener('click', () => {
        clearStdProject(standardProjects[index]);
        populateStandardProjects();
        applicationFlow.displayTaskList(standardProjects[index]);
        domElements.setActive(stdProjDiv);
        domElements.deleteAddTaskIcon();
        domElements.removeArrows();
      });
    });
  }

  function addImages() {
    const homeImg = document.querySelector('#home img');
    const urgentImg = document.querySelector('#urgent img');
    const todayImg = document.querySelector('#today img');

    homeImg.src = homeIcon;
    urgentImg.src = urgentIcon;
    todayImg.src = todayIcon;
  }

  addImages();
  bindEventListeners();
}());

const localStorageFunctions = (function () {
  function updateStoredProjects() {
    const array = projectData.returnProjectsArray();
    localStorage.setItem('projects', JSON.stringify(array));
  }

  if (!localStorage.getItem('projects')) {
    updateStoredProjects();
  } else {
    const storedProjects = JSON.parse(localStorage.getItem('projects'));
    projectData.updateFromLocalStorage(storedProjects);
    applicationFlow.displayProjects();
  }

  return { updateStoredProjects };
}());

export { projectData, localStorageFunctions };
