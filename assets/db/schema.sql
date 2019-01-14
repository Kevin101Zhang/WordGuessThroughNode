CREATE DATABASE WordGuess;
use WordGuess;

CREATE TABLE beginnerWords (
id INTEGER auto_increment not null,
word varchar(255) not null,
PRIMARY KEY (id)
);

CREATE TABLE intermediateWords (
id INTEGER auto_increment not null,
word varchar(255) not null,
PRIMARY KEY (id)
);
CREATE TABLE advanceWords (
id INTEGER auto_increment not null,
word varchar(255) not null,
PRIMARY KEY (id)
);
CREATE TABLE insaneWords (
id INTEGER auto_increment not null,
word varchar(255) not null,
PRIMARY KEY (id)
);