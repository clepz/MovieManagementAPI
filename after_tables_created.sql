ALTER TABLE movie_session
DROP CONSTRAINT IF EXISTS unique_movie_session_constraint;

ALTER TABLE movie_session
ADD CONSTRAINT unique_movie_session_constraint UNIQUE NULLS NOT DISTINCT ("date", "time", "roomNumber", "deletedAt");

insert into "user" ("username", "password", "role", "age") values ('admin', 'Admin123.', 'manager', '30');
insert into "room" ("id", "title") values (1, 'Room 1'), (2, 'Room 2'), (3, 'Room 3');
