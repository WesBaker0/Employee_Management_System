USE company_db;

INSERT INTO department (name)
VALUES
  ("Human Resources"),
  ("Finance"),
  ("Engineering");

INSERT INTO role (title, salary, department_id)
VALUES
  ("HR Manager", 80000, 1),
  ("HR Specialist", 60000, 1),
  ("Accountant", 70000, 2),
  ("Software Engineer", 90000, 3),
  ("Project Manager", 95000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ("John", "Wick", 1, NULL),
  ("Kevin", "Smith", 2, 1),
  ("Mike", "Tyson", 3, NULL),
  ("Frodo", "Baggins", 4, NULL),
  ("Bill", "Nye", 5, 4);
