USE employee_db;

INSERT INTO role (title, salary, department_id)
VALUES ("Finance Manager", 110000, 1),
    ("Technical Director", 120000, 2),
    ("Senior Developer", 95000, 2),
    ("Sales Manager", 100000, 3),
    ("Senior Account Manager", 90000, 3),
    ("Finance Payable officer", 70000, 1),
    ("HR Officer", 65000, 4),
    ("HR Manager", 97000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Kent", "Ivans", 1, NULL),
    ("Aaron", "Kloska", 2, NULL),
    ("Alfred", "Pacleb", 4, Null),
    ("Ben", "Kellman", 3, 2),
    ("Rebbecca", "Stayer", 5, 3),
    ("Marica", "Tarbor", 6, 1),
    ("Camellia", "Pylant", 7, 8),
    ("Shaun", "Rael", 8, NULL),
    ("Jeniffer", "Jezek", 5, 3),
    ("Brittney", "Lolley",7, 8);