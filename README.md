# Automa8e SG Company Scrapper

This is a scrapper for Automa8e SG Company.

## Installation

- Install Docker compose version **2.6**
- Edit env var in **docker-compose.yml**
- Run `docker compose build`
- Finally run `docker compose up`
- Project will run on `http://<YOUR-IP>:4000/api/v1/search`

## Queries

- add **q** queries for searching example: `http://<YOUR-IP>:4000/api/v1/search?q=automa8e`

> Add **Bearer Token** header with the token you set in env
