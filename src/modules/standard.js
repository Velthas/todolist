import { isToday } from 'date-fns';

import { projectData } from './todo';

import homeIcon from '../images/home.svg';
import todayIcon from '../images/time-twenty-four.svg';
import urgentIcon from '../images/engine-warning.svg';

const defaultProjects = (function () {
  // Three default projects as of today
  const home = projectData.createProject('Home', homeIcon);
  const today = projectData.createProject('Today', todayIcon);
  const urgent = projectData.createProject('Urgent', urgentIcon);
  const standardProjects = [home, today, urgent];

  function get() { return standardProjects; }

  function loadTasks() {
    const projects = projectData.getProjects();

    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];

      for (let j = 0; j < project.tasks.length; j++) {
        const task = project.tasks[j];

        home.tasks.push(task); // All tasks are stored in home
        if (task.priority === 'high') urgent.tasks.push(task); // High priority in urgent
        if (isToday(new Date(task.date))) today.tasks.push(task); // Due today in today
      }
    }
  }

  // Used to clear before appending new tasks
  const clear = (stdProj) => {
    stdProj.tasks = [];
  };

  function addImages() {
    const homeImg = document.querySelector('#home img');
    const urgentImg = document.querySelector('#urgent img');
    const todayImg = document.querySelector('#today img');

    homeImg.src = homeIcon;
    urgentImg.src = urgentIcon;
    todayImg.src = todayIcon;
  }

  addImages();

  return { get, clear, loadTasks };
}());

export { defaultProjects };
