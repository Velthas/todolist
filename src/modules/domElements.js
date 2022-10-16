import { format } from 'date-fns';

import App from '../app';

// Icons for UI
import crossIcon from '../images/cross-circle.svg';
import blackCrossIcon from '../images/cross-circle-black.svg';

// Icons for task divs
import squareIcon from '../images/square.svg';
import checkIcon from '../images/check.svg';
import infoIcon from '../images/info.svg';
import greenInfoIcon from '../images/greeninfo.svg';
import editIcon from '../images/edit.svg';
import angleUp from '../images/angle-up.svg';
import angleDown from '../images/angle-down.svg';

// Icons for projects
import star from '../images/star.svg';
import cards from '../images/playing-cards.svg';
import shopping from '../images/shopping-bag.svg';
import heart from '../images/heart.svg';
import book from '../images/book-alt.svg';

const icons = [star, cards, shopping, heart, book];

// eslint-disable-next-line wrap-iife
const domElements = (function () {
  function createProjectForm() {
    // Backdrop and main container
    const formBackdrop = document.createElement('div');
    formBackdrop.setAttribute('id', 'formBackdrop');

    const formContainer = document.createElement('div');
    formContainer.setAttribute('id', 'newProjectContainer');

    // Header Elements
    const formHeader = document.createElement('div');
    formHeader.setAttribute('class', 'new small formHeader');

    const formName = document.createElement('p');
    formName.textContent = 'CREATE PROJECT';
    formName.setAttribute('class', 'formTitle');

    const formX = document.createElement('p');
    formX.textContent = 'X';
    formX.setAttribute('class', 'formClose');
    formX.addEventListener('click', () => {
      deleteForm(formBackdrop);
    });
    formHeader.appendChild(formName);
    formHeader.appendChild(formX);

    formContainer.appendChild(formHeader);

    // Form Body
    const projectDatas = document.createElement('div');
    projectDatas.setAttribute('id', 'projectData');

    //  Input for name of Project
    const nameContainer = document.createElement('div');
    nameContainer.classList.add('nameContainer');

    const textInputLabel = document.createElement('label');
    textInputLabel.setAttribute('for', 'projName');
    textInputLabel.setAttribute('class', 'label');
    textInputLabel.textContent = 'Project Name:';

    const textInput = document.createElement('input');
    textInput.setAttribute('type', 'text');
    textInput.setAttribute('id', 'projName');
    textInput.setAttribute('class', 'text');

    nameContainer.appendChild(textInputLabel);
    nameContainer.appendChild(textInput);

    projectDatas.appendChild(nameContainer);

    // Radio buttons for icon selection
    const picturesContainer = document.createElement('div');
    picturesContainer.classList.add('picturesContainer');

    const projectIcons = document.createElement('div');
    projectIcons.setAttribute('id', 'projectPictures');

    const projectLabel = document.createElement('p');
    projectLabel.classList.add('label');
    projectLabel.textContent = 'Icons:';

    for (let i = 0; i < 5; i++) {
      const wrappingLabel = document.createElement('label');

      const radioButton = document.createElement('input');
      radioButton.setAttribute('type', 'radio');
      radioButton.setAttribute('name', 'icon');
      radioButton.setAttribute('value', `${i}`);
      wrappingLabel.appendChild(radioButton);

      // Check the first button
      if (i === 0) radioButton.checked = true;

      const image = document.createElement('img');
      const url = icons[i];
      image.src = url;
      wrappingLabel.appendChild(image);

      projectIcons.appendChild(wrappingLabel);
    }

    picturesContainer.appendChild(projectLabel);
    picturesContainer.appendChild(projectIcons);

    projectDatas.appendChild(picturesContainer);

    // Buttons to confirm and cancel
    const btnContainer = document.createElement('div');
    btnContainer.classList.add('buttons');

    const cancelBtn = document.createElement('button');
    cancelBtn.classList.add('cancel');
    cancelBtn.textContent = 'Cancel';
    btnContainer.appendChild(cancelBtn);
    cancelBtn.addEventListener('click', () => {
      deleteForm(formBackdrop);
    });

    const confirmBtn = document.createElement('button');
    confirmBtn.classList.add('confirm');
    confirmBtn.textContent = 'Confirm';
    btnContainer.appendChild(confirmBtn);

    // When a new task is created, perform these actions:
    // Extract the data from form, insert it into the task array within the project array
    confirmBtn.addEventListener('click', () => {
      App.insertProject();
      deleteForm(formBackdrop);
    });

    projectDatas.appendChild(btnContainer);

    // Now append everything to make it appear
    formContainer.appendChild(projectDatas);
    formBackdrop.appendChild(formContainer);
    document
      .querySelector('.grid-container')
      .insertBefore(formBackdrop, document.querySelector('#header'));
  }

  // This creates a project div for a project
  function createProjectDiv(projectObject) {
    const projectContainer = document.createElement('div');
    projectContainer.classList.add('userProject');
    projectContainer.setAttribute('title', `${projectObject.name}`);

    const projectIcon = document.createElement('img');
    projectIcon.src = projectObject.icon;
    projectContainer.appendChild(projectIcon);

    // Cut chars if too long to prevent UI issues.
    const projectName = document.createElement('p');
    if (projectObject.name.length > 7) {
      projectName.textContent = `${projectObject.name.slice(0, 6)}...`;
    } else projectName.textContent = projectObject.name;
    projectContainer.appendChild(projectName);

    const deleteProjectIcon = document.createElement('img');
    deleteProjectIcon.src = blackCrossIcon;
    projectContainer.appendChild(deleteProjectIcon);
    deleteProjectIcon.addEventListener('click', () => {
      confirmDeleteForm(projectObject, 'project');
    });

    projectContainer.addEventListener('click', () => {
      setActive(projectContainer);
      App.displayTaskList(projectObject);
    });

    const sidebar = document.querySelector('#userProjList');
    sidebar.appendChild(projectContainer);
  }

  // Displays the delete form for tasks and objects
  // form refers to what kind of form it is for
  function confirmDeleteForm(projectObject, form, taskObject) {
    // Backdrop and main container
    const formBackdrop = document.createElement('div');
    formBackdrop.setAttribute('id', 'formBackdrop');

    const formContainer = document.createElement('div');
    formContainer.setAttribute('id', 'deleteFormContainer');

    // Header Elements
    const formHeader = document.createElement('div');
    formHeader.setAttribute('class', 'del smaller formHeader');

    // Depending on what you're trying to delete, display different things
    const formName = document.createElement('p');
    formName.textContent = form === 'task' ? 'DELETE TASK' : 'DELETE PROJECT';
    formName.setAttribute('class', 'formTitle');

    const formX = document.createElement('p');
    formX.textContent = 'X';
    formX.setAttribute('class', 'formClose');
    formX.addEventListener('click', () => {
      deleteForm(formBackdrop);
    });

    formHeader.appendChild(formName);
    formHeader.appendChild(formX);

    formContainer.appendChild(formHeader);

    // Description of what is about to be done
    const warningPara = document.createElement('p');
    warningPara.classList.add('formDescription');
    warningPara.textContent =
      form === 'task'
        ? 'Deleted tasks can never be retrieved. Knowing this, do you still wish to proceed?'
        : 'Deleted projects can never be retrieved. Knowing this, do you still wish to proceed?';
    formContainer.appendChild(warningPara);

    // Buttons to confirm and cancel
    const btnContainer = document.createElement('div');
    btnContainer.setAttribute('class', 'buttons pad');

    const cancelBtn = document.createElement('button');
    cancelBtn.classList.add('delcancel');
    cancelBtn.textContent = 'Cancel';
    btnContainer.appendChild(cancelBtn);
    cancelBtn.addEventListener('click', () => {
      deleteForm(formBackdrop);
    });

    const confirmBtn = document.createElement('button');
    confirmBtn.classList.add('confirmDeletion');
    confirmBtn.textContent = 'Confirm';
    btnContainer.appendChild(confirmBtn);

    // Deletes all the tasks or projects, then reappends the updated list
    confirmBtn.addEventListener('click', () => {
      if (form === 'task') {
        App.deleteTask(taskObject, projectObject);
        deleteForm(formBackdrop);
      } else {
        App.deleteProject(projectObject);
        emptyList();
        deleteForm(formBackdrop);
      }
    });

    formContainer.appendChild(btnContainer);

    // Now append everything to make it appear
    formBackdrop.appendChild(formContainer);
    document
      .querySelector('.grid-container')
      .insertBefore(formBackdrop, document.querySelector('#header'));
  }

  // Function to dinamically create the form for new tasks.
  // projectObject needed to determine where to append new tasks/apply deletions
  function createTaskForm(projectObject) {
    // Backdrop and main container
    const formBackdrop = document.createElement('div');
    formBackdrop.setAttribute('id', 'formBackdrop');

    const formContainer = document.createElement('div');
    formContainer.setAttribute('id', 'newTaskContainer');

    // Header Elements
    const formHeader = document.createElement('div');
    formHeader.setAttribute('class', 'new big formHeader');

    const formName = document.createElement('p');
    formName.textContent = 'CREATE TASK';
    formName.setAttribute('class', 'formTitle');

    const formX = document.createElement('p');
    formX.textContent = 'X';
    formX.setAttribute('class', 'formClose');
    formX.addEventListener('click', () => {
      deleteForm(formBackdrop);
    });

    formHeader.appendChild(formName);
    formHeader.appendChild(formX);

    formContainer.appendChild(formHeader);

    // Form Body
    const projectDatas = document.createElement('div');
    projectDatas.setAttribute('id', 'projectData');

    // Input for name of Project
    const nameContainer = document.createElement('div');
    nameContainer.classList.add('nameContainer');

    const textInputLabel = document.createElement('label');
    textInputLabel.setAttribute('for', 'taskName');
    textInputLabel.setAttribute('class', 'label');
    textInputLabel.textContent = 'Task name:';

    const textInput = document.createElement('input');
    textInput.setAttribute('type', 'text');
    textInput.setAttribute('id', 'taskName');
    textInput.setAttribute('class', 'text');

    nameContainer.appendChild(textInputLabel);
    nameContainer.appendChild(textInput);

    // Append the name part to the project data container
    projectDatas.appendChild(nameContainer);

    // Description Container
    const descriptionContainer = document.createElement('div');
    descriptionContainer.classList.add('descriptionContainer');

    const descrInputLabel = document.createElement('label');
    descrInputLabel.setAttribute('for', 'taskDescr');
    descrInputLabel.setAttribute('class', 'label');
    descrInputLabel.textContent = 'Task description:';

    const textArea = document.createElement('textarea');
    textArea.setAttribute('rows', '3');
    textArea.setAttribute('col', '60');
    textArea.setAttribute('name', 'taskDescr');
    textArea.setAttribute('id', 'taskDescr');

    descriptionContainer.appendChild(descrInputLabel);
    descriptionContainer.appendChild(textArea);

    // Append to main container
    projectDatas.appendChild(descriptionContainer);

    // Date Container
    const dateContainer = document.createElement('div');
    dateContainer.classList.add('dateContainer');

    const dateInputLabel = document.createElement('label');
    dateInputLabel.setAttribute('for', 'taskDate');
    dateInputLabel.setAttribute('class', 'label');
    dateInputLabel.textContent = 'Due date:';

    const dateInput = document.createElement('input');
    dateInput.setAttribute('type', 'date');
    dateInput.setAttribute('name', 'taskDate');
    dateInput.setAttribute('value', '2022-05-12');
    dateInput.setAttribute('id', 'taskDate');

    dateContainer.appendChild(dateInputLabel);
    dateContainer.appendChild(dateInput);

    projectDatas.appendChild(dateContainer);

    // Priority Container
    const priorityContainer = document.createElement('div');
    priorityContainer.classList.add('dateContainer');

    const priorityInputLabel = document.createElement('label');
    priorityInputLabel.setAttribute('for', 'taskPriority');
    priorityInputLabel.setAttribute('class', 'label');
    priorityInputLabel.textContent = 'Task priority:';

    const prioritySelect = document.createElement('select');
    prioritySelect.setAttribute('id', 'taskPriority');
    prioritySelect.setAttribute('name', 'taskPriority');

    const priorities = ['Low', 'Medium', 'High'];

    // Dinamically generate the priorities options
    for (let i = 0; i < priorities.length; i++) {
      const option = document.createElement('option');
      option.setAttribute('value', `${priorities[i].toLowerCase()}`);
      option.textContent = priorities[i];
      prioritySelect.appendChild(option);
    }

    priorityContainer.appendChild(priorityInputLabel);
    priorityContainer.appendChild(prioritySelect);

    projectDatas.appendChild(priorityContainer);

    // Buttons to confirm and cancel
    const btnContainer = document.createElement('div');
    btnContainer.classList.add('buttons');

    const cancelBtn = document.createElement('button');
    cancelBtn.classList.add('cancel');
    cancelBtn.textContent = 'Cancel';
    btnContainer.appendChild(cancelBtn);
    cancelBtn.addEventListener('click', () => {
      deleteForm(formBackdrop);
    });

    const confirmBtn = document.createElement('button');
    confirmBtn.classList.add('confirm');
    confirmBtn.textContent = 'Confirm';
    btnContainer.appendChild(confirmBtn);

    confirmBtn.addEventListener('click', () => {
      if (document.querySelector('#taskDate').value === '') {
        alert('Invalid date, please try again');
        return;
      }
      App.insertTask(projectObject);
      deleteForm(formBackdrop);
    });

    projectDatas.appendChild(btnContainer);

    // Now append everything to make it appear
    formContainer.appendChild(projectDatas);

    formBackdrop.appendChild(formContainer);

    document
      .querySelector('.grid-container')
      .insertBefore(formBackdrop, document.querySelector('#header'));
  }

  function editTaskForm(taskObject) {
    // Backdrop and main container
    const formBackdrop = document.createElement('div');
    formBackdrop.setAttribute('id', 'formBackdrop');

    const formContainer = document.createElement('div');
    formContainer.setAttribute('id', 'newTaskContainer');

    // Header Elements
    const formHeader = document.createElement('div');
    formHeader.setAttribute('class', 'new big formHeader');

    const formName = document.createElement('p');
    formName.textContent = 'EDIT TASK';
    formName.setAttribute('class', 'formTitle');

    const formX = document.createElement('p');
    formX.textContent = 'X';
    formX.setAttribute('class', 'formClose');
    formX.addEventListener('click', () => {
      deleteForm(formBackdrop);
    });

    formHeader.appendChild(formName);
    formHeader.appendChild(formX);

    formContainer.appendChild(formHeader);

    // Form Body
    const projectDatas = document.createElement('div');
    projectDatas.setAttribute('id', 'projectData');

    // Input for name of Project
    const nameContainer = document.createElement('div');
    nameContainer.classList.add('nameContainer');

    const textInputLabel = document.createElement('label');
    textInputLabel.setAttribute('for', 'taskName');
    textInputLabel.setAttribute('class', 'label');
    textInputLabel.textContent = 'Task name:';

    const textInput = document.createElement('input');
    textInput.setAttribute('type', 'text');
    textInput.setAttribute('id', 'taskName');
    textInput.setAttribute('class', 'text');
    textInput.value = taskObject.name;

    nameContainer.appendChild(textInputLabel);
    nameContainer.appendChild(textInput);

    // Append the name part to the project data container
    projectDatas.appendChild(nameContainer);

    // Description Container
    const descriptionContainer = document.createElement('div');
    descriptionContainer.classList.add('descriptionContainer');

    const descrInputLabel = document.createElement('label');
    descrInputLabel.setAttribute('for', 'taskDescr');
    descrInputLabel.setAttribute('class', 'label');
    descrInputLabel.textContent = 'Task description:';

    const textArea = document.createElement('textarea');
    textArea.setAttribute('rows', '3');
    textArea.setAttribute('col', '60');
    textArea.setAttribute('name', 'taskDescr');
    textArea.setAttribute('id', 'taskDescr');
    textArea.value = taskObject.description;

    descriptionContainer.appendChild(descrInputLabel);
    descriptionContainer.appendChild(textArea);

    // Append to main container
    projectDatas.appendChild(descriptionContainer);

    // Date Container
    const dateContainer = document.createElement('div');
    dateContainer.classList.add('dateContainer');

    const dateInputLabel = document.createElement('label');
    dateInputLabel.setAttribute('for', 'taskDate');
    dateInputLabel.setAttribute('class', 'label');
    dateInputLabel.textContent = 'Due date:';

    const dateInput = document.createElement('input');
    dateInput.setAttribute('type', 'date');
    dateInput.setAttribute('name', 'taskDate');
    dateInput.setAttribute('value', '2022-05-12');
    dateInput.setAttribute('id', 'taskDate');
    dateInput.value = taskObject.date;

    dateContainer.appendChild(dateInputLabel);
    dateContainer.appendChild(dateInput);

    projectDatas.appendChild(dateContainer);

    // Priority Container
    const priorityContainer = document.createElement('div');
    priorityContainer.classList.add('dateContainer');

    const priorityInputLabel = document.createElement('label');
    priorityInputLabel.setAttribute('for', 'taskPriority');
    priorityInputLabel.setAttribute('class', 'label');
    priorityInputLabel.textContent = 'Task priority:';

    const prioritySelect = document.createElement('select');
    prioritySelect.setAttribute('id', 'taskPriority');
    prioritySelect.setAttribute('name', 'taskPriority');

    const priorities = ['Low', 'Medium', 'High'];

    for (let i = 0; i < priorities.length; i++) {
      const option = document.createElement('option');
      option.setAttribute('value', `${priorities[i].toLowerCase()}`);
      option.textContent = priorities[i];
      prioritySelect.appendChild(option);
    }

    // Selects the appropriate priority
    const taskPriority = taskObject.priority;
    const options = Array.from(prioritySelect.options);
    options.forEach((option) => {
      if (option.value === taskPriority) {
        option.selected = true;
      }
    });

    priorityContainer.appendChild(priorityInputLabel);
    priorityContainer.appendChild(prioritySelect);

    projectDatas.appendChild(priorityContainer);

    // Buttons to confirm and cancel
    const btnContainer = document.createElement('div');
    btnContainer.classList.add('buttons');

    const cancelBtn = document.createElement('button');
    cancelBtn.classList.add('cancel');
    cancelBtn.textContent = 'Cancel';
    btnContainer.appendChild(cancelBtn);
    cancelBtn.addEventListener('click', () => {
      deleteForm(formBackdrop);
    });

    const confirmBtn = document.createElement('button');
    confirmBtn.classList.add('confirm');
    confirmBtn.textContent = 'Change';
    btnContainer.appendChild(confirmBtn);

    confirmBtn.addEventListener('click', () => {
      if (document.querySelector('#taskDate').value === '') {
        alert('Invalid date, please try again');
        return;
      }

      App.editTask(taskObject);
      deleteForm(formBackdrop);
    });

    projectDatas.appendChild(btnContainer);
    
    formContainer.appendChild(projectDatas);
    formBackdrop.appendChild(formContainer);

    document
      .querySelector('body')
      .insertBefore(formBackdrop, document.querySelector('.grid-container'));
  }

  function selectActiveDiv() {
    const activeProject = document.querySelector('.active');
    if (activeProject) activeProject.click();
  }

  // Handles task reordering
  function moveDiv(task, direction, container) {
    const tasks = Array.from(document.querySelectorAll('.taskEntry'));
    const offset = direction === 'up' ? -1 : 2;
    const condition =
      direction === 'up'
        ? task.taskIndex === 0
        : task.taskIndex === tasks.length - 1;
    if (condition) return;

    document
      .querySelector('#taskList')
      .insertBefore(container, tasks[task.taskIndex + offset]);
  }

  // Creates a div for a task;
  function createTaskDiv(taskObject) {
    const taskEntry = document.createElement('div');
    taskEntry.setAttribute('class', `taskEntry ${taskObject.priority}`);
    if (taskObject.completed === true) taskEntry.classList.add('completed');

    // Container for task priority, task name, and task moving arrows
    const taskPriority = document.createElement('div');
    taskPriority.classList.add('taskPriority');
    taskEntry.appendChild(taskPriority);

    // Icons to move task order
    const arrowContainer = document.createElement('div');
    arrowContainer.setAttribute('class', 'flex-column arrowContainer');

    const moveUpIcon = document.createElement('img');
    moveUpIcon.src = angleUp;
    moveUpIcon.alt = 'This arrow is used to move a task up the list';
    moveUpIcon.classList.add('arrows');

    moveUpIcon.addEventListener('click', () => {
      App.moveTask(taskObject, 'up', taskEntry);
    });

    const moveDownIcon = document.createElement('img');
    moveDownIcon.src = angleDown;
    moveDownIcon.alt = 'This arrow is used to move a task down the list';
    moveDownIcon.classList.add('arrows');

    moveDownIcon.addEventListener('click', () => {
      App.moveTask(taskObject, 'down', taskEntry);
    });

    arrowContainer.appendChild(moveUpIcon);
    arrowContainer.appendChild(moveDownIcon);
    taskPriority.appendChild(arrowContainer);

    const completedImg = document.createElement('img');
    completedImg.src = taskObject.completed === true ? checkIcon : squareIcon;
    completedImg.addEventListener('click', () => {
      App.changeCompletedStatus(taskObject, taskEntry);
      completedImg.src = taskObject.completed === true ? checkIcon : squareIcon;
    });

    const nameParagraph = document.createElement('p');
    nameParagraph.textContent = taskObject.name;

    taskPriority.appendChild(completedImg);
    taskPriority.appendChild(nameParagraph);

    // Icon bar with utility tools
    const statusBar = document.createElement('div');
    statusBar.classList.add('statusBar');

    const datePara = document.createElement('p');
    datePara.classList.add('datePara');
    datePara.textContent = format(new Date(taskObject.date), 'dd-MM-yyyy');
    statusBar.appendChild(datePara);

    // Button to check project info
    const infoImg = document.createElement('img');
    infoImg.src = infoIcon;
    infoImg.addEventListener('click', () => {
      const infoDiv = taskEntry.querySelector('.infoDescr');

      if (taskObject.info === true && infoDiv !== null) {
        infoDiv.remove();
        taskObject.info = false;
        infoImg.src = infoIcon;
      } else {
        taskObject.info = true;
        infoImg.src = greenInfoIcon;
        const infoDescr = document.createElement('div');
        infoDescr.classList.add('infoDescr');

        // This paragraph helps user keep track of what project the task belongs to
        const projectNameHeader = document.createElement('p');
        projectNameHeader.textContent = 'Project:';
        projectNameHeader.classList.add('descriptionHeader');
        infoDescr.appendChild(projectNameHeader);

        const projectName = document.createElement('p');
        projectName.textContent = `${taskObject.returnProject().name}`;
        projectName.classList.add('taskDescription');
        infoDescr.appendChild(projectName);

        // This will add a paragraph with the description
        const descriptionHeader = document.createElement('p');
        descriptionHeader.classList.add('descriptionHeader');
        descriptionHeader.textContent = 'Description:';
        infoDescr.appendChild(descriptionHeader);

        const taskDescription = document.createElement('p');
        taskDescription.textContent = taskObject.description;
        taskDescription.classList.add('taskDescription');
        infoDescr.appendChild(taskDescription);

        // If there is no description, just don't show it
        if (taskObject.description === '') {
          taskDescription.setAttribute('style', 'display:none;');
          descriptionHeader.setAttribute('style', 'display:none;');
        } else {
          taskDescription.style = '';
          descriptionHeader.style = '';
        }

        taskEntry.appendChild(infoDescr);
      }
    });
    statusBar.appendChild(infoImg);

    // Button to edit project info
    const editImg = document.createElement('img');
    editImg.src = editIcon;
    editImg.addEventListener('click', () => {
      editTaskForm(taskObject);
    });
    statusBar.appendChild(editImg);

    const delImg = document.createElement('img');
    delImg.src = crossIcon;
    delImg.addEventListener('click', () => {
      confirmDeleteForm(taskObject.returnProject(), 'task', taskObject);
    });
    statusBar.appendChild(delImg);

    // Flex container to house taskpriority and taskstatus containers
    const flexContainer = document.createElement('div');
    flexContainer.classList.add('flex');
    flexContainer.appendChild(taskPriority);
    flexContainer.appendChild(statusBar);
    taskEntry.appendChild(flexContainer);

    // Query the dom to get the list, and then append the project div to it
    document.querySelector('#taskList').appendChild(taskEntry);
  }

  // Feed it a form you want removed and it will do just that
  function deleteForm(form) {
    form.remove();
  }

  // Extract name, description, date and priority from the form and returns it in array form
  function getTaskData() {
    // Get the form to avoid querying the dom each time
    const form = document.querySelector('#formBackdrop');

    // Get all the information
    const taskName = form.querySelector('#taskName').value;
    const taskDescr = form.querySelector('#taskDescr').value;
    const taskDate = form.querySelector('#taskDate').value;
    const taskPriority = form.querySelector('#taskPriority').value;

    // Return it in array form
    return [taskName, taskDescr, taskDate, taskPriority];
  }

  // Extracts icon and name from the form and returns it in array form
  function getProjectData() {
    // Get the form
    const form = document.querySelector('#formBackdrop');

    // Extract the name
    const projectName = form.querySelector('#projName').value;
    let iconUrl;

    // Get the checked button's value
    const radioButtons = form.querySelectorAll('input[name="icon"]');
    radioButtons.forEach((button) => {
      if (button.checked === true) {
        iconUrl = icons[Number(button.value)];
      }
    });

    return [projectName, iconUrl];
  }

  // This displays a project when you click on it on the sidebar
  // It creates the relevant interface and proceeds to append the tasks available
  function showProjectInterface(projectObject) {
    // If there is a list, remove it
    document.querySelector('#list').remove();

    // Main container of the list
    const list = document.createElement('div');
    list.setAttribute('id', 'list');

    // Header and Tasklist
    const taskHeader = document.createElement('div');
    taskHeader.setAttribute('id', 'taskHeader');

    // Project Icon
    const iconHeader = document.createElement('img');
    iconHeader.src = projectObject.icon;
    iconHeader.style = 'height: 20px; margin-right: 8px;';
    taskHeader.appendChild(iconHeader);

    // Project name
    const projectTitle = document.createElement('span');
    projectTitle.textContent = projectObject.name;
    taskHeader.appendChild(projectTitle);

    // Append the header
    list.appendChild(taskHeader);

    const taskContainer = document.createElement('div');
    taskContainer.setAttribute('id', 'taskContainer');

    const taskCounter = document.createElement('div');
    taskCounter.setAttribute('id', 'taskCounter');

    // Creates paragraph to store number of tasks
    const counterPara = document.createElement('p');
    // Looks at array lenght and determines amount of tasks
    counterPara.textContent = `${projectObject.tasks.length} Task(s)`;
    taskCounter.appendChild(counterPara);

    // Create the button to add tasks
    const newProjectButton = document.createElement('div');
    newProjectButton.setAttribute('id', 'newTask');
    newProjectButton.textContent = '+';
    newProjectButton.addEventListener('click', () => {
      createTaskForm(projectObject);
    });
    taskCounter.appendChild(newProjectButton);

    // Append the whole thing to the container
    taskContainer.appendChild(taskCounter);

    // This is the container for the tasklist
    const taskList = document.createElement('div');
    taskList.setAttribute('id', 'taskList');
    taskContainer.appendChild(taskList);

    // Append everything
    list.appendChild(taskContainer);
    document.querySelector('.grid-container').insertBefore(list, document.querySelector('#footer'));
  }

  // Binds generic event listeners
  function bindEventListeners() {
    const newProjectBtn = document.querySelector('#newProj');
    newProjectBtn.addEventListener('click', createProjectForm);
  }

  function deleteGeneratedDivs(selector) {
    const firstDiv = document.querySelector(selector);
    if (firstDiv === null) return;

    // Creates an array of nodes with all the user projects/tasks
    const allDivs = Array.from(document.querySelectorAll(selector));
    allDivs.forEach((projectDiv) => projectDiv.remove());
  }

  function deleteAddTaskIcon() {
    const addTaskIcon = document.querySelector('#newTask');
    if (addTaskIcon) addTaskIcon.remove();
  }

  // Toggles active class for projects
  function setActive(projectContainer) {
    const activeProject = document.querySelector('.active');

    if (activeProject !== null) {
      activeProject.classList.remove('active');
      projectContainer.classList.add('active');
      return;
    }

    projectContainer.classList.add('active');
  }

  // This function empties the task list in a jiffy
  function emptyList() {
    document.querySelector('#list').textContent = '';
  }

  // Remove arrows for standard projects
  function removeArrows() {
    const allArrowsContainers = document.querySelectorAll('.arrowContainer');
    allArrowsContainers.forEach((arrows) => arrows.remove());
  }

  // Update task number counter
  function updateTaskNumber() {
    const noOfTasks = document.querySelector('#taskCounter p');
    const number = Number(noOfTasks.textContent.split(' ')[0]) + 1;
    noOfTasks.textContent = `${number} Task(s)`;
  }

  bindEventListeners();

  return {
    getProjectData,
    createProjectDiv,
    createTaskDiv,
    showProjectInterface,
    deleteGeneratedDivs,
    getTaskData,
    deleteAddTaskIcon,
    setActive,
    updateTaskNumber,
    removeArrows,
    selectActiveDiv,
    moveDiv,
  };
})();

export default domElements;
