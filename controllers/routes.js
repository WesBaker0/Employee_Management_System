const readlineSync = require('readline-sync');
const mysql2 = require('mysql2');

const connection = mysql2.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

// Connect to the database
connection.connect((err) => {
    if (err) throw err;
});

// Export functions to be used in server.js
module.exports = {
    startApp: function () {
        const action = readlineSync.question('What would you like to do? (view all departments, view all roles, view all employees, add a department, add a role, add an employee, update an employee role, exit): ');

        switch (action) {
            case 'view all departments':
                this.viewAllDepartments();
                break;
            case 'view all roles':
                this.viewAllRoles();
                break;
            case 'view all employees':
                this.viewAllEmployees();
                break;
            case 'add a department':
                this.addDepartment();
                break;
            case 'add a role':
                this.addRole();
                break;
            case 'add an employee':
                this.addEmployee();
                break;
            case 'update an employee role':
                this.updateEmployeeRole();
                break;
            default:
                connection.end();
        }
    },

    viewAllRoles: function () {
        connection.query('SELECT role.id, role.title, role.salary, department.name AS department FROM role JOIN department ON role.department_id = department.id', (err, res) => {
            if (err) throw err;
            console.table(res);
            this.startApp();
        });
    },

    viewAllEmployees: function () {
        connection.query('SELECT e1.id, e1.first_name, e1.last_name, role.title, department.name AS department, role.salary, CONCAT(e2.first_name, " ", e2.last_name) AS manager FROM employee e1 LEFT JOIN employee e2 ON e1.manager_id = e2.id LEFT JOIN role ON e1.role_id = role.id LEFT JOIN department ON role.department_id = department.id', (err, res) => {
            if (err) throw err;
            console.table(res);
            this.startApp();
        });
    },

    addDepartment: function () {
        const departmentName = readlineSync.question('What is the name of the new department? ');
        connection.query('INSERT INTO department (name) VALUES (?)', [departmentName], (err) => {
            if (err) throw err;
            console.log('Department added successfully.');
            this.startApp();
        });
    },

    addRole: function () {
        connection.query('SELECT * FROM department', (err, departments) => {
            if (err) throw err;
    
            if (departments.length === 0) {
                console.log('No departments available. Please add a department before adding a role.');
                this.startApp();
                return;
            }
    
            const roleTitle = readlineSync.question('What is the title of the new role? ');
            const roleSalary = readlineSync.question('What is the salary of the new role? ');
    
            const departmentChoices = departments.map((department) => `${department.id}: ${department.name}`);
            const selectedDepartmentId = readlineSync.keyInSelect(departmentChoices, 'Which department does the new role belong to? ') + 1;
    
            connection.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [roleTitle, roleSalary, selectedDepartmentId], (err) => {
                if (err) throw err;
                console.log('Role added successfully.');
                this.startApp();
            });
        });
    },

    addEmployee: function () {
        connection.query('SELECT * FROM role', (err, roles) => {
            if (err) throw err;
            connection.query('SELECT * FROM employee', (err, employees) => {
                if (err) throw err;
    
                if (roles.length === 0) {
                    console.log('No roles available. Please add a role before adding an employee.');
                    this.startApp();
                    return;
                }
    
                const firstName = readlineSync.question('What is the first name of the new employee? ');
                const lastName = readlineSync.question('What is the last name of the new employee? ');
    
                const roleChoices = roles.map((role) => `${role.id}: ${role.title}`);
                const selectedRoleId = readlineSync.keyInSelect(roleChoices, 'What is the role of the new employee? ') + 1;
    
                const managerChoices = employees.map((employee) => `${employee.id}: ${employee.first_name} ${employee.last_name}`).concat(['None']);
                const selectedManagerIndex = readlineSync.keyInSelect(managerChoices, 'Who is the manager of the new employee? ');
                const selectedManagerId = selectedManagerIndex !== -1 && selectedManagerIndex !== employees.length ? employees[selectedManagerIndex].id : null;
    
                connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [firstName, lastName, selectedRoleId, selectedManagerId], (err) => {
                    if (err) throw err;
                    console.log('Employee added successfully.');
                    this.startApp();
                });
            });
        });
    },

    updateEmployeeRole: function () {
        connection.query('SELECT * FROM employee', (err, employees) => {
            if (err) throw err;
            connection.query('SELECT * FROM role', (err, roles) => {
                if (err) throw err;
                const employeeIndex = readlineSync.keyInSelect(employees.map((employee) => `${employee.first_name} ${employee.last_name}`), 'Which employee do you want to update? ');
                const employeeId = employees[employeeIndex].id;
                const roleId = readlineSync.keyInSelect(roles.map((role) => role.title), 'What is the new role for this employee? ') + 1;

                connection.query('UPDATE employee SET role_id = ? WHERE id = ?', [roleId, employeeId], (err) => {
                    if (err) throw err;
                    console.log('Employee role updated successfully.');
                    this.startApp();
                });
            });
        });
    }
};
