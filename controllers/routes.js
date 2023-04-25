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

function clearConsole() {
    setTimeout(() => {
        // Check if the environment is Node.js
        if (typeof process !== 'undefined' && process.stdout && process.stdout.isTTY) {
            // Clear console for Windows and Unix systems
            process.stdout.write(process.platform === 'win32' ? '\x1Bc' : '\x1B[2J\x1B[3J\x1B[H');
        }
    }, 100);
}

// Export functions to be used in server.js
module.exports = {
    startApp: function () {
        clearConsole();
        const action = readlineSync.question(`What would you like to do?
1. View all departments         7. Add a role
2. View all roles               8. Add an employee
3. View all employees           9. Update an employee role or manager
4. View employees by department 10. Delete a department
5. View employees by manager    11. Delete a role
6. Add a department             12. Delete an employee
13. Exit
Please enter the corresponding number: `);

        switch (action) {
            case '1':
                this.viewAllDepartments();
                break;
            case '2':
                this.viewAllRoles();
                break;
            case '3':
                this.viewAllEmployees();
                break;
            case '4':
                this.viewEmployeesByDepartment();
                break;
            case '5':
                this.viewEmployeesByManager();
                break;
            case '6':
                this.addDepartment();
                break;
            case '7':
                this.addRole();
                break;
            case '8':
                this.addEmployee();
                break;
            case '9':
                this.updateEmployee();
                break;
            case '10':
                this.deleteDepartment();
                break;
            case '11':
                this.deleteRole();
                break;
            case '12':
                this.deleteEmployee();
                break;
            default:
                connection.end();
        }
    },

    viewAllDepartments: function () {
        connection.query('SELECT * FROM department', (err, res) => {
            if (err) throw err;
            console.table(res);
            this.startApp();
        });
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

    viewEmployeesByDepartment: function () {
        connection.query('SELECT * FROM department', (err, departments) => {
            if (err) throw err;

            if (departments.length === 0) {
                console.log('No departments available.');
                this.startApp();
                return;
            }

            const departmentChoices = departments.map((department) => `${department.id}: ${department.name}`);
            const selectedDepartmentId = readlineSync.keyInSelect(departmentChoices, 'Which department do you want to view employees for? ') + 1;

            connection.query('SELECT e1.id, e1.first_name, e1.last_name, role.title, department.name AS department, role.salary, CONCAT(e2.first_name, " ", e2.last_name) AS manager FROM employee e1 LEFT JOIN employee e2 ON e1.manager_id = e2.id LEFT JOIN role ON e1.role_id = role.id LEFT JOIN department ON role.department_id = department.id WHERE department_id = ?', [selectedDepartmentId], (err, res) => {
                if (err) throw err;
                console.table(res);
                this.startApp();
            });
        });
    },

    viewEmployeesByManager: function () {
        connection.query('SELECT * FROM employee', (err, employees) => {
            if (err) throw err;

            if (employees.length === 0) {
                console.log('No employees available.');
                this.startApp();
                return;
            }

            const managerChoices = employees.map((employee) => `${employee.id}: ${employee.first_name} ${employee.last_name}`);
            const selectedManagerId = readlineSync.keyInSelect(managerChoices, 'Which manager do you want to view employees for? ') + 1;

            connection.query('SELECT e1.id, e1.first_name, e1.last_name, role.title, department.name AS department, role.salary, CONCAT(e2.first_name, " ", e2.last_name) AS manager FROM employee e1 LEFT JOIN employee e2 ON e1.manager_id = e2.id LEFT JOIN role ON e1.role_id = role.id LEFT JOIN department ON role.department_id = department.id WHERE e1.manager_id = ?', [selectedManagerId], (err, res) => {
                if (err) throw err;
                console.table(res);
                this.startApp();
            });
        });
    },
    updateEmployee: function () {
        connection.query('SELECT * FROM employee', (err, employees) => {
            if (err) throw err;

            if (employees.length === 0) {
                console.log('No employees available.');
                this.startApp();
                return;
            }

            const employeeChoices = employees.map((employee) => `${employee.id}: ${employee.first_name} ${employee.last_name}`);
            const selectedEmployeeIndex = readlineSync.keyInSelect(employeeChoices, 'Which employee do you want to update? ');
            const selectedEmployeeId = employees[selectedEmployeeIndex].id;

            const action = readlineSync.question('What would you like to do? (update employee role, update employee manager): ');

            switch (action) {
                case 'update employee role':
                    connection.query('SELECT * FROM role', (err, roles) => {
                        if (err) throw err;

                        if (roles.length === 0) {
                            console.log('No roles available.');
                            this.startApp();
                            return;
                        }

                        const roleChoices = roles.map((role) => `${role.id}: ${role.title}`);
                        const selectedRoleId = readlineSync.keyInSelect(roleChoices, 'What is the new role for this employee? ') + 1;

                        connection.query('UPDATE employee SET role_id = ? WHERE id = ?', [selectedRoleId, selectedEmployeeId], (err) => {
                            if (err) throw err;
                            console.log('Employee role updated successfully.');
                            this.startApp();
                        });
                    });
                    break;
                case 'update employee manager':
                    connection.query('SELECT * FROM employee', (err, employees) => {
                        if (err) throw err;

                        if (employees.length === 0) {
                            console.log('No employees available.');
                            this.startApp();
                            return;
                        }

                        const managerChoices = employees.map((employee) => `${employee.id}: ${employee.first_name} ${employee.last_name}`).concat(['None']);
                        const selectedManagerIndex = readlineSync.keyInSelect(managerChoices, 'Who is the new manager for this employee? ');
                        const selectedManagerId = selectedManagerIndex !== -1 && selectedManagerIndex !== employees.length ? employees[selectedManagerIndex].id : null;

                        connection.query('UPDATE employee SET manager_id = ? WHERE id = ?', [selectedManagerId, selectedEmployeeId], (err) => {
                            if (err) throw err;
                            console.log('\x1b[32m%s\x1b[0m', 'Employee manager updated successfully.');
                            this.startApp();
                        });
                    });
                    break;
                default:
                    this.startApp();
            }
        });
    },

    addDepartment: function () {
        const departmentName = readlineSync.question('Enter the name of the new department: ');

        connection.query('INSERT INTO department (name) VALUES (?)', [departmentName], (err) => {
            if (err) throw err;
            console.log('\x1b[32m%s\x1b[0m', 'Department added successfully.');
            this.startApp();
        });
    },

    addRole: function () {
        connection.query('SELECT * FROM department', (err, departments) => {
            if (err) throw err;

            if (departments.length === 0) {
                console.log('No departments available.');
                this.startApp();
                return;
            }

            const departmentChoices = departments.map((department) => `${department.id}: ${department.name}`);
            const selectedDepartmentId = readlineSync.keyInSelect(departmentChoices, 'Which department does the new role belong to? ') + 1;

            const title = readlineSync.question('Enter the title of the new role: ');
            const salary = readlineSync.questionFloat('Enter the salary of the new role: ');

            connection.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, selectedDepartmentId], (err) => {
                if (err) throw err;
                console.log('\x1b[32m%s\x1b[0m', 'Role added successfully.');
                this.startApp();
            });
        });
    },

    addEmployee: function () {
        connection.query('SELECT * FROM role', (err, roles) => {
            if (err) throw err;

            if (roles.length === 0) {
                console.log('No roles available.');
                this.startApp();
                return;
            }

            const roleChoices = roles.map((role) => `${role.id}: ${role.title}`);
            const selectedRoleId = readlineSync.keyInSelect(roleChoices, 'What is the role for the new employee? ') + 1;

            connection.query('SELECT * FROM employee', (err, employees) => {
                if (err) throw err;

                const firstName = readlineSync.question('Enter the first name of the new employee: ');
                const lastName = readlineSync.question('Enter the last name of the new employee: ');

                const managerChoices = employees.map((employee) => `${employee.id}: ${employee.first_name} ${employee.last_name}`).concat(['None']);
                const selectedManagerIndex = readlineSync.keyInSelect(managerChoices, 'Who is the manager for the new employee? ');
                const selectedManagerId = selectedManagerIndex !== -1 && selectedManagerIndex !== employees.length ? employees[selectedManagerIndex].id : null;

                connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [firstName, lastName, selectedRoleId, selectedManagerId], (err) => {
                    if (err) throw err;
                    console.log('\x1b[32m%s\x1b[0m', 'Employee added successfully.');
                    this.startApp();
                });
            });
        });
    },

    deleteDepartment: function () {
        connection.query('SELECT * FROM department', (err, departments) => {
            if (err) throw err;

            if (departments.length === 0) {
                console.log('No departments available.');
                this.startApp();
                return;
            }

            const departmentChoices = departments.map((department) => `${department.id}: ${department.name}`);
            const selectedDepartmentIndex = readlineSync.keyInSelect(departmentChoices, 'Which department do you want to delete? ');
            const selectedDepartmentId = departments[selectedDepartmentIndex].id;

            connection.query('DELETE FROM department WHERE id = ?', [selectedDepartmentId], (err) => {
                if (err) throw err;
                console.log('\x1b[32m%s\x1b[0m', 'Department deleted successfully.');
                this.startApp();
            });
        });
    },

    deleteRole: function () {
        connection.query('SELECT * FROM role', (err, roles) => {
            if (err) throw err;

            if (roles.length === 0) {
                console.log('No roles available.');
                this.startApp();
                return;
            }

            const roleChoices = roles.map((role) => `${role.id}: ${role.title}`);
            const selectedRoleId = readlineSync.keyInSelect(roleChoices, 'Which role do you want to delete? ');
            const selectedRole = roles[selectedRoleId];

            connection.query('DELETE FROM role WHERE id = ?', [selectedRole.id], (err) => {
                if (err) throw err;
                console.log('\x1b[32m%s\x1b[0m', 'Role deleted successfully.');

                connection.query('UPDATE employee SET role_id = NULL WHERE role_id = ?', [selectedRole.id], (err) => {
                    if (err) throw err;
                    console.log(`All employees with the role '${selectedRole.title}' have had their role set to 'None'.`);
                    this.startApp();
                });
            });
        });
    },

    deleteEmployee: function () {
        connection.query('SELECT * FROM employee', (err, employees) => {
            if (err) throw err;

            if (employees.length === 0) {
                console.log('No employees available.');
                this.startApp();
                return;
            }

            const employeeChoices = employees.map((employee) => `${employee.id}: ${employee.first_name} ${employee.last_name}`);
            const selectedEmployeeIndex = readlineSync.keyInSelect(employeeChoices, 'Which employee do you want to delete? ');
            const selectedEmployeeId = employees[selectedEmployeeIndex].id;

            connection.query('DELETE FROM employee WHERE id = ?', [selectedEmployeeId], (err) => {
                if (err) throw err;
                console.log('\x1b[32m%s\x1b[0m', 'Employee deleted successfully.');
                this.startApp();
            });
        });
    },
};
