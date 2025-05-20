# Classybooks

### Database

Classybooks is configured to CockroachDB, a cloud-hosted SQL-solution, this makes it compatible with PostgreSQL. More information on configuring the SQL Database below.
To initialise the database, we recommend using the following SQL statement:

```SQL
CREATE TABLE MATERIALS(
  MATERIALID UUID NOT NULL DEFAULT gen_random_uuid(),
  TITLE TEXT,
  PLACE TEXT,
  DESCR JSONB,
  AVAILABLE BIT,
  LENDOUTTO UUID,
  STARTDATE DATE,
  RETURNDATE DATE,
  LENDCOUNT INT,
  AVGSCORE FLOAT
);
CREATE TABLE USERS(
  USERID UUID NOT NULL DEFAULT gen_random_uuid(),
  FIRSTNAME TEXT,
  LASTNAME TEXT,
  CLASS TEXT,
  CLASSNUM INT2,
  READINGLEVEL TEXT,
  PRIVILEGE INT2,
  SHA256 TEXT,
  MD5 TEXT,
  MATERIALS JSONB,
  HISTORY JSONB,
  HOWMUCHLATE INT DEFAULT 0,
  SESSIONID TEXT,
  SESSIONIDEXPIRE TIMESTAMP
);
INSERT INTO USERS (firstname, lastname, privilege, sha256, md5, materials) VALUES ('Admin', 'Admin', '2', '3e765698a86a9aedee4f669380cdd5c467eaa54a82887224171042205450b387', '084a2af815cfc0e3481a474bbc2d51c1', '[]');
```
For local databases insert in psql:
```SQL
CREATE USER app WITH
LOGIN
SUPERUSER
PASSWORD 'classybooks';

CREATE DATABASE defaultdb;

\c defaultdb

CREATE TABLE MATERIALS(
  MATERIALID UUID NOT NULL DEFAULT gen_random_uuid(),
  TITLE TEXT,
  PLACE TEXT,
  DESCR JSONB,
  AVAILABLE BIT,
  LENDOUTTO UUID,
  STARTDATE DATE,
  RETURNDATE DATE,
  LENDCOUNT INT,
  AVGSCORE FLOAT
);
CREATE TABLE USERS(
  USERID UUID NOT NULL DEFAULT gen_random_uuid(),
  FIRSTNAME TEXT,
  LASTNAME TEXT,
  CLASS TEXT,
  CLASSNUM INT2,
  READINGLEVEL TEXT,
  PRIVILEGE INT2,
  SHA256 TEXT,
  MD5 TEXT,
  MATERIALS JSONB,
  HISTORY JSONB,
  HOWMUCHLATE INT DEFAULT 0,
  SESSIONID TEXT,
  SESSIONIDEXPIRE TIMESTAMP
);
INSERT INTO USERS (firstname, lastname, privilege, sha256, md5, materials) VALUES ('Admin', 'Admin', '2', '3e765698a86a9aedee4f669380cdd5c467eaa54a82887224171042205450b387', '084a2af815cfc0e3481a474bbc2d51c1', '[]');
```

### Configuration

Classybooks is available through a docker-image on ghcr.io, to pull the image, use:

```
docker pull ghcr.io/jasperdg828/classybooks:latest-alpha
```

#### Environment variables

When running the container, assign the connection-url to the `DBURL`-environment variable.
This URL follows the following pattern: ```postgresql://user:password@databasedomain:port/database?sslmode=verify-full```

#### Port

Make sure to open port 8080 through docker, you can map this to any local port using the port parameters in docker.

<img src="https://github.com/JasperDG828/classybooks/blob/develop/client/src/art/logo_long.png?raw=true" width="600"/>
