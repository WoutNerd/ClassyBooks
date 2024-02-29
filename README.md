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
```

### Configuration

Classybooks is available through a docker-image on ghcr.io, to pull the image, use:

```
docker pull ghcr.io/jasperdg828/classybooks:latest-dev
```

#### Environment variables

When running the container, assign the connection-url to the `DBURL`-environment variable.
This URL follows the following pattern: ```postgresql://user:password@databasedomain:port/database?sslmode=verify-full```

#### Port

Make sure to open port 8080 through docker, you can map this to any local port using the port parameters in docker.

<img src="https://github.com/JasperDG828/classybooks/blob/develop/client/src/art/logo_long.png?raw=true" width="600"/>
