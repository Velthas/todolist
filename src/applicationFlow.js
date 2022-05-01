/* eslint-disable wrap-iife */
import domElements from './domElements';
import { projectData, localStorageFunctions } from './index';

// Links together project data with dom manipulation functions.
const applicationFlow = (function () {
  // This adds the project to the appropriate array
  function insertProject() {
    // Extracts the data from the project form in an array
    const projectInfo = domElements.getProjectData();
    const newEntry = projectData.createProject(projectInfo[0], projectInfo[1]);
    // Pushes new object into projects array
    projectData.addProject(newEntry);

    // This updates localStorage upon project insertion
    localStorageFunctions.updateStoredProjects();
  }

  // This looks into the appropriate project and adds the task
  function insertTask(projectObject) {
    // Extract the data of the task into an array
    const taskInfo = domElements.getTaskData();
    // Uses a factory to create the task
    const newTask = projectData.createTask(
      taskInfo[0],
      taskInfo[1],
      taskInfo[2],
      taskInfo[3]
    );
    // Assigns the task the position of its project so it can be retrieved later for deletion
    newTask.projectIndex = projectObject.position;
    // Append the task to the appropriate project
    projectData.addTask(newTask.projectIndex, newTask);
    // Updates the number of tasks on the list
    const noOfTasks = document.querySelector('#taskCounter p');
    const number = Number(noOfTasks.textContent.split(' ')[0]) + 1;
    noOfTasks.textContent = number + ' Task(s)';

    // This updates the local storage upon task insertion
    localStorageFunctions.updateStoredProjects();
  }

  // Generates project divs to be appended on the sidebar
  function displayProjects() {
    // Always delete all the project divs before reappending them to avoid repetition
    domElements.deleteGeneratedDivs('.userProject');
    const length = projectData.returnArrayLength();
    for (let i = 0; i < length; i++) {
      // Get the object from the projects array
      const projectObject = projectData.returnProject(i);
      // Assign the position so we know where it is on the array for deletion purposes later
      projectObject.position = i;
      // This creates the project div and adds the relevant event listeners
      // Important, this is what enables the task list to be displayed
      domElements.createProjectDiv(projectObject);
    }
  }

  function generateTaskList(projectObject) {
    domElements.deleteGeneratedDivs('.taskEntry');
    const length = projectObject.tasks.length;
    for (let i = 0; i < length; i++) {
      // Get the task from the tasks array within the project
      const taskObject = projectObject.tasks[i];
      // This fixes a problem with standard projects
      // Standard projects do not have a natural position attribute
      // And we still need a way to find the original project of the task
      // eslint-disable-next-line max-len
      taskObject.projectIndex =
        projectObject.standard === true
          ? taskObject.projectIndex
          : projectObject.position;
      // Standard projects have a skewed taskIndex value because it holds info from different projects
      taskObject.taskIndex =
        projectObject.standard === true ? taskObject.taskIndex : i;

      domElements.createTaskDiv(taskObject);
    }
  }

  // Toggles and untoggles completed status from tasks
  function changeCompletedStatus(taskObject, taskContainer) {
    // eslint-disable-next-line default-case
    switch (true) {
      case taskObject.completed === true:
        // eslint-disable-next-line no-param-reassign
        taskObject.completed = false;
        taskContainer.classList.remove('completed');
        break;
      case taskObject.completed === false:
        // eslint-disable-next-line no-param-reassign
        taskObject.completed = true;
        taskContainer.classList.add('completed');
    }
  }

  function editTask(taskObject) {
    // Extract the data from the form
    const data = domElements.getTaskData();
    // Change the data of the object
    taskObject.name = data[0];
    taskObject.description = data[1];
    taskObject.date = data[2];
    taskObject.priority = data[3];

    projectData.replaceEditedTask(taskObject);

    // Update the local storage of the project array when a task is edited
    localStorageFunctions.updateStoredProjects();
  }

  function moveTask(direction, task) {
    if (direction === 'up') {
        if (task.taskIndex === 0) return
        else {
            let newUpPosition = task.taskIndex - 1;
            projectData.changeTaskPosition(task, newUpPosition);
        }
    }
    else if (direction === 'down') {
        if (task.taskIndex === projectData.returnProject(task.projectIndex).tasks.length) return
        else {
            let newDownPosition = task.taskIndex + 1;
            projectData.changeTaskPosition(task, newDownPosition);
        }
    }

    localStorageFunctions.updateStoredProjects();
}

  function deleteTask(taskObject, projectObject) {
    // Goes into project data and splices task array
    projectData.removeTask(taskObject.projectIndex, taskObject.taskIndex);

    // Regenerate task divs without the deleted one
    const activeProject = document.querySelector('.active');
    if (activeProject !== null) activeProject.click();
    else domElements.showProjectInterface(projectObject);

    // Update the local storage when a task is deleted
    localStorageFunctions.updateStoredProjects();
  }

  return {
    insertProject,
    displayProjects,
    insertTask,
    editTask,
    deleteTask,
    generateTaskList,
    changeCompletedStatus,
    moveTask,
  };
})();

export default applicationFlow;
