import domElements from "./domElements";
import projectData from "./index.js"

const applicationFlow = (function () {

    //This adds the project to the appropriate array
    function insertProject () {
        // Extracts the data using the domElement function and uses a factory to create the project object
        const projectInfo = domElements.getProjectData();
        let newEntry = projectData.createProject(projectInfo[0],projectInfo[1]);
        //Pushes new object into projects array
        projectData.addProject(newEntry);
    }

    //This creates divs for all the projects in the sidebar, to be used each time a project is added or deleted
    function displayProjects () {
        //Always delete all the project divs before reappending them to avoid repetition
        //TODO: NOT REALLY IMPORTANT, BUT SEE IF YOU CAN ADD A WAY OF RETAINING WHICH PROJECT WAS ACTIVE
        domElements.deleteProjectDivs();
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

    function displayTasks(projectObject) {

    }

    return {insertProject, displayProjects}

})();

export default applicationFlow;