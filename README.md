# 💫 Cybermodding

EPICODE Capstone Project. A complete forum platform supporting chat, threads, comments, likes, Moderators and Admin panels etc.

<p>The Front-end side is developed with Angular, SASS and Bootstrap</p>
<p>The Back-end side is developed with Java, Springboot and PostgreSQL</p>

<br>
<img src="Repo assets/cybm.png" style="width: 100%">
<br>

<h4>Current Version: 1.1</h4>

-   Implemented full responsiveness design

<p></p>

<h5>TO-DO after the v1.1:</h5>

-   Security checks on both Front-end and Back-end
-   Back-end responses improvements
-   Cleanup and general optimizations

<img src="Repo assets/my-hr.png" style="height:8px; width:100%">

## 📜 How to

<p>In order to succesfully run this project on your machine there are few things to setup.</p>

`If you only use VS Code:`

-   The Java Extension Pack. The official one from Microsoft!
-   Springboot Extension Pack
-   Angular Language Server Extension

`If you use Eclipse and VS Code:`

-   Only Angular Language Server on VS Code

<img src="Repo assets/my-hr.png" style="height:8px; width:100%">

<p></p>

<h4>Database:</h4>

I'm using pgAdmin to manage my PostgreSQL DB.
Create a DB named `Cybermodding-db` in order to correctly run and store the data from the Back-end project.

<h4>Back-end</h4>

Open the Back-end project with either Eclipse or VS Code. Open the `runners/Runner.java` file.
Here you'll find the method called 'run'. There are some commented calls as you will see, and they need to be executed once. This will initialize the Database by creating the entities and saving some datas into it.
So.. uncomment all the calls inside the run method.

Now launch and wait until you see `** Ops Done **` on the console.

You can now comment again all the calls of the run method. This is important because if you run again/refresh the project then all the methods will be executed again. It's not needed!

<h4>Front-end</h4>

Then, open the Front-end project with VS Code and open an istance of the integrated terminal (Terminal - New Terminal).

Run the command `npm i` This will install all the dependencies needed to run the project.

Run the command `ng s -o` This will compile and open a new browser window with the localhost server up and running.
