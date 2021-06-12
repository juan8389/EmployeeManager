const inquirer = require("inquirer");
const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    port: 3306,
    database: "employeemanager_db",
});

connection.connect((err) => {
    if (err) throw err;
    questionsMain();
});

function questionsMain() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "choice",
            choices: ["ADD", "EXIT"],
        },
    ])
        .then(answers => {
            const { choice } = answers;
            if (choice === "ADD") {
                inquirer.prompt([
                    {
                        type: "list",
                        message: "What would you like to add?",
                        name: "choice",
                        choices: ["Department", "Role"]

                    }
                ])

                const { choice } = answers;
                if (choice == "Department") {
                    inquirer.prompt([
                        {
                            type: "input",
                            message: "Enter the name of the department: ",
                            name: "department",
                        }
                    ])
                        .then(answers => {
                            const { department_name } = answers;
                            connection.query('INSERT INTO department (name) VALUES (?)', [department_name], function (error, results, fields) {
                                if (error) throw error;
                                questionsMain();
                            });
                        })

                }
                else if (choice == 'Role') {

                    connection.query('SELECT * FROM department', function (error, results, fields) {
                        const departments = [];
                        for (let i = 0; i < results.length; i++) {
                            departments.push(results[i].name);
                        }

                        if (error) throw error;
                        inquirer.prompt([
                            {
                                type: "input",
                                message: "what position is this?: ",
                                name: "position_name",
                            },
                        ])
                            .then(answers => {
                                const { position_name } = answers;
                                const department = results.find(department => {
                                    return department.name == department_name;
                                })
                                const departmentId = department.id;
                                connection.query('INSERT INTO position (title) VALUES(?,?,?)', [position_name], function (error, results, fields) {
                                    console.log('Role has been added.');
                                    questionsMain();
                                })
                            })
                    })
                }
            }
        }
    )];