BEGIN TRANSACTION;

INSERT INTO users (name, email, age, pet, entries, joined) values ('Aye', 'a@a.com', 25, 'dog', 4, '2018-01-01');
INSERT INTO login (hash, email) values ('$2a$10$YiRg1auepFNctyOyBSqz1eeydiRi0Dz.tfdR0HUJ8iXL85RugorW.', 'a@a.com');

COMMIT;
