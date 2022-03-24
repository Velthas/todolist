import domElements from "./domElements";
import projectData from "./index.js"

//This is what directs the flow of the application, from appending projects to displaying them and deleting them.
const applicationFlow = (function () {

    //This adds the project to the appropriate array
    function insertProject () {
        // Extracts the data using the domElement function and uses a factory to create the project object
        const projectInfo = domElements.getProjectData();
        let newEntry = projectData.createProject(projectInfo[0],projectInfo[1]);
        //Pushes new object into projects array
        projectData.addProject(newEntry);
    }

    //This looks into the appropriate project and adds the task
    function insertTask (projectObject) {
        //Extract the data of the task into an array
        const taskInfo = domElements.getTaskData();
        //Uses a factory to create the task
        let newTask = projectData.createTask(taskInfo[0], taskInfo[1], taskInfo[2], taskInfo[3])
        //Looks into the array of projects in the given position and appends the new task to the task array
        projectData.addTask(projectObject.position, newTask);
        //Updates the number of tasks on the list
        const noOfTasks = document.querySelector('#taskCounter p');
        let number = (Number(noOfTasks.textContent.split(' ')[0])) + 1;
        noOfTasks.textContent = number + " Task(s)";
    }

    //This creates divs for all the projects in the sidebar, to be used each time a project is added or deleted
    function displayProjects () {
        //Always delete all the project divs before reappending them to avoid repetition
        //TODO: NOT REALLY IMPORTANT, BUT SEE IF YOU CAN ADD A WAY OF RETAINING WHICH PROJECT WAS ACTIVE
        //Current idea is, give the active object a property of active with a boolean value, only one can have the property at the time so each time a div is clicked you turn it off for everyone else except the one
        //This way you can retain and always find out which project was active before any other action was performed
        domElements.deleteGeneratedDivs('.userProject');
        let length = projectData.returnArrayLength();
        for (let i = 0; i < length; i++) {
            //Get the object from the projects array
            const projectObject = projectData.returnProject(i);
            //Assign the position so we know where it is on the array for deletion purposes later
            projectObject.position = i;
            //This creates the project div and adds the relevant event listeners
            //Important, this is what enables the task list to be displayed
            domElements.createProjectDiv(projectObject);

        }
    }

    function generateTaskList(projectObject) {
        domElements.deleteGeneratedDivs('.taskEntry')
        let length = projectObject.tasks.length;
        for (let i = 0; i < length; i++) {
            //Get the task from the tasks array within the project
            const taskObject = projectObject.tasks[i];
            taskObject.position = i;
            console.log(taskObject);

            domElements.createTaskDiv(taskObject, projectObject)
        }

    }

    //Toggles and untoggles completed status from tasks
    function changeCompletedStatus(taskObject, taskContainer) {
        switch (true) {
            case (taskObject.completed === true):
                taskObject.completed = false;
                taskContainer.classList.remove('completed')
                break;
            case (taskObject.completed === false):
                taskObject.completed = true;
                taskContainer.classList.add('completed')
        }
    }

    function deleteTask (taskObject, projectObject) {
        //Goes into project data and splices task array
        projectData.removeTask(projectObject.position, taskObject.position);
        //Regenerate task divs without the deleted one
        generateTaskList(projectObject);
        //Updates the number of tasks on the list
        const noOfTasks = document.querySelector('#taskCounter p');
        let number = (Number(noOfTasks.textContent.split(' ')[0])) - 1;
        noOfTasks.textContent = number + " Task(s)";
        
    }

    return {insertProject, displayProjects, insertTask, deleteTask, generateTaskList, changeCompletedStatus}

})();

export default applicationFlow;