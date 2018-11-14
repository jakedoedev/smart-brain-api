BEGIN TRANSACTION;

INSERT INTO users (name, email, entries, joined) values ('Jim', 'jessie@gmail.com', 4, '2018-01-01');
INSERT INTO login (hash, email) values ('$2a$10$YiRg1auepFNctyOyBSqz1eeydiRi0Dz.tfdR0HUJ8iXL85RugorW.', 'jessie@gmail.com');

COMMIT;
