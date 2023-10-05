# Classybooks

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

<img src="https://github.com/JasperDG828/classybooks/blob/develop/art/logo.png?raw=true" width="400"/>
