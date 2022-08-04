# TO-DO LIST

## Live at: https://velthas.github.io/todolist

### 1. Overview

<p>To-do list is a productivity application allowing you to keep track of events and things to do throughout the day.</p>
<p>This project allowed me to put all the knowledge I had accumulated on objects to the test. I now fully appreciate how versatile objects can be, and can't wait to uncover even more of this tool's amazing potential.</p>

### 2. Functionality

<p>Upon first loading the page, the user will be presented with a series of preset (or standard) projects, and a 'projects' section allowing them to create their own. Before diving into the standard projects, let's have a look at the basic functionality of the application, that is, creating projects and appending tasks to them.</p>

#### 2.1 How to create a project:

1. On the sidebar, click on the "(+)" icon next to 'PROJECTS' to summon the project creation form.
2. For this form, you will need to input a name for your project and select an icon to associate it with.
3. Clicking confirm will create the project and insert it on the sidebar for you to access.
4. As of now projects cannot be modified, but they can be deleted by clicking the cross icon next to the relevant project div.

#### 2.2 How to create a task:

1. First of all, open the project your wish to store your task under.
2. On the rightmost side of the screen (or down if you are using mobile) you should see the name of the project you selected, and below it another "(+)" button. Clicking on it will summon the task creation form.
3. This time, you are asked to specify the task's name, its description, the due date and level of priority. All these fields can be left empty except for the date, which is mandatory.
4. Clicking the "Confirm" button will append the task to your project, and it will now be there each time you access it unless deleted.
5. Tasks can be interacted with in a variety of ways using the status bar: info can be displayed, an edit form can be summoned to alter their data, and they can finally also be deleted.
6. Lastly, the task can also be marked as completed by clicking the leftmost 'square' icon, which will trigger some significant style changes to reflect this change.

#### 2.3 Standard Projects

<p>Once we have created our fair share of projects and tasks, users will find it can be useful to navigate them in alternate ways. This is what standard projects are for.
Standard projects are populated by looking at all the tasks within the projects created by the user: each is evaluated against different criteria, and then appended if there is a match. Let's look at what each of my standard projects is looking for:</p>

- **Today**: gathers all projects whose due date is set for the current day. This does not mean it has all the tasks to be done within the next 24 hours, but rather just until midnight of the current day.
- **Urgent**: gathers all project with a priority of high, regardless of date.
- **Home**: is a collection of ALL the tasks in the system at the moment.

<p>If in doubt about what project a task is from, clicking on the info button will have the project name listed there. In addition to having tasks grouped this way, any change done to tasks within these standard projects will also be reflected on user projects. </p>

### 3. Technologies

<p>The point of these projects is to practice old things and to add more of them on each go. I thought it could be useful for my future self to have a breakdown of what I practiced so far, and what I added: </p>

- **Webpack**: I love how versatile this tool is proving to be, and am enjoying more and more splitting my code into modules to keep it well organized. For the future, it might be worth looking into new things I can add to my webpack toolkit.
- **date-fns**: This is the first time I purposefully used a library, aside from those imported in C during CS50. Date-fns is amazing to work with dates, and it allowed me to both format dates to european standards and run some checks for standard projects.
- **localStorage**: I learned about local storage and session storage, meaning I could finally make my application remember and store projects even when the page is refreshed. This was not without error, as I had to deal with my objects not being saved properly, which led me to learning about JSON and the need for stringification when storing objects. I imagine this is not as safe as using an actual database, but I am still happy The Odin Project pushed me this way.
- **Linting**: After continuing the javascript path on The Odin Project, I was introduced to code linting and ESlint, so I had to try it for myself. I used the AirBnB style guide, and this time around went through the errors manually to ensure I understood where I went wrong. Needless to say, I think this was a great exercise and I am looking forward to using this tool again for my future projects

### 4. The Great Refactoring of August 22

<p>This is just a joke title for a serious section: after going back to complete the recently added Intermediate HTML and CSS course on the Odin Project, I thought I'd review objects. In doing so, I realized this application was not extremely OOP friendly, and did not employ inheritance to the extent I wanted.</p>

<p>And so I did it. I added, cut, modified and stiched everything back together. It was certainly a challenge, but I am glad I took the time to do it, as I now appreciate the real power of these tools and can see their potential. Let's see what changed:</p>

- **Inheritance**: Before this great refactoring my projects and task objects made no use of inheritance at all, all the now methods were stored inside the project IIFE and called when needed. Not only was this confusing from the outside, but it also made looking for the proper function problematic. All relevant functionality is now attached to the appropriate objects using Object.create in a factory function.
- **Cleaner interfaces**: My code very much resembled pure functional programming in the beginning (and spaghetti code at that), and this greatly penalized the code's understandability. This time, I made sure that all operations requiring changes on both the DOM and under the hood were combined in the applicationFlow's module. This way, everything is more orderly and understandable, and as a result, adding features does not feel like patchwork.
- **Localstorage Drama**: Understandably, I had troubles storing up methods in my objects because of JSON's peculiarity. I would lie if I said this was not a head scratcher, but I luckily pulled through with the help of the Object.assign method. I created an object pointing to the object with the methods using Object.create, then stitched my parsed objects on top of it to give them back their methods. Quite a trip, but worth it.
- **Moving tasks around**: This was something I had already included on request of the reception staff, but I refactored it aswell and I suppose it is worth mentioning: tasks inside of user created projects can now be moved up and down using the arrow icons located on the leftmost side of their container.
