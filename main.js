const { prompt } = require("inquirer");
const mysql = require("mysql");

// Establishing the database connection

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "test@123",
    database: "employee_db",
});

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected as id " + connection.threadId);
    start();
});

// Asking initial questions
function start() {
    prompt({
        name: "Action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "Veiw all employee details",
            "Add new employee details",
            "Update employee details",
            "Delete employee Details",
            "Exit the application",
        ],
    }).then((answer) => {
        switch (answer.Action) {
            case "Veiw all employee details":
                view();
                break;
            case "Add new employee details":
                add();
                break;
            case "Update employee details":
                update();
                break;
            case "Delete employee Details":
                remove();
                break;
            default:
                console.log();
                process.exit();
                break;
        }
    });
}

//Viewing

function view() {
    prompt({
        type: "list",
        name: "View",
        Message: "What would you like to view?",
        choices: [
            "All Employees",
            "All Employees by Department",
            "All Employees by Manager",
            "All Departments",
            "All Roles",
            "The total utilized budget of a department",
        ],
    }).then((answer) => {
        switch (answer.View) {
            case "All Employees":
                viewAllEmply();
                break;
            case "All Employees by Department":
                viewEmplByDept();
                break;
            case "All Employees by Manager":
                viewEmplByMgr();
                break;
            case "All Departments":
                viewAllDept();
                break;
            case "All Roles":
                viewAllRoles();
                break;
            default:
                viewBudget();
                break;
        }
    });
}

//Adding 
function add() {
    prompt({
        type: "list",
        name: "Add",
        Message: "What would you like to add?",
        choices: [
            "Add new employee",
            "Add new role",
            "Add new depatment",
        ],
    }).then((answer) => {
        switch (answer.Add) {
            case "Add new employee":
                addEmployee();
                break;
            case "Add new role":
                addRole();
                break;
            case "Add new department":
                addDepartment();
                break;
        }
    });
}

//Updating

function update() {
    prompt({
        type: "list",
        name: "Update",
        Message: "What would you like to update?",
        choices: [
            "Update employee roles",
            "Update employee managers",
        ],
    }).then((answer) => {
        switch (answer.Update) {
            case "Update employee roles":
                updateEmployeeRoles();
                break;
            case "Update employee managers":
                updateEmployeeManagers();
                break;
        }
    });
}

// Deleting
function remove() {
    prompt({
        type: "list",
        name: "Remove",
        Message: "What would you like to remove?",
        choices: [
            "Delete employee",
            "Delete role",
            "Delete department",
        ],
    }).then((answer) => {
        switch (answer.Remove) {
            case "Delete employee":
                removeEmployee();
                break;
            case "Delete role":
                removeRole();
                break;
            case "Delete department":
                removeDepartment();
                break;
        }
    });
}

//Viewing Employee, Role and Department

async function viewAllEmply() {
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, name AS department, role.salary, manager_id AS manager FROM employee INNER JOIN role ON (employee.role_id = role.id) INNER JOIN department ON (department.id = role.department_id)`;
    await connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("");
        console.table(res);
    });
    start();
}

async function viewAllRoles() {
    const query = `SELECT role.id, role.title, role.salary, name AS department FROM role INNER JOIN department ON (role.department_id = department.id)`;
    await connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("");
        console.table(res);
    });
    start();
}

async function viewAllDept() {
    await connection.query(`SELECT * FROM department;`, (err, res) => {
        if (err) throw err;
        console.log("");
        console.table(res);
    });
    start();
}

//Viewing employee by department or manager

async function viewEmplByDept() {
    await prompt({
        type: "list",
        name: "department",
        message: "Which department would you like to view?",
        choices: ["Finance", "IT", "Sales", "HR"],
    }).then((answer) => {
        const query = `SELECT employee.id, first_name, last_name, role.title, name AS department, role.salary, manager_id AS manager FROM employee INNER JOIN role ON (employee.role_id = role.id) INNER JOIN department ON (department.id = role.department_id) WHERE department.name = ?;`;
        connection.query(query, [answer.department], (err, res) => {
            if (err) throw err;
            console.log("");
            console.table(res);
        });
        start();
    });
}

async function viewEmplByMgr() {
    await prompt({
        type: "list",
        name: "manager",
        message: "Which manager would you like to view? (Kent Ivans [Finance Manager] = 1; Aaron Kloska [Technical Director] = 2; Alfred Pacleb [Sales Manager] = 4; Shaun Rael[HR Manager] = 8;) ",
        choices: ["1", "3", "5", "7"],
    }).then((answer) => {
        const query = `SELECT employee.id, first_name, last_name, role.title, name AS department, role.salary, manager_id AS manager FROM employee INNER JOIN role ON (employee.role_id = role.id) INNER JOIN department ON (department.id = role.department_id) WHERE manager_id = ?;`;
        connection.query(query, [answer.manager], (err, res) => {
            if (err) throw err;
            console.log("");
            console.table(res);
        });
        start();
    });
}

// View the total utilized budget of a department -- ie the combined salaries of all employees in that department
function viewBudget() {
    const query = `SELECT name AS department, SUM (DISTINCT salary) AS budget FROM department INNER JOIN role ON (department.id = role.department_id) INNER JOIN employee ON (role.id = employee.role_id) GROUP BY name ORDER BY budget DESC`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("");
        console.table(res);
    });
    start();
}

//Adding Employee, Role and Department

async function addEmployee() {
    await prompt([{
            type: "input",
            name: "firstName",
            message: "What is the first name of the new employee?",
        },
        {
            type: "input",
            name: "lastName",
            message: "What is the last name of the new employee?",
        },
        {
            type: "number",
            name: "roleID",
            message: "What is the role ID of the new employee? (Finance Manager = 1; Technical Director = 2; Senior Developer = 3; Sales Manager = 4; Senior Account Manager = 5; Finance Payable officer = 6; HR Officer = 7; HR Manager = 8; )",
        },
        {
            type: "number",
            name: "managerID",
            message: "What is the manager ID of the new employee? (Kent Ivans [Finance Manager] = 1; Aaron Kloska [Technical Director] = 2; Alfred Pacleb [Sales Manager] = 4; Shaun Rael[HR Manager] = 8;) ",
        },
    ]).then((answer) => {
        const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`;
        connection.query(
            query, [
                answer.firstName,
                answer.lastName,
                answer.roleID,
                answer.managerID,
            ],
            (err, res) => {
                if (err) throw err;
                console.log("");
                console.table(res);
                console.log("Successfully added an new employee!");
            }
        );
        start();
    });
}

