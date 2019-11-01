CREATE TABLE buttombar_attribute(
   id serial PRIMARY KEY,
   TypeName VARCHAR (200) UNIQUE NOT NULL,
   TypeIcon VARCHAR (50) NOT NULL,
   Description VARCHAR (355) UNIQUE NOT NULL,
   LastUpdateTime TIMESTAMP
);