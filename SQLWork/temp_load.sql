DROP TABLE IF EXISTS temp;
CREATE TABLE temp (
Year    text,
genre   text,
sales  float8);

\copy temp FROM 'temp.csv'  delimiter ','  csv header encoding 'ISO8859-1'