async function addRole() {
    await prompt([{
            type: "number",
            name: "roleID",
            message: "What is the ID of the new role? (Finance Manager = 1; Technical Director = 2; Senior Developer = 3; Sales Manager = 4; Senior Account Manager = 5; Finance Payable officer = 6; HR Officer = 7; HR Manager = 8; )",
        },
        {
            type: "input",
            name: "role",
            message: "What is the title of the new Role?",
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary of the new Role?",
        },
        {
            type: "number",
            name: "departmentID",
            message: "What is the Department Id of the new Role? (Finance = 1; IT = 2; Sales = 3; HR = 4;)",
        },
    ]).then((answer) => {
        const query = `INSERT INTO role (id, title, salary, department_id) VALUES (?, ?, ?, ?);`;
        connection.query(
            query, [answer.roleID, answer.role, answer.salary, answer.departmentID],
            (err, res) => {
                if (err) throw err;
                console.log("");
                console.table(res);
                console.log("Successfully added a role!");
            }
        );
        start();
    });
}

async function addDepartment() {
    await prompt([{
            type: "number",
            name: "departmentID",
            message: "What is the ID of the new department that you would like to add? (Finance = 1; IT = 2; Sales = 3; HR = 4;)",
        },
        {
            type: "input",
            name: "department",
            message: "What is the name of the new department that you would like to add?",
        },
    ]).then((answer) => {
        const query = `INSERT INTO department (id, name) VALUES (?, ?);`;
        connection.query(
            query, [answer.departmentID, answer.department],
            (err, res) => {
                if (err) throw err;
                console.log("");
                console.table(res);
                console.log("Successfully added a new department!");
            }
        );
        start();
    });
}

//Updating employee roles and manager 

async function updateEmployeeRoles() {
    await prompt([{
            type: "input",
            name: "employeeID",
            message: "Which employee that you would like to change? (Please enter the ID of the Employee.)",
        },
        {
            type: "input",
            name: "roleID",
            message: "Which role would you like to assign to the employee?",
        },
    ]).then((answer) => {
        const query = `UPDATE employee SET role_id = ? WHERE id = ?`;
        connection.query(
            query, [answer.roleID, answer.employeeID],
            (err, res) => {
                if (err) throw err;
                console.log("");
                console.table(res);
                console.log(
                    "Successfully updated the selected employee's role!"
                );
            }
        );
        start();
    });
}

async function updateEmployeeManagers() {
    await prompt([{
            type: "input",
            name: "employeeID",
            message: "Which employee that you would like to change?",
        },
        {
            type: "input",
            name: "managerID",
            message: "Which manager would you like to assign to the employee?",
        },
    ]).then((answer) => {
        const query = `UPDATE employee SET manager_id = ? WHERE id = ?`;
        connection.query(
            query, [answer.managerID, answer.employeeID],
            (err, res) => {
                if (err) throw err;
                console.log("");
                console.table(res);
                console.log(
                    "Successfully updated the selected employee's manager!"
                );
            }
        );
        start();
    });
}

// Deleting employee, roles an department 

async function removeEmployee() {
    await prompt({
        type: "input",
        name: "employeeID",
        message: "What is the ID of the employee that you would like to remove?",
    }).then((answer) => {
        const query = `DELETE FROM employee WHERE id = ?`;
        connection.query(query, [answer.employeeID], (err, res) => {
            if (err) throw err;
            console.log("");
            console.log("Successfully deleted the selected employee!");
        });
        start();
    });
}

async function removeRole() {
    await prompt({
        type: "input",
        name: "role",
        message: "What is the name of the role that you would like to remove?",
    }).then((answer) => {
        const query = `DELETE FROM role WHERE title = ?`;
        connection.query(query, [answer.role], (err, res) => {
            if (err) throw err;
            console.log("");
            console.log("Successfully deleted the selected role!");
        });
        start();
    });
}

async function removeDepartment() {
    await prompt({
        type: "input",
        name: "department",
        message: "What is the name of the department that you would like to remove?",
    }).then((answer) => {
        const query = `DELETE FROM department WHERE name = ?`;
        connection.query(query, [answer.department], (err, res) => {
            if (err) throw err;
            console.log("");
            console.log("Successfully deleted the selected department!");
        });
        start();
    });
}