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
    // This method gathers the task's info from the form
    // Then appends it to the project the method is used on
    projectObject.insertTask();

    // Updates the task counter on the HTML project interface
    domElements.updateTaskNumber();

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

  // Creates the structure to hold the task list
  // Then appends each task individually using the project's method.
  function displayTaskList(projectObject) {

    // This function creates the html structure to support the project
    domElements.showProjectInterface(projectObject);

    // This method looks through the task array
    // Then appends the tasks to the task list interface
    projectObject.displayProject();
  }

  // Toggles and untoggles completed status from tasks
  function changeCompletedStatus(taskObject, taskContainer) {

    if (taskObject.completed === false) taskContainer.classList.add('completed');
    else taskContainer.classList.remove('completed');

    // Changes the completion status of a task under the hood
    taskObject.changeCompletion();
    
  }

  // Function to edit the content of an existing task
  function editTask(taskObject) {
    
    // This method edits the task's content
    taskObject.editTask();

    // Update the local storage of the project array when a task is edited
    localStorageFunctions.updateStoredProjects();
  }

  // This function is to enable task moving functionality
  function moveTask(direction, task) {
    // Move the task inside the task array of the project
    task.move(direction);

    // Update local storage
    localStorageFunctions.updateStoredProjects();

}

  function deleteTask(taskObject, projectObject) {

    // Delete the task from the project.
    taskObject.deleteTask();

    // Refresh the list
    displayTaskList(projectObject);

    // Regenerate task divs without the deleted one
    const activeProject = document.querySelector('.active');
    if (activeProject !== null) activeProject.click();
    else domElements.showProjectInterface(projectObject);

    // Update the local storage when a task is deleted
    localStorageFunctions.updateStoredProjects();
  }

  function deleteProject(projectObject) {

    //This function deletes the chosen project from the project array.
    projectData.deleteProject(projectObject.position);

    // Indexes are now shifted and position properties' value no longer accurate
    // So it is fitting to display the projects again, as that reassigns the position.
    displayProjects();

    // Update the local storage of the project array when a project is deleted
    localStorageFunctions.updateStoredProjects();
  }

  return {
    insertProject,
    displayProjects,
    insertTask,
    editTask,
    deleteTask,
    moveTask,
    displayTaskList,
    changeCompletedStatus,
    deleteProject
  };
})();

export default applicationFlow;
