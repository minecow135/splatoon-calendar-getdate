# Splatoon calendar

## How it works

Pulls data from splatoonwiki.org
Uploads to database

Pulls from database, and creates a ics file with next splatfest
Pulls from database, and sends message to discord server when a new splatfest is announced
Pulls from database, and sends message to discord server when the winner is announced

## How to use

### Host directly

#### Requirements directly hosted

- Node
- Mariadb
- Web server

#### Setup directly hosted

1. Clone the repository
2. Run npm install
3. Import the database
4. Create a .env file
5. Point the web server to the ics folder
6. Start node

### Docker

#### Requirements docker

- Node
- Docker
- Docker-compose

#### Setup docker

1. Clone the repository
2. Run npm install
3. Import the database
4. Use the Docker compose file to create the needed docker containers. be sure to edit the environment variables
5. Start the containers

## file contents

### .env

```shell
# Database connection
DB_HOST=HOST
DB_USER=USER
DB_PASSWORD=PASSWORD
DB_NAME=DATABASE

# Discord bot connection
botToken=TOKEN

# message channels
# use as many ping ids as you want. separate with commas to get more
splatfestNew=CHANNEL ID,PING ID,PING ID
# copy with suffix to get more channels
#splatfestNew2=CHANNEL ID,PING ID,PING ID

splatfestWin=CHANNEL ID,PING ID,PING ID
# copy with suffix to get more channels
#splatfestWin2=CHANNEL ID,PING ID,PING ID
```

### docker compose

```yml
version: "2"
services:
  node:
    image: "node:20"
    user: "node"
    working_dir: /home/node/app
    environment:
      - NODE_ENV=production
      # Database connection
      - DB_HOST=HOST
      - DB_USER=USER
      - DB_PASSWORD=PASSWORD
      - DB_NAME=DATABASE

      # Discord bot connection
      - botToken=TOKEN

      # message channels
      # use as many ping ids as you want. separate with commas to get more
      - splatfestNew=CHANNEL ID,PING ID,PING ID
      # copy with suffix to get more channels
      #splatfestNew2=CHANNEL ID,PING ID,PING ID

      - splatfestWin=CHANNEL ID,PING ID,PING ID
      # copy with suffix to get more channels
      #splatfestWin2=CHANNEL ID,PING ID,PING ID
    volumes:
      - /var/www/splatCal:/home/node/app # first location is on the machine running docker. change this if needed. THIS SHOULD ALWAYS BE SAME AS VOLUME IN NODE - /ics
    expose:
      - "8001"
    ports:
      - "8204:8001" # first number is port on the server. change this if needed
    command: "npm start"
  web:
    image: php:8.2-apache
    user: www-data
    restart: always
    ports:
      - "8104:80" # first number is port on the server. change this if needed
    volumes:
      - /var/www/splatCal/ics:/var/www/html # first location is on the machine running docker. change this if needed. THIS SHOULD ALWAYS BE SAME AS VOLUME IN NODE + /ics

```
