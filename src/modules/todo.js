import '../style/style.css';
import '../style/projectForm.css';
import '../style/mediaQueries.css';

const projectData = (function () {
  let projects = [];

  const projectMethods = {
    insertTask(info) {
      const newTask = createTask(
        info[0],
        info[1],
        info[2],
        info[3],
      );
      newTask.projectIndex = this.position;
      newTask.taskIndex = this.tasks.indexOf(newTask);

      this.tasks.push(newTask);
    },
    returnTasksArray() {
      return this.tasks;
    },
  };

  const taskMethods = {
    editTask(data) {
      [this.name, this.description, this.date, this.priority] = data;
      updatePositions();
    },
    deleteTask() {
      projects[this.projectIndex].tasks.splice(this.taskIndex, 1);
      updatePositions();
    },
    move(direction) {
      const project = projects[this.projectIndex];
      const task = this;

      this.deleteTask();
      const newPosition = direction === 'up' ? this.taskIndex - 1 : this.taskIndex + 1;
      project.tasks.splice(newPosition, 0, task);
      updatePositions();
    },
    changeCompletion() {
      this.completed = this.completed !== true;
    },
    returnProject() {
      return projects[this.projectIndex];
    },
  };

  // Factory for projects
  function createProject(name, icon) {
    const tasks = [];
    const position = 0;
    const standard = false;

    const newProject = Object.create(projectMethods);

    newProject.name = name;
    newProject.icon = icon;
    newProject.tasks = tasks;
    newProject.position = position;
    newProject.standard = standard;

    return newProject;
  }

  // Factory for tasks
  function createTask(name, description, date, priority) {
    const newTask = Object.create(taskMethods);

    newTask.name = name;
    newTask.description = description;
    newTask.date = date;
    newTask.priority = priority;
    newTask.completed = false;
    newTask.projectIndex = null; // Index of proj in projects array
    newTask.taskIndex = null; // Index of task in tasks array

    return newTask;
  }

  function addProject(projectObject) {
    projects.push(projectObject);
    projectObject.position = projects.length - 1;
  }

  const deleteProject = (position) => {
    projects.splice(position, 1);
    updatePositions();
  };

  const getProjects = () => projects;

  function updatePositions() {
    for (let i = 0; i < projects.length; i++) {
      projects[i].position = i;

      for (let k = 0; k < projects[i].tasks.length; k++) {
        const task = projects[i].tasks[k];
        task.projectIndex = i;
        task.taskIndex = k;
      }
    }
  }

  function uploadSaved(storedProjects) {
    projects = storedProjects;

    for (let i = 0; i < projects.length; i++) {
      const objWithMethods = Object.create(projectMethods);
      projects[i] = Object.assign(objWithMethods, projects[i]);

      for (let k = 0; k < projects[i].tasks.length; k++) {
        const taskObjWithMethods = Object.create(taskMethods);
        projects[i].tasks[k] = Object.assign(taskObjWithMethods, projects[i].tasks[k]);
      }
    }
  }

  return {
    createProject,
    createTask,
    addProject,
    deleteProject,
    getProjects,
    uploadSaved,
  };
}());

export { projectData };
