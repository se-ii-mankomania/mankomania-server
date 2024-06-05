\connect postgres

DROP DATABASE IF EXISTS mankomania;

-- Create the database
CREATE DATABASE mankomania ENCODING = 'UTF8';

-- Connect to the database
\connect mankomania

-- Create extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables

CREATE TABLE users (
    userid UUID DEFAULT public.uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE field (
    id SERIAL PRIMARY KEY,
    text VARCHAR(255),
    isevent BOOLEAN,
    effect INTEGER
);

CREATE TABLE lobby (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    password VARCHAR(255),
    isprivate BOOLEAN,
    maxplayers INTEGER,
    status VARCHAR(255)
);


CREATE TABLE session (
    id UUID PRIMARY KEY,
    userid UUID,
    lobbyid UUID,
    color VARCHAR(20),
    currentposition INTEGER,
    balance INTEGER,
    amountkvshares INTEGER,
    amounttshares INTEGER,
    amountbshares INTEGER,
    isplayersturn BOOLEAN,
    FOREIGN KEY (currentposition) REFERENCES field(id),
    FOREIGN KEY (lobbyid) REFERENCES lobby(id),
    FOREIGN KEY (userid) REFERENCES users(userid)
);

-- Insert data into tables
INSERT INTO field (id, text, isevent, effect) VALUES
(2, 'Gehe zum Pferderennen!', FALSE, 44),
(3, 'Kaufe eine Aktie der Kurzschluss-Versorgungs AG! Zahle 100.000€', FALSE, -100000),
(4, 'Beauftrage Saylor Twift damit, dir einen Klingelton zu komponieren. Zahle 70.000€', FALSE, 70000),
(5, 'Gehe ins Casino!', FALSE, 0),
(6, 'Dein Buch „Geld verjubeln leicht gemacht!“ ist ein Bestseller! Kassiere 5.000€', FALSE, 5000),
(7, 'Böse 1', TRUE, 0),
(8, 'Kaufe eine Aktie der Bruchstahl AG! Zahle 100.000€', FALSE, -100000),
(9, 'Gehe zur Bösen 1!', FALSE, -2),
(10, 'Hotel A', FALSE, -10000),
(11, 'Deine Eltern haben Hochzeitstag! Überrasche sie mit einer VIP-Weltreise. Zahle 100.000€', FALSE, -100000),
(12, 'Gehe zur Lotterie!', FALSE, 13),
(13, 'Dein Personal Trainer nimmt dich zu hart ran. Gehe zum Osteopathen. Zahle 50.000€', FALSE, -50000),
(14, 'Gehe an die Börse!', FALSE, 33),
(15, 'Dein Hamster stirbt und die Nagetierversicherung zahlt. Kassiere 10.000€', FALSE, 10000),
(16, 'Lege mit deiner Yacht im Hafen von Monaco an. Zahle 50.000€', FALSE, 50000),
(17, 'Gehe zum Pferderennen!', FALSE, 29),
(18, 'Hotel B', FALSE, -13000),
(19, 'Gehe ins Casino!', FALSE, 29),
(20, 'Gönne dir einen mit Champagner gefüllten Jacuzzi. Zahle 60.000€', FALSE, -60000),
(21, 'Verwöhne dein Pony mit Beinwärmern aus Kaschmir! Zahle 50.000€', FALSE, -50000),
(22, 'Du bist auf einem Kavier-Schnittchen ausgerutscht. Kassiere 10.000€', FALSE, 10000),
(23, 'Gehe zur Bösen 1!', FALSE, -16),
(24, 'Kaufe eine Aktie der Trockenöl AG! Zahle 100.000€', FALSE, -100000),
(25, 'Lotterie', TRUE, 0),
(26, 'Titel gewonnen! „Begossenster Pudel des Jahres“ bei der World Dog Show. Kassiere 10.000€', FALSE, 10000),
(27, 'Kaufe eine Aktie der Kurzschluss-Versorgungs AG! Zahle 100.000€', FALSE, -100000),
(28, 'Hotel C', FALSE, -20000),
(29, 'Exklusives Fotoshooting für ein Hochglanzmagazin. Kassiere 50.000€', FALSE, 50000),
(30, 'Gönne dir eine goldene Handyhülle. Zahle 50.000€', FALSE, -50000),
(31, 'Kaufe eine Aktie der Bruchstahl AG! Zahle 100.000€', FALSE, -100000),
(32, 'Gehe zum Auktionshaus!', FALSE, 13),
(33, 'Kaufe Anteile an einem Rennpferd! Zahle 50.000€', FALSE, -50000),
(34, 'Gehe zur Lotterie!', FALSE, -9),
(35, 'Du bist der einmillionste Kunde bei „Edel und Teuer“. Du gewinnst 10.000€', FALSE, 10000),
(36, 'Kaufe eine Aktie der Trockenöl AG! Zahle 100.000€', FALSE, -100000),
(37, 'Gehe an die Börse!', FALSE, 10),
(38, 'Deine Oma benötigt ein neues Facelifting. Zahle 80.000€', FALSE, -80000),
(39, 'Verwöhne dich bei Juwelier „Bling, Bling und Bling“. Zahle 100.000€', FALSE, -100000),
(40, 'Alles Gute zum Geburtstag! Erhalte von deinen Geburtstagsgästen 15.000€', FALSE, 15000),
(41, 'Hotel E', FALSE, 5000),
(42, 'Kaufe eine Aktie der Trockenöl AG! Zahle 100.000€', FALSE, -100000),
(43, 'Gehe zum Auktionshaus!', FALSE, 2),
(44, 'Zahle 25.000€ Kaution für den Mörder des toten Meeres', FALSE, -25000),
(45, 'Feld Auktionshaus', TRUE, 0),
(46, 'Feld Pferderennen', TRUE, 0),
(47, 'Feld Börse', TRUE, 0),
(48, 'Feld Casino', TRUE, 0),
(49, 'Startfeld blau', FALSE, 0),
(50, 'Startfeld grün', FALSE, 0),
(51, 'Startfeld lila', FALSE, 0),
(52, 'Startfeld rot', FALSE, 0),
(1, 'Gehe zur Börse!', FALSE, 0);