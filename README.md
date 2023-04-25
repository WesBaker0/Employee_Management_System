# Employee Management System

https://user-images.githubusercontent.com/131714206/234142787-da63013d-a847-4a9a-9c5c-7944bc012ad8.mp4

## Description

Employee Management System is a command-line application that allows users to view, add, and update data related to their organization's departments, roles, and employees. This application is built using Node.js, MySQL, and the Readline-sync package, making it easy for users to interact with their database in a user-friendly manner.

## Features

- View all departments, roles, and employees
- Add a new department, role, or employee
- Update an existing employee's role

## Installation

To install and use the Employee Management System, follow these steps:

1. Clone this repository to your local machine.
2. Install the required dependencies by running npm install in your terminal/command prompt.
3. Set up your MySQL database by running the provided schema.sql file in a MySQL client (e.g., MySQL Workbench, phpMyAdmin
4. Optionally, you can also run the seeds.sql file to populate your database with sample data.
5. Update the .env file to your personal mysql username and password. 
6. In your terminal/command prompt, navigate to the root directory of the cloned repository and run node server.js to start the application.
7. Follow the on-screen prompts to manage your organization's departments, roles, and employees.

## Dependencies

- Node.js
- MySQL2
- Readline-sync
- Dotenv
