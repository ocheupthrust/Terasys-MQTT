DROP DATABASE IF EXISTS terasysmqttuserdb;

CREATE DATABASE terasysmqttuserdb;

USE terasysmqttuserdb;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
	id INTEGER AUTO_INCREMENT,
	username VARCHAR(64) NOT NULL,
	pw VARCHAR(128) NOT NULL,
	super INT(1) NOT NULL DEFAULT 0,
	PRIMARY KEY (id)
  );
CREATE UNIQUE INDEX users_username ON users (username);

-- Password is stored as PBKDF2 hashed numbers. Non-hashed MQTT password for trial terasys@terasys.com user is : terasys123
INSERT INTO users (username, pw) VALUES ('terasys@terasys.com', 'PBKDF2$sha256$901$wP1NMwt7dEeuTspT$RbXp2S/ZcoLNOjpT3GVjFhZHlZaH1RzI');

DROP TABLE IF EXISTS acls;

CREATE TABLE acls (
	id INTEGER AUTO_INCREMENT,
	username VARCHAR(64) NOT NULL,
	topic VARCHAR(256) NOT NULL,
	rw INTEGER(1) NOT NULL DEFAULT 2,	-- 1: read-only, 2: read-write
	PRIMARY KEY (id)
	);
CREATE UNIQUE INDEX acls_user_topic ON acls (username, topic(192));

-- User topics will start with e-mail prefix to disambugate topics between users.
INSERT INTO acls (username, topic, rw) VALUES ('terasys@terasys.com', 'terasys@terasys.com/#', 2);
