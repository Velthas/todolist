import './style.css';
import './projectForm.css';
import star from './images/star.svg'
import cards from './images/playing-cards.svg'
import shopping from './images/shopping-bag.svg'
import heart from './images/heart.svg'
import book from './images/book-alt.svg'

const projectData = (function () {

    //Array with icon urls
    const icons = [star, cards, shopping, heart, book]

    //Factory functions to create projects
    function createProject (name, icon) {
        const tasks = [];

        return {name, icon, tasks}
    }

    //Factory function to create tasks
    function createTask (name, date, description, priority) {

        return {name, date, description, priority, completed: false}
    }

    function extractIcon (index) {
        return icons[index];
    }

    return {extractIcon}

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
        
        projectDatas.appendChild(btnContainer);

        //Now append everything to make it appear
        formContainer.appendChild(projectDatas);
        
        formBackdrop.appendChild(formContainer)

        document.querySelector('body').insertBefore(formBackdrop, document.querySelector('#header'));
    }

    function deleteForm (form)  {
        form.remove();
    }

    setTimeout(createProjectForm, 5000)

    {createProjectForm}

})();