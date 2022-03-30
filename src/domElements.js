import projectData from './index.js'
import applicationFlow from './applicationFlow.js'

//This is a cross icon for deletion
import crossIcon from './images/cross-circle.svg'

//These icons are needed for the task divs
import squareIcon from './images/square.svg'
import checkIcon from './images/check.svg'
import infoIcon from './images/info.svg'
import greenInfoIcon from './images/greeninfo.svg'
import editIcon from './images/edit.svg'


const domElements = (function () {

    function createProjectForm (projectObject) {

        //Backdrop and main container
        const formBackdrop = document.createElement('div');
        formBackdrop.setAttribute('id', 'formBackdrop');

        const formContainer = document.createElement('div');
        formContainer.setAttribute('id', 'newProjectContainer')

        //Header Elements
        const formHeader = document.createElement('div');
        formHeader.setAttribute('class', 'new small formHeader')

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
            //Check the first button
            if (i === 0) radioButton.checked = true;

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

    //This creates a project div for a project
    function createProjectDiv (projectObject) {
        //Create main container
        const projectContainer = document.createElement('div');
        projectContainer.classList.add('userProject');

        const projectIcon = document.createElement('img');
        projectIcon.src = projectObject.icon;
        projectContainer.appendChild(projectIcon)

        //Make sure to check if the name is longer and if it is, cut it.
        //It will be displayed in full in the project interface
        const projectName = document.createElement('p');
        if (projectObject.name.length > 7) {
            projectName.textContent = projectObject.name.slice(0, 6) + '...';
        }
        else projectName.textContent = projectObject.name;
        projectContainer.appendChild(projectName);

        const deleteProjectIcon = document.createElement('img');
        deleteProjectIcon.src = crossIcon;
        projectContainer.appendChild(deleteProjectIcon);
        deleteProjectIcon.addEventListener('click', function () {
            confirmDeleteForm(projectObject, 'project');
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
    }

    //Displays the delete form for tasks and objects
    //form refers to what kind of form it is for
    function confirmDeleteForm (projectObject, form, taskObject) {
            //Backdrop and main container
            const formBackdrop = document.createElement('div');
            formBackdrop.setAttribute('id', 'formBackdrop');
    
            const formContainer = document.createElement('div');
            formContainer.setAttribute('id', 'deleteFormContainer')
    
            //Header Elements
            const formHeader = document.createElement('div');
            formHeader.setAttribute('class', 'del smaller formHeader')

            //Depending on what you're trying to delete, display different things
            const formName = document.createElement('p');
            formName.textContent = form === 'task' ? 'DELETE TASK' : 'DELETE PROJECT'
            formName.setAttribute('class', 'formTitle');
    
            const formX = document.createElement('p');
            formX.textContent = 'X';
            formX.setAttribute('class', 'formClose');
            formX.addEventListener('click', function () { deleteForm(formBackdrop) })
    
            formHeader.appendChild(formName);
            formHeader.appendChild(formX);
    
            formContainer.appendChild(formHeader)
    
            //Description of what is about to be done
            const warningPara = document.createElement('p');
            warningPara.classList.add('formDescription');
            warningPara.textContent = form === 'task' ? "Deleted tasks can never be retrieved. Knowing this, do you still wish to proceed?" : "Deleted projects can never be retrieved. Knowing this, do you still wish to proceed?" 
            formContainer.appendChild(warningPara);
    
            //Buttons to confirm and cancel
            const btnContainer = document.createElement('div');
            btnContainer.setAttribute('class', 'buttons pad');
    
            const cancelBtn = document.createElement('button');
            cancelBtn.classList.add('delcancel');
            cancelBtn.textContent = 'Cancel';
            btnContainer.appendChild(cancelBtn);
            cancelBtn.addEventListener('click', function () { deleteForm(formBackdrop) })
    
            const confirmBtn = document.createElement('button');
            confirmBtn.classList.add('confirmDeletion');
            confirmBtn.textContent = 'Confirm';
            btnContainer.appendChild(confirmBtn);
            
            //Depending on what you're trying to delete, either deletes the task and redisplays the task list or the same but with projects
            confirmBtn.addEventListener('click', function () {
                if(form === 'task') {
                    applicationFlow.deleteTask(taskObject, projectObject);
                    applicationFlow.displayProjects();
                    deleteForm(formBackdrop);
                }
                else {
                    projectData.deleteProject(projectObject.position);
                    applicationFlow.displayProjects();
                    deleteForm(formBackdrop);
                }
            })
            
            
            formContainer.appendChild(btnContainer);
    
            //Now append everything to make it appear
            formBackdrop.appendChild(formContainer);
            document.querySelector('body').insertBefore(formBackdrop, document.querySelector('#header'));
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
        formHeader.setAttribute('class', 'new big formHeader')

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

    function editTaskForm (projectObject, taskObject) {
        //Backdrop and main container
        const formBackdrop = document.createElement('div');
        formBackdrop.setAttribute('id', 'formBackdrop');

        const formContainer = document.createElement('div');
        formContainer.setAttribute('id', 'newTaskContainer')

        //Header Elements
        const formHeader = document.createElement('div');
        formHeader.setAttribute('class', 'new big formHeader')

        const formName = document.createElement('p');
        formName.textContent = 'EDIT TASK';
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
        textInput.value = taskObject.name;


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
        textArea.value = taskObject.description

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
        dateInput.value = taskObject.date;

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
            option.setAttribute('value', `${priorities[i].toLowerCase()}`);
            option.textContent = priorities[i];
            prioritySelect.appendChild(option);
        }

        //Selects the appropriate priority
        const taskPriority = taskObject.priority;
        const options = Array.from(prioritySelect.options);
        options.forEach(option => {
            if(option.value === taskPriority) {
                option.selected = true;
            }
        })

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
        confirmBtn.textContent = 'Change';
        btnContainer.appendChild(confirmBtn);
        

        confirmBtn.addEventListener('click', function () {
            applicationFlow.editTask(taskObject);
            applicationFlow.generateTaskList(projectObject);
            deleteForm(formBackdrop);
        })
        
        projectDatas.appendChild(btnContainer);

        //Now append everything to make it appear
        formContainer.appendChild(projectDatas);
        
        formBackdrop.appendChild(formContainer)

        document.querySelector('body').insertBefore(formBackdrop, document.querySelector('#header'));


    }

    //Creates a div for a task;
    function createTaskDiv(taskObject, projectObject) {
        const taskEntry = document.createElement('div');
        taskEntry.classList.add('taskEntry');

        switch (true) {
            case (taskObject.priority === 'low'):
                taskEntry.classList.add('low');
                break;
            case (taskObject.priority === 'medium'):
                taskEntry.classList.add('medium');
                break;
            case (taskObject.priority === 'high'):
                taskEntry.classList.add('high');
        }

        //If the task is completed the change is reflected in how the divs are displayed
        if (taskObject.completed === true) {
            taskEntry.classList.add('completed');
        }

        //Container for task priority and task name
        const taskPriority = document.createElement('div');
        taskPriority.classList.add('taskPriority');
        taskEntry.appendChild(taskPriority)

        const completedImg = document.createElement('img');
        completedImg.src = taskObject.completed === true ? checkIcon : squareIcon
        completedImg.addEventListener('click', function () {
            applicationFlow.changeCompletedStatus(taskObject, taskEntry);
            completedImg.src = taskObject.completed === true ? checkIcon : squareIcon
        })

        const nameParagraph = document.createElement('p');
        nameParagraph.textContent = taskObject.name;

        taskPriority.appendChild(completedImg);
        taskPriority.appendChild(nameParagraph);

        //Icon bar with utility tools
        const statusBar = document.createElement('div');
        statusBar.classList.add('statusBar');

        //TODO: SEE IF YOU CAN USE THAT LIBRARY TO FORMAT THIS DATE INTO A MORE HUMAN FORM
        const datePara = document.createElement('p');
        datePara.classList.add('datePara');
        datePara.textContent = taskObject.date;
        statusBar.appendChild(datePara);

        //Button to check project info
        const infoImg = document.createElement('img');
        infoImg.src = infoIcon
        infoImg.addEventListener('click', function () { 

            const infoDiv = taskEntry.querySelector('.infoDescr');

            if (taskObject.info === true && infoDiv !== null) {
                infoDiv.remove();
                taskObject.info = false;
                infoImg.src = infoIcon
            }
            else {
                //Adds evidence of info being displayed or not
                taskObject.info = true;
                infoImg.src = greenInfoIcon
                //Container to easily delete the added description
                const infoDescr = document.createElement('div');
                infoDescr.classList.add('infoDescr');

                //This will add a paragraph with the description
                const descriptionHeader = document.createElement('p');
                descriptionHeader.classList.add('descriptionHeader');
                descriptionHeader.textContent = "Description:"
                infoDescr.appendChild(descriptionHeader)

                const taskDescription = document.createElement('p');
                taskDescription.textContent = taskObject.description;
                taskDescription.classList.add('taskDescription');
                infoDescr.appendChild(taskDescription);

                taskEntry.appendChild(infoDescr);
            }

        })
        statusBar.appendChild(infoImg);

        //Button to edit project info
        const editImg = document.createElement('img');
        editImg.src = editIcon;
        editImg.addEventListener('click', function () {
            editTaskForm(projectObject, taskObject);
        })
        statusBar.appendChild(editImg)

        const delImg = document.createElement('img');
        delImg.src = crossIcon;
        delImg.addEventListener('click', function () { 
            confirmDeleteForm(projectObject, 'task', taskObject);
        })
        statusBar.appendChild(delImg);

        //Flex container to house taskpriority and taskstatus containers
        const flexContainer = document.createElement('div');
        flexContainer.classList.add('flex');
        flexContainer.appendChild(taskPriority);
        flexContainer.appendChild(statusBar);
        taskEntry.appendChild(flexContainer);

        //Query the dom to get the list, and then append the project div to it
        document.querySelector('#taskList').appendChild(taskEntry)
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
        counterPara.textContent =`${projectObject.tasks.length} Task(s)`
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

    //Before adding or deleting tasks and projects, always delete the content of the appropriate div
    //Elsewise all divs will be doubled on each insertion or deletion
    function deleteGeneratedDivs (selector) {
        
        //If this is null, then this is the first project and there is no need to delete anything
        const firstDiv = document.querySelector(selector);
        if (firstDiv === null) return;

        //Creates a node list with all the user projects
        const allDivs = Array.from(document.querySelectorAll(selector));

        //Iterates over all of the nodes and deletes each one
        allDivs.forEach(projectDiv => projectDiv.remove());
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

    return {createProjectForm, getProjectData, createProjectDiv, createTaskDiv, showProjectInterface, deleteGeneratedDivs, getTaskData}

})();

export default domElements;