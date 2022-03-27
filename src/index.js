//Importing style sheets
import './style.css';
import './projectForm.css';

//This is for project icons
import star from './images/star.svg'
import cards from './images/playing-cards.svg'
import shopping from './images/shopping-bag.svg'
import heart from './images/heart.svg'
import book from './images/book-alt.svg'

//Modules
import domElements from './domElements.js'
import applicationFlow from './applicationFlow.js'

//This IIFE is where all the data about projects is segregated, and using closures one can only interact with the arrays through the exported functions
const projectData = (function () {

    //Array with icon urls
    const icons = [star, cards, shopping, heart, book]
    //The one array with projects
    const projects = [];

    //Factory functions to create projects
    function createProject (name, icon) {
        //This will be an array of objects containing the tasks
        const tasks = [];
        //This will tell us at what position the array is and will be reassigned dynamically
        let position = 0;

        return {name, icon, tasks, position}
    }

    //Factory function to create tasks
    function createTask (name, description, date, priority) {

        //Completed will be useful later and position is to once again identify and delete tasks
        return {name, description, date, priority, completed: false, position: 0}
    }

    //Used in combination with radio buttons to retrieve icon URL
    function extractIcon (index) {
        return icons[index];
    }

    //This pushes new project into the projects
    function addProject (projectObject) {
        projects.push(projectObject);
    }

    //Use this to service the project to a for loop for display
    function returnProject (index) {
        return projects[index];
    }

    //Returns lenght of array
    function returnArrayLength() {
        return projects.length; 
    }

    //Remove a project from the project array
    function deleteProject(position) {
        projects.splice(position, 1);
    }

    function addTask(index, newTask) {
        projects[index].tasks.push(newTask);
    }

    function removeTask(objectIndex, taskIndex) {
        projects[objectIndex].tasks.splice(taskIndex, 1);
    }

    return {extractIcon, createProject, createTask, addProject, addTask, removeTask, returnArrayLength, returnProject, deleteProject}

})(); 

export default projectData