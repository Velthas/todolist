import './style.css';
import './projectForm.css';

import star from './images/star.svg'
import cards from './images/playing-cards.svg'
import shopping from './images/shopping-bag.svg'
import heart from './images/heart.svg'
import book from './images/book-alt.svg'

import crossIcon from './images/cross-circle.svg'

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
    function createTask (name, date, description, priority) {

        return {name, date, description, priority, completed: false}
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

    function returnArrayLength() {
        return projects.length; 
    }

    return {extractIcon, createProject, createTask, addProject, returnArrayLength, returnProject}

})(); 


const domElements = (function () {

    function createProjectForm () {

        //Backdrop and main container
        const formBackdrop = document.createElement('div');
        formBackdrop.setAttribute('id', 'formBackdrop');

        const formContainer = document.createElement('div');
        formContainer.setAttribute('id', 'newProjectContainer')

        //Header Elements
        const formHeader = document.createElement('div');
        formHeader.setAttribute('class', 'formHeader new')

        const formName = document.createElement('p');
        formName.textContent = 'CREATE PROJECT';
        formName.setAttribute('class', 'formTitle');

        const formX = document.createElement('p');
        formX.textContent = 'X';
        formX.setAttribute('class', 'formClose');
        formX.addEventListener('click', function () { deleteForm(formBackdrop) })

        formHeader.appendChild(formName);
        formHeader.appendChild(formX);

        formContainer.appendChild(formHeader)

        //Form Body
        const projectDatas = document.createElement('div');
        projectDatas.setAttribute('id', 'projectData')

        //Input for name of Project
        const nameContainer = document.createElement('div');
        nameContainer.classList.add('nameContainer')

        const textInputLabel = document.createElement('label');
        textInputLabel.setAttribute('for', 'projName');
        textInputLabel.setAttribute('class', 'label');
        textInputLabel.textContent = 'Project Name:'

        const textInput = document.createElement('input');
        textInput.setAttribute('type', 'text');
        textInput.setAttribute('id', 'projName');
        textInput.setAttribute('class', 'text');

        nameContainer.appendChild(textInputLabel);
        nameContainer.appendChild(textInput);

        projectDatas.appendChild(nameContainer);

        //Radio buttons for icon selection
        const picturesContainer = document.createElement('div');
        picturesContainer.classList.add('picturesContainer');

        const projectIcons = document.createElement('div');
        projectIcons.setAttribute('id', 'projectPictures');

        const projectLabel = document.createElement('p');
        projectLabel.classList.add('label');
        projectLabel.textContent = "Icons:"

        for(let i = 0; i < 5; i++) {

            const wrappingLabel = document.createElement('label');

            const radioButton = document.createElement('input');
            radioButton.setAttribute('type', 'radio');
            radioButton.setAttribute('name', 'icon');
            radioButton.setAttribute('value', `${i}`)
            wrappingLabel.appendChild(radioButton);

            const image = document.createElement('img');
            const url = projectData.extractIcon(i);
            image.src = url;
            wrappingLabel.appendChild(image)

            projectIcons.appendChild(wrappingLabel);
        }

        picturesContainer.appendChild(projectLabel);
        picturesContainer.appendChild(projectIcons);

        projectDatas.appendChild(picturesContainer)

        //Buttons to confirm and cancel
        const btnContainer = document.createElement('div');
        btnContainer.classList.add('buttons')

        const cancelBtn = document.createElement('button');
        cancelBtn.classList.add('cancel');
        cancelBtn.textContent = 'Cancel';
        btnContainer.appendChild(cancelBtn);
        cancelBtn.addEventListener('click', function () { deleteForm(formBackdrop) })

        const confirmBtn = document.createElement('button');
        confirmBtn.classList.add('confirm');
        confirmBtn.textContent = 'Confirm';
        btnContainer.appendChild(confirmBtn);
        //TODO ESTRAI DATA, GENERA LA LISTA TASK E MOSTRA IL PROGETTO NUOVO
        btnContainer.addEventListener('click', function () {

        })
        
        projectDatas.appendChild(btnContainer);

        //Now append everything to make it appear
        formContainer.appendChild(projectDatas);
        
        formBackdrop.appendChild(formContainer)

        document.querySelector('body').insertBefore(formBackdrop, document.querySelector('#header'));
    }

    //This creates a project div for 
    //TODO COMPLETA
    function createProjectDiv (projectObject) {
        //Create main container
        const projectContainer = document.createElement('div');
        projectContainer.classList.add('project');

        const projectIcon = document.createElement('img');
        projectIcon.src = projectObject.icon;
        projectContainer.appendChild(projectIcon)

        const projectName = document.createElement('p');
        projectName.textContent = projectObject.name;
        projectContainer.appendChild(projectName);

        const deleteProjectIcon = document.createElement('img');
        deleteProjectIcon.src = crossIcon;
        deleteProjectIcon.addEventListener('click', function () {
            removeProject();
            
        })


        projectContainer.addEventListener('click', () => displayProject(projectContainer, projectObject))
        //TODO: Aggiungi un event listener che mostra il contenuto della task list a destra se clicchi sull'intero div guardando nell'array task dell'oggetto passato tramite callback (vedi factory se nel dubbio)
    }

    function deleteForm (form)  {
        form.remove();
    }

    function getProjectData () {

        //Get the form
        const form = document.querySelector('#formBackdrop');
        
        //Extract the name
        let projectName = form.querySelector('#projName').value;
        let iconUrl;

        //Get the checked button's value
        const radioButtons = form.querySelectorAll('input[name="icon"]');
        radioButtons.forEach(button => { 
            if (button.checked = true) {
            iconUrl = projectData.extractIcon(Number(button.value));
            }
        });

        //TODO BISOGNA DELEGARE QUESTA COSA // FATTO PER IL MOMENTO
        return [projectName, iconUrl]
        

    }

    function bindEventListeners () {
        const newProjectBtn = document.querySelector('#newProj');
        newProjectBtn.addEventListener('click', createProjectForm);
    }

    

    bindEventListeners();

    {createProjectForm, getProjectData}

})();

const applicationFlow = (function () {

    //This adds the project to the appropriate array
    function insertProject () {
        const projectData = domElements.getProjectData();
        let newEntry = projectData.createProject(projectData[0],projectData[1]);
        projectData.addProject(newEntry);
    }

    //When the project on the sidebar is clicked, show the task list and highlight the appropriate project div
    function displayProjects () {
        let length = projectData.returnArrayLength();
        for (let i = 0; i < length; i++) {
            //Get the object from the projects array
            const projectObject = projectData.returnProject(i);
            //Assign the position so we know where it is on the array for deletion purposes later
            projectObject.position = i;
            //This creates the project div and adds the relevant event listeners
            createProjectDiv(projectObject);

        }
    }

    function displayTasks(projectObject) {

    }

})();