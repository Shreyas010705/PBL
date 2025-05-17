use shreyas;
select *from users;
DELETE users
FROM users
JOIN (
    SELECT id
    FROM users
    ORDER BY id ASC
    LIMIT 5 OFFSET 5
) AS subquery
ON users.id = subquery.id;
select *from users;