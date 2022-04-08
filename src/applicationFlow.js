import domElements from "./domElements";
import {projectData} from "./index.js"
import {localStorageFunctions} from "./index.js"

//This is what directs the flow of the application, from appending projects to displaying them and deleting them.
const applicationFlow = (function () {

    //This adds the project to the appropriate array
    function insertProject () {
        // Extracts the data using the domElement function and uses a factory to create the project object
        const projectInfo = domElements.getProjectData();
        let newEntry = projectData.createProject(projectInfo[0],projectInfo[1]);
        console.log(newEntry);
        //Pushes new object into projects array
        projectData.addProject(newEntry);

        //This updates localStorage upon project insertion
        localStorageFunctions.updateStoredProjects();
    }

    //This looks into the appropriate project and adds the task
    function insertTask (projectObject) {
        //Extract the data of the task into an array
        const taskInfo = domElements.getTaskData();
        //Uses a factory to create the task
        let newTask = projectData.createTask(taskInfo[0], taskInfo[1], taskInfo[2], taskInfo[3])
        //Assigns the task the position of its project so it can be retrieved later for deletion
        newTask.projectIndex = projectObject.position;
        //Looks into the array of projects in the given position and appends the new task to the task array
        projectData.addTask(newTask.projectIndex, newTask);
        //Updates the number of tasks on the list
        const noOfTasks = document.querySelector('#taskCounter p');
        let number = (Number(noOfTasks.textContent.split(' ')[0])) + 1;
        noOfTasks.textContent = number + " Task(s)";

        //This updates the local storage upon task insertion
        localStorageFunctions.updateStoredProjects();
    }

    //This creates divs for all the projects in the sidebar, to be used each time a project is added or deleted
    function displayProjects () {
        //Always delete all the project divs before reappending them to avoid repetition
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
            //This fixes a problem with standard projects, since they naturally possess no position attribute and that is exclusive to user generated projects
            taskObject.projectIndex = projectObject.standard === true ? taskObject.projectIndex : projectObject.position;
            taskObject.taskIndex = i;
            console.log(taskObject);

            domElements.createTaskDiv(taskObject)
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
    
    function editTask (taskObject) {
        //Extract the data from the form
        const data = domElements.getTaskData();
        //Change the data of the object
        taskObject.name = data[0]
        taskObject.description = data[1]
        taskObject.date = data[2]
        taskObject.priority = data[3]

        projectData.replaceEditedTask(taskObject);

        //Update the local storage of the project array when a task is edited
        localStorageFunctions.updateStoredProjects();
    }


    function deleteTask (taskObject, projectObject) {

        //Goes into project data and splices task array
        projectData.removeTask(taskObject.projectIndex, taskObject.taskIndex);

        //Regenerate task divs without the deleted one
        generateTaskList(projectObject);

        //Updates the number of tasks on the list
        const noOfTasks = document.querySelector('#taskCounter p');
        let number = (Number(noOfTasks.textContent.split(' ')[0])) - 1;
        noOfTasks.textContent = number + " Task(s)";

        //Update the local storage when a task is deleted
        localStorageFunctions.updateStoredProjects();
        
    }


    return {insertProject, displayProjects, insertTask, editTask, deleteTask, generateTaskList, changeCompletedStatus}

})();

export default applicationFlow;