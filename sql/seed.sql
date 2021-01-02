USE company_DB;

INSERT INTO department (name)
VALUES ('Marketing'), ('Sales'), ('Human Resources'), ('Public Relations');

INSERT INTO role (title, salary, department_id)
VALUES ('Marketing Analyst', 60000, 1), ('Marketing Coordinator', 55000, 1), ('Marketing Consultant', 45000, 1), ('Marketing Manager', 90000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Development', 40000, 2), ('Sales Specialist', 65000, 2), ('Customer Success', 35000, 2), ('Sales Manager', 90000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ('Human Resources Representative', 30000, 3), ('Human Resources Specialist', 45000, 3), ('Human Resources Analyst', 50000, 3), ('Human Resources Manager', 80000, 3);

INSERT INTO role (title, salary, department_id)
VALUES ('Public Relations Agent', 35000, 4), ('Public Relations Publicist', 40000, 4), ('Public Relations Strategist', 55000, 4), ('Public Relations Manager', 80000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Alex', 'DiFabio', 4, 0), ('Chris', 'Carlson', 8, 0), ('Casey', 'Dziuba', 12, 0), ('Matt', 'Bunker', 16, 0);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Harrison', 'Ford', 1, 1), ('Mark', 'Hamill', 2, 1), ('Carrie', 'Fischer', 3, 1), ('Jeff', 'Lord', 5, 2), ('Zakk', 'Drumm', 6, 2), ('Jimmy', 'Robison', 7, 2), ('Haley', 'Cowan', 9, 3), ('Taylor', 'Hampton', 10, 3), ('Hannah', 'Spear', 11, 3), ('Sean', 'Lerro', 13, 4), ('Angelo', 'Lerro', 14, 4), ('John', 'Barber', 15, 4);