DROP TABLE IF EXISTS vgsales;
CREATE TABLE vgsales (
Rank	 INTEGER,
Name	 text,
Platform VARCHAR,
Year	text,
Genre	text,
Publisher	VARCHAR,
NA_Sales	float8,
EU_Sales	float8,
JP_Sales	float8,
Other_Sales	float8,
Global_Sales	float8
);

\copy vgsales FROM 'vgsales.csv'  delimiter ','  csv header encoding 'ISO8859-1'
