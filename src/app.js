import domElements from './modules/domElements';
import { projectData } from './modules/todo';
import { Storage } from './modules/storage';
import { defaultProjects } from './modules/standard';

// Coordinates operations under the hood & DOM related ones
const App = (function () {
  function displayTaskList(project) {
    domElements.showProjectInterface(project); // Updates container
    const tasks = project.returnTasksArray();
    for (let i = 0; i < tasks.length; i++) {
      domElements.createTaskDiv(tasks[i]); // Appends tasks
    }
  }

  function displayProjects() {
    domElements.deleteGeneratedDivs('.userProject');
    const projects = projectData.getProjects();
    for (let i = 0; i < projects.length; i++) {
      domElements.createProjectDiv(projects[i]);
    }
  }

  function insertProject() {
    const projectInfo = domElements.getProjectData();
    const newEntry = projectData.createProject(projectInfo[0], projectInfo[1]);
    projectData.addProject(newEntry); // Store project
    displayProjects(); // Redisplay project list
    Storage.update(projectData.getProjects());
  }

  function insertTask(project) {
    const taskInfo = domElements.getTaskData();
    project.insertTask(taskInfo);
    domElements.updateTaskNumber(); // Updates number in top left of interface
    displayTaskList(project);
    Storage.update(projectData.getProjects());
  }

  // Changes completion status of a task
  function changeCompletedStatus(task, taskContainer) {
    if (task.completed === false) {
      taskContainer.classList.add('completed');
    } else taskContainer.classList.remove('completed');
    task.changeCompletion();
    Storage.update(projectData.getProjects());
  }

  function editTask(task) {
    const data = domElements.getTaskData(); // Extracts new data from the form
    task.editTask(data); // Update task
    domElements.selectActiveDiv(); // Refreshes current project
    Storage.update(projectData.getProjects());
  }

  function moveTask(task, direction, container) {
    domElements.moveDiv(task, direction, container);
    task.move(direction);
    Storage.update(projectData.getProjects());
  }

  function deleteTask(task, project) {
    task.deleteTask();
    displayTaskList(project);
    const activeProject = document.querySelector('.active'); // <<
    if (activeProject !== null) activeProject.click();
    else domElements.showProjectInterface(project);
    Storage.update(projectData.getProjects());
  }

  function deleteProject(project) {
    projectData.deleteProject(project.position);
    displayProjects(); // Reassigns project indexes to avoid problems
    Storage.update(projectData.getProjects());
  }

  function initializeDefaultProjects() {
    const standardProjects = defaultProjects.get();

    const homeDiv = document.querySelector('#home');
    const todayDiv = document.querySelector('#today');
    const urgentDiv = document.querySelector('#urgent');
    const standardProjectsDivs = [homeDiv, todayDiv, urgentDiv];

    standardProjectsDivs.forEach((stdProjDiv, index) => {
      stdProjDiv.addEventListener('click', () => {
        defaultProjects.clear(standardProjects[index]);
        defaultProjects.loadTasks();
        App.displayTaskList(standardProjects[index]);
        domElements.setActive(stdProjDiv);
        domElements.deleteAddTaskIcon();
        domElements.removeArrows();
      });
    });
  }

  function startUp() {
    const storedProjects = Storage.get();
    if (storedProjects) {
      projectData.uploadSaved(storedProjects);
      displayProjects();
    }
  }

  startUp();
  initializeDefaultProjects();

  return {
    insertProject,
    displayProjects,
    insertTask,
    editTask,
    deleteTask,
    moveTask,
    displayTaskList,
    changeCompletedStatus,
    deleteProject,
  };
}());

export default App;
