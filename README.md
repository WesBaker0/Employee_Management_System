Employee Management System

***

Description

Employee Management System is a command-line application that allows users to view, add, and update data related to their organization's departments, roles, and employees. This application is built using Node.js, MySQL, and the Readline-sync package, making it easy for users to interact with their database in a user-friendly manner.

***

Features

View all departments, roles, and employees
Add a new department, role, or employee
Update an existing employee's role

***

Installation

To install and use the Employee Management System, follow these steps:

Clone this repository to your local machine.
Install the required dependencies by running npm install in your terminal/command prompt.
Set up your MySQL database by running the provided schema.sql file in a MySQL client (e.g., MySQL Workbench, phpMyAdmin). Optionally, you can also run the seeds.sql file to populate your database with sample data.
Update the .env file to your personal mysql username and password. 
In your terminal/command prompt, navigate to the root directory of the cloned repository and run node server.js to start the application.
Follow the on-screen prompts to manage your organization's departments, roles, and employees.

***

Dependencies

Node.js
MySQL2
Readline-sync
Console.table
Dotenv

***
