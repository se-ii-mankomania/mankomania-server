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
    effect INTEGER,
    kvshares INTEGER,
    tshares INTEGER,
    bshares INTEGER
);

CREATE TABLE lobby (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    password VARCHAR(255),
    isprivate BOOLEAN,
    maxplayers INTEGER,
    status VARCHAR(255),
    stocktrend VARCHAR(255),
    minigame INTEGER
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
INSERT INTO field VALUES 
(1, 'Gehe zur Börse!', false, 0, 0, 0, 0),
(2, 'Gehe zum Pferderennen!', false, 0, 0, 0, 0),
(3, 'Kaufe eine Aktie der Kurzschluss-Versorgungs AG! Zahle 100.000€', false, -100000, 1, 0, 0),
(4, 'Beauftrage Saylor Twift damit, dir einen Klingelton zu komponieren. Zahle 70.000€', false, -70000, 0, 0, 0),
(5, 'Gehe an die Börse!', false, 0, 0, 0, 0),
(6, 'Dein Buch „Geld verjubeln leicht gemacht!“ ist ein Bestseller! Kassiere 20.000€', false, 20000, 0, 0, 0),
(7, 'Gehe zum Pferderennen!', false, 0, 0, 0, 0),
(8, 'Kaufe eine Aktie der Bruchstahl AG! Zahle 100.000€', false, -100000, 0, 1, 0),
(9, 'Gehe zur Bösen 1!', false, 0, 0, 0, 0),
(10, 'Hotel A', false, -10000, 0, 0, 0),
(11, 'Deine Eltern haben Hochzeitstag! Überrasche sie mit einer VIP-Weltreise. Zahle 10.000€', false, -10000, 0, 0, 0),
(12, 'Gehe zur Lotterie!', false, 0, 0, 0, 0),
(13, 'Dein Personal Trainer nimmt dich zu hart ran. Gehe zum Osteopathen. Zahle 50.000€', false, -50000, 0, 0, 0),
(14, 'Gehe an die Börse!', false, 0, 0, 0, 0),
(15, 'Dein Hamster stirbt und die Nagetierversicherung zahlt. Kassiere 10.000€', false, 10000, 0, 0, 0),
(16, 'Lege mit deiner Yacht im Hafen von Monaco an. Zahle 15.000€', false, -15000, 0, 0, 0),
(17, 'Gehe zum Pferderennen!', false, 0, 0, 0, 0),
(18, 'Hotel B', false, -13000, 0, 0, 0),
(19, 'Gehe zur Bösen 1!', false, 0, 0, 0, 0),
(20, 'Gönne dir einen mit Champagner gefüllten Jacuzzi. Zahle 20.000€', false, -20000, 0, 0, 0),
(21, 'Verwöhne dein Pony mit Beinwärmern aus Kaschmir! Zahle 15.000€', false, -15000, 0, 0, 0),
(22, 'Du bist auf einem Kavier-Schnittchen ausgerutscht. Kassiere 10.000€', false, 10000, 0, 0, 0),
(23, 'Gehe zur Bösen 1!', false, 0, 0, 0, 0),
(24, 'Kaufe eine Aktie der Trockenöl AG! Zahle 100.000€', false, -100000, 0, 0, 1),
(25, 'Lotterie', true, 0, 0, 0, 0),
(26, 'Titel gewonnen! „Begossenster Pudel des Jahres“ bei der World Dog Show. Kassiere 10.000€', false, 10000, 0, 0, 0),
(27, 'Kaufe eine Aktie der Kurzschluss-Versorgungs AG! Zahle 100.000€', false, -100000, 1, 0, 0),
(28, 'Hotel C', false, -20000, 0, 0, 0),
(29, 'Exklusives Fotoshooting für ein Hochglanzmagazin. Kassiere 50.000€', false, 50000, 0, 0, 0),
(30, 'Gönne dir eine goldene Handyhülle. Zahle 15.000€', false, -15000, 0, 0, 0),
(31, 'Kaufe eine Aktie der Bruchstahl AG! Zahle 100.000€', false, -100000, 0, 1, 0),
(32, 'Gehe an die Börse!', false, 0, 0, 0, 0),
(33, 'Kaufe Anteile an einem Rennpferd! Zahle 10.000€', false, -10000, 0, 0, 0),
(34, 'Gehe zur Lotterie!', false, 0, 0, 0, 0),
(35, 'Du bist der einmillionste Kunde bei „Edel und Teuer“. Du gewinnst 30.000€', false, 30000, 0, 0, 0),
(36, 'Kaufe eine Aktie der Trockenöl AG! Zahle 100.000€', false, -100000, 0, 0, 1),
(37, 'Gehe an die Börse!', false, 0, 0, 0, 0),
(38, 'Deine Oma benötigt ein neues Facelifting. Zahle 20.000€', false, -20000, 0, 0, 0),
(39, 'Verwöhne dich bei Juwelier „Bling, Bling und Bling“. Zahle 20.000€', false, -20000, 0, 0, 0),
(40, 'Alles Gute zum Geburtstag! Erhalte von deinen Geburtstagsgästen 30.000€', false, 30000, 0, 0, 0),
(41, 'Hotel E', false, 5000, 0, 0, 0),
(42, 'Kaufe eine Aktie der Trockenöl AG! Zahle 100.000€', false, -100000, 0, 0, 1),
(43, 'Gehe zum Pferderennen!', false, 0, 0, 0, 0),
(44, 'Zahle 25.000€ Kaution für den Mörder des toten Meeres', false, -25000, 0, 0, 0),
(45, 'Feld Auktionshaus', true, 0, 0, 0, 0),
(46, 'Feld Pferderennen', true, 0, 0, 0, 0),
(47, 'Feld Börse', true, 0, 0, 0, 0),
(48, 'Feld Casino', true, 0, 0, 0, 0),
(49, 'Startfeld blau', false, 0, 0, 0, 0),
(50, 'Startfeld grün', false, 0, 0, 0, 0),
(51, 'Startfeld lila', false, 0, 0, 0, 0),
(52, 'Startfeld rot', false, 0, 0, 0, 0);
