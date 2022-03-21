import projectData from './index.js'
import applicationFlow from './applicationFlow.js'

//This is a cross icon for deletion
import crossIcon from './images/cross-circle.svg'

const domElements = (function () {

    function createProjectForm (projectObject) {

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
        
        //When a new task is created, perform these actions:
        //Extract the data from form, insert it into the task array within the project array
        confirmBtn.addEventListener('click', function () {
            applicationFlow.insertProject();
            applicationFlow.displayProjects();
            deleteForm(formBackdrop);

        })
        
        projectDatas.appendChild(btnContainer);

        //Now append everything to make it appear
        formContainer.appendChild(projectDatas);
        
        formBackdrop.appendChild(formContainer)

        document.querySelector('body').insertBefore(formBackdrop, document.querySelector('#header'));
    }

    //This creates a project div for 
    //TODO MAKE IT SO CLICKING ON NAME AND IMAGE GENERATES THE TASK LIST, IF YOU CLICK ON DELETE BUTTON IT PROMPTS THE FORM INSTEAD
    function createProjectDiv (projectObject) {
        //Create main container
        const projectContainer = document.createElement('div');
        projectContainer.classList.add('userProject');

        const projectIcon = document.createElement('img');
        projectIcon.src = projectObject.icon;
        projectContainer.appendChild(projectIcon)

        const projectName = document.createElement('p');
        projectName.textContent = projectObject.name;
        projectContainer.appendChild(projectName);

        //TODO: ADD FORM TO CONFIRM DELETION, TO AVOID MISTAKES 
        const deleteProjectIcon = document.createElement('img');
        deleteProjectIcon.src = crossIcon;
        projectContainer.appendChild(deleteProjectIcon);
        deleteProjectIcon.addEventListener('click', function () {
            projectData.deleteProject(projectObject.position);
            applicationFlow.displayProjects();
        })

        projectName.addEventListener('click', function () {
            setActive(projectContainer);
            showProjectInterface(projectObject);
        })

        projectIcon.addEventListener('click', function () {
            setActive(projectContainer);
            showProjectInterface(projectObject);
        })


        const sidebar = document.querySelector('#userProjList');
        sidebar.appendChild(projectContainer);
        //TODO: Aggiungi un event listener che mostra il contenuto della task list a destra se clicchi sull'intero div guardando nell'array task dell'oggetto passato tramite callback (vedi factory se nel dubbio)
    }

    //Function to dinamically create the form for new tasks.
    //projectObject needed to determine where to append new tasks/apply deletions
    function createTaskForm (projectObject) {
        //Backdrop and main container
        const formBackdrop = document.createElement('div');
        formBackdrop.setAttribute('id', 'formBackdrop');

        const formContainer = document.createElement('div');
        formContainer.setAttribute('id', 'newTaskContainer')

        //Header Elements
        const formHeader = document.createElement('div');
        formHeader.setAttribute('class', 'formHeader new')

        const formName = document.createElement('p');
        formName.textContent = 'CREATE TASK';
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
        textInputLabel.setAttribute('for', 'taskName');
        textInputLabel.setAttribute('class', 'label');
        textInputLabel.textContent = 'Task name:'

        const textInput = document.createElement('input');
        textInput.setAttribute('type', 'text');
        textInput.setAttribute('id', 'taskName');
        textInput.setAttribute('class', 'text');

        nameContainer.appendChild(textInputLabel);
        nameContainer.appendChild(textInput);

        //Append the name part to the project data container
        projectDatas.appendChild(nameContainer);

        //Description Container 
        const descriptionContainer = document.createElement('div');
        descriptionContainer.classList.add('descriptionContainer')

        const descrInputLabel = document.createElement('label');
        descrInputLabel.setAttribute('for', 'taskDescr');
        descrInputLabel.setAttribute('class', 'label');
        descrInputLabel.textContent = 'Task description:'

        const textArea = document.createElement('textarea');
        textArea.setAttribute('rows', '3');
        textArea.setAttribute('col', '60');
        textArea.setAttribute('name', 'taskDescr');
        textArea.setAttribute('id', 'taskDescr');

        descriptionContainer.appendChild(descrInputLabel);
        descriptionContainer.appendChild(textArea);

        //Append to main container
        projectDatas.appendChild(descriptionContainer);

        //Date Container
        const dateContainer = document.createElement('div');
        dateContainer.classList.add('dateContainer')

        const dateInputLabel = document.createElement('label');
        dateInputLabel.setAttribute('for', 'taskDate');
        dateInputLabel.setAttribute('class', 'label');
        dateInputLabel.textContent = 'Due date:'

        const dateInput = document.createElement('input');
        dateInput.setAttribute('type', 'date');
        dateInput.setAttribute('name', 'taskDate');
        dateInput.setAttribute('value', '2022-05-12');
        dateInput.setAttribute('id', 'taskDate');

        dateContainer.appendChild(dateInputLabel);
        dateContainer.appendChild(dateInput);

        projectDatas.appendChild(dateContainer);

        //Priority Container
        const priorityContainer = document.createElement('div');
        priorityContainer.classList.add('dateContainer')

        const priorityInputLabel = document.createElement('label');
        priorityInputLabel.setAttribute('for', 'taskPriority');
        priorityInputLabel.setAttribute('class', 'label');
        priorityInputLabel.textContent = 'Task priority:'

        const prioritySelect = document.createElement('select');
        prioritySelect.setAttribute('id', 'taskPriority');
        prioritySelect.setAttribute('name', 'taskPriority');

        const priorities = ['Low', 'Medium', 'High']
        
        //Dinamically generate the priorities options
        for(let i = 0; i < priorities.length; i++){
            const option = document.createElement('option');
            option.setAttribute('value', `${priorities[i].toLowerCase()}`)
            option.textContent = priorities[i]
            prioritySelect.appendChild(option);
        }

        priorityContainer.appendChild(priorityInputLabel);
        priorityContainer.appendChild(prioritySelect);

        projectDatas.appendChild(priorityContainer);

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
        
        //I NEED TO CREATE THE FUNCTION TO ADD A TASK TO THE PROJECT ARRAY
        confirmBtn.addEventListener('click', function () {
            applicationFlow.insertTask(projectObject);
            applicationFlow.generateTaskList(projectObject);
            deleteForm(formBackdrop);

        })
        
        projectDatas.appendChild(btnContainer);

        //Now append everything to make it appear
        formContainer.appendChild(projectDatas);
        
        formBackdrop.appendChild(formContainer)

        document.querySelector('body').insertBefore(formBackdrop, document.querySelector('#header'));


    }

    function createTaskDiv(projectObject) {

    }

    //Feed it a form you want removed and it will do just that
    function deleteForm (form)  {
        form.remove();
    }

    //Extract name, description, date and priority from the form and returns it in array form
    function getTaskData() {

        //Get the form to avoid querying the dom each time
        const form = document.querySelector('#formBackdrop');

        //Get all the information
        let taskName = form.querySelector('#taskName').value;
        let taskDescr = form.querySelector('#taskDescr').value;
        //TODO: SEE IF YOU CAN USE THAT LIBRARY FOR DATE FORMATTING
        let taskDate = form.querySelector('#taskDate').value;
        let taskPriority = form.querySelector('#taskPriority').value;

        //Return it in array form
        return [taskName, taskDescr, taskDate, taskPriority]

    }

    //Extracts icon and name from the form and returns it in array form
    function getProjectData () {

        //Get the form
        const form = document.querySelector('#formBackdrop');
        
        //Extract the name
        let projectName = form.querySelector('#projName').value;
        let iconUrl;

        //Get the checked button's value
        const radioButtons = form.querySelectorAll('input[name="icon"]');
        radioButtons.forEach(button => { 
            if (button.checked === true) {
            iconUrl = projectData.extractIcon(Number(button.value));
            }
        });

        //TODO BISOGNA DELEGARE QUESTA COSA // FATTO PER IL MOMENTO
        return [projectName, iconUrl]
        

    }

    //This displays a project when you click on it on the sidebar
    //It creates the relevant interface and proceeds to append the tasks available
    function showProjectInterface(projectObject) {
        //If there is a list, remove it
        document.querySelector('#list').remove();

        //Main container of the list
        const list = document.createElement('div');
        list.setAttribute('id', 'list');

        //Header and Tasklist
        const taskHeader = document.createElement('div');
        taskHeader.setAttribute('id', 'taskHeader');

        //Project Icon
        const iconHeader = document.createElement('img');
        iconHeader.src = projectObject.icon;
        iconHeader.style = "height: 20px; margin-right: 8px;"
        taskHeader.appendChild(iconHeader);

        //Project name
        const projectTitle = document.createElement('span');
        projectTitle.textContent = projectObject.name;
        taskHeader.appendChild(projectTitle)

        //Append the header
        list.appendChild(taskHeader);

        const taskContainer = document.createElement('div');
        taskContainer.setAttribute('id', 'taskContainer');

        const taskCounter = document.createElement('div');
        taskCounter.setAttribute('id', 'taskCounter');

        //Creates paragraph to store number of tasks
        const counterPara = document.createElement('p');
        //Looks at array lenght and determines amount of tasks
        counterPara.textContent =`${projectObject.tasks.length} Tasks`
        taskCounter.appendChild(counterPara);

        //Create the button to add tasks
        const newProjectButton = document.createElement('div');
        newProjectButton.setAttribute('id', 'newTask');
        newProjectButton.textContent = "+";
        newProjectButton.addEventListener('click', function () { createTaskForm(projectObject) })
        taskCounter.appendChild(newProjectButton);
        
        //Append the whole thing to the container
        taskContainer.appendChild(taskCounter);

        //This is the container for the tasklist
        const taskList = document.createElement('div');
        taskList.setAttribute('id', 'taskList');
        taskContainer.appendChild(taskList);

        //Append everything
        list.appendChild(taskContainer);
        document.querySelector('#main').appendChild(list);

        //TODO CREATE A FUNCTION THAT CAN RENDER THE TASK LIST
        applicationFlow.generateTaskList(projectObject);

    }

    //Generic function to bind the necessary event listeners available from the get go, such as project creation icon
    function bindEventListeners () {
        const newProjectBtn = document.querySelector('#newProj');
        newProjectBtn.addEventListener('click', createProjectForm);
    }

    //Before adding or deleting tasks, always delete the content of the appropriate div
    //Elsewise all projects will be doubled on each insertion or deletion
    function deleteProjectDivs () {
        console.log('hi');

        //If this is null, then this is the first project and there is no need to delete anything
        const firstUserProject = document.querySelector('.userProject');
        if (firstUserProject === null) return;

        //Creates a node list with all the user projects
        const userProjectDivs = Array.from(document.querySelectorAll('.userProject'));

        //Iterates over all of the nodes and deletes each one
        userProjectDivs.forEach(projectDiv => projectDiv.remove() );
    }

    //Toggles active class for projects 
    function setActive (projectContainer) {
        //If this is not null, then you need to remove it from the previous project and add it to the next
        const activeProject = document.querySelector('.active');

        if(activeProject !== null) {
            activeProject.classList.remove('active');
            projectContainer.classList.add('active');
            return;
        }

        projectContainer.classList.add('active');
        
    }

    bindEventListeners();

    return {createProjectForm, getProjectData, createProjectDiv, showProjectInterface, deleteProjectDivs, getTaskData}

})();

export default domElements;