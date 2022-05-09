use employees;

INSERT INTO department (name) 
VALUES
 ('Sales'),
 ('Finance'),
 ('Human Resources'),
 ('I.T.'),
 ('Production');

INSERT INTO role (title, salary, department_id)
VALUES
  ('Sales Manager', 100000, 1),
  ('Sales Relations', 75000, 1),
  ('Finance Manager', 100000, 2),
  ('Accountant', 85000, 2),
  ('Human Resources Manager', 100000, 3),
  ('Human Resources Outreach Specialist', 85000, 3),
  ('Technologies Manager', 125000, 4),
  ('Technologies Engineer', 110000, 4),
  ('Production Foreman', 65000, 5),
  ('Production Staff', 45000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Albus', 'Dumbledore', 1, NULL),
  ('Frodo', 'Bagans', 2, 1),
  ('Sandy', 'Cheeks', 3, NULL),
  ('Patrick', 'Star', 4, 3),
  ('Spongebob', 'SquarePants', 5, NULL),
  ('Vol', 'Demort', 6, 5),
  ('Obi-Wan', 'Kanobi', 7, NULL),
  ('Eugene', 'Krabs', 8, 7),
  ('Martha', 'Stewart', 9, NULL),
  ('Snoop', 'Dog', 10, 9);