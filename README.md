# library

<h2 align="center"><a  href="https://aurelien-genois.github.io/library/">Live Demo</a></h2>

## Description
The [fifth Odin project](https://www.theodinproject.com/paths/full-stack-javascript/courses/javascript/lessons/library) is a book library for practice JavaScript (Object constructor, Object prototype, ES6 Class ...).


## Features
<p align="center">
<img src="screenshot-1.gif" alt="screenshot-1" width="80%"/></p>
- Can... => create a new book / read

 <br>
 <br>
<p align="center">
<img src="screenshot-2.gif" alt="screenshot-2" width="80%"/></p>
- Can... => like/dislike, delete a book

 <br>
 <br>
<p align="center">
<img src="screenshot-3.gif" alt="screenshot-3" width="80%"/></p>
- Can... => edit a book

 <br>
 <br>
<p align="center">
<img src="screenshot-4.gif" alt="screenshot-4" width="80%"/></p>
- Can... => sort by title down/title up, by likes, by nb pages down




## Challenges
The goal was to use the special constructor function for create objects and to add methods only on its prototype to prevent methods duplication. Later we change the constructor to a ES6 class to set the methods directly in the same bloc as the constructor function.

To keep in memory the library, localStorage is used. When objects are parsed (by JSON) from localStorage, they don't have the Book's prototype anymore (because they lose it when they are turned to string (by JSON)), so reassign the prototype on them with Object.setPrototypeOf() to Book's prototype is usefull for using Book's methods.

With this project, I used rem units with redefining global font-size and grid-template-columns to render responsive sizes and layout.

I learnt also to style html inputs with CSS pseudo-classes (hover, active, checked,... ) & pseudo-elements (after, before, placeholder).
