//Importing style sheets
import './style.css';
import './projectForm.css';

//This is for project icons
import star from './images/star.svg'
import cards from './images/playing-cards.svg'
import shopping from './images/shopping-bag.svg'
import heart from './images/heart.svg'
import book from './images/book-alt.svg'

//This is for standard project icons
import homeIcon from './images/home.svg'
import todayIcon from './images/time-twenty-four.svg'
import urgentIcon from './images/engine-warning.svg'

//Modules
import domElements from './domElements.js'
import { isToday } from 'date-fns';
import applicationFlow from './applicationFlow';


//This IIFE is where all the data about user projects is segregated, and using closures one can only interact with the arrays through the exported functions
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


    function replaceEditedTask(task) {
        projects[task.projectIndex].tasks[task.taskIndex] = task;
    }

    return {extractIcon, createProject, createTask, addProject, addTask, removeTask, returnArrayLength, returnProject, deleteProject, replaceEditedTask}

})(); 

//This IIFE handles 'standard' projects, so projects generated by me and that are standard for everyone
const defaultProjects = (function () {
    
    //Home holds all tasks regardless of urgency
    //TODO: maybe sorted by date?
    const home = {name: "Home", icon: homeIcon, tasks:[], standard: true}
    //Gathers all the projects that are due today
    const today = {name: "Today", icon: todayIcon, tasks: [], standard: true };
    //Gathers all the tasks with high priority
    const urgent = {name: "Urgent", icon: urgentIcon, tasks:[], standard: true };

    function populateStandardProjects () {

        let projectsArrayLength = projectData.returnArrayLength();

        //Loop over each project, and then their entire tasklist 
        for (let i = 0; i < projectsArrayLength; i++) {
            
            let project = projectData.returnProject(i)

            for (let j = 0; j < project.tasks.length; j++) {

                //Store here to avoid pointless repetition
                let task = project.tasks[j];
                //Identify the project and task index, this is crucial to apply changes made in a standard project to the other side projects they borrow from.
                task.projectIndex = i;
                task.taskIndex = j;

                //Push into home regardless of anything
                home.tasks.push(task);

                //Not using break statements here because a task might be in different standard projects
                switch (true) {
                    //If it's urgent, store it into the urgent standard project
                    case (task.priority === 'high'):
                        urgent.tasks.push(task);
                    //If it's today, store it into the today standard project
                    case (isToday(new Date(task.date))):
                        today.tasks.push(task);
                }
            }
        }
    } 

    function clearStandardProjects () {
        home.tasks = [];
        today.tasks =  [];
        urgent.tasks = [];
    }

    function bindEventListeners() {
        const homeDiv = document.querySelector('#home');
        const todayDiv = document.querySelector('#today');
        const urgentDiv = document.querySelector('#urgent');

        homeDiv.addEventListener('click', function () {
            clearStandardProjects();
            populateStandardProjects();
            domElements.showProjectInterface(home);
            domElements.deleteAddProjectIcon();
        })

        todayDiv.addEventListener('click', function () {
            clearStandardProjects();
            populateStandardProjects();
            domElements.showProjectInterface(today);
            domElements.deleteAddProjectIcon();
        })

        urgentDiv.addEventListener('click', function () {
            clearStandardProjects();
            populateStandardProjects();
            domElements.showProjectInterface(urgent);
            domElements.deleteAddProjectIcon();
        })


    }

    bindEventListeners();
    
})();

export default projectData;