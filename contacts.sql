
CREATE TABLE Contact(
    Contact_id  INT          NOT NULL        AUTO_INCREMENT,
    Fname       VARCHAR(255),
    Mname       VARCHAR(255),
    Lname       VARCHAR(255),
    PRIMARY KEY(Contact_id)
);

CREATE TABLE Address(
    Address_id      INT     NOT NULL         AUTO_INCREMENT,
    Contact_id      INT,
    Address_type    ENUM('HOME', 'WORK', 'OTHER'),
    Address         VARCHAR(255),
    City           VARCHAR(255),
    State          VARCHAR(255),
    ZIP            CHAR(5),
    PRIMARY KEY(Address_id),
    CONSTRAINT fk_add_contact_id
        FOREIGN KEY (Contact_id)
        REFERENCES Contact (Contact_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE);

CREATE TABLE Phone(
    Phone_id      INT     NOT NULL         AUTO_INCREMENT,
    Contact_id    INT,
    Phone_type    ENUM('HOME', 'WORK', 'CELL', 'FAX', 'OTHER'),
    Area_code         CHAR(3),
    Number           CHAR(7),
    PRIMARY KEY(Phone_id),
    CONSTRAINT fk_phone_contact_id
        FOREIGN KEY (Contact_id)
        REFERENCES Phone (Phone_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE);

CREATE TABLE Date(
    Phone_id      INT     NOT NULL         AUTO_INCREMENT,
    Contact_id    INT,
    Phone_type    ENUM('HOME', 'WORK', 'CELL', 'OTHER'),
    Area_code         CHAR(3),
    Number           CHAR(7),
    PRIMARY KEY(Phone_id),
    CONSTRAINT fk_phone_contact_id
        FOREIGN KEY (Contact_id)
        REFERENCES Phone (Phone_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE);