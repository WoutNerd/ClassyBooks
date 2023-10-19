# Classybooks

### Database

Classybooks is configured to usebelow. CockroachDB, a cloud-hosted SQL-solution, this makes it compatible with PostgreSQL. More information on configuring the SQL Database below.
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

To configure the database-url, there are 2 possibilities:

#### settings.json

When running the container, assign a volume `/server/settings.json`, this file has a layout like this:

```json
{
  "url": "postgresql://database_name:password@databasedomain:port/database?sslmode=verify-full"
}
```

You can find the connection-url in your database's dashboard

#### Environment variables

When running the container, assign the connection-url to the `DBURL`-environment table.

<img src="https://github.com/JasperDG828/classybooks/blob/develop/art/logo_long.png?raw=true" width="600"/>
