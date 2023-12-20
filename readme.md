# DMV Express API

## Installation Instructions

Create a postgresql database named `dmv_app_db` owned by the `postgres` user.

Execute the `db/initialize.sql` file to populate the local database.

Run `npm install` to install node_modules, and `npm start` to start the app.

## API Endpoints

This API uses standard REST convention endpoints for the following resources:

1. Drivers
1. Plates
1. Makes
1. Models

For example, the following routes are available for drivers:

| Request Method     | Request URL | Result |
| ----------- | ----------- | ----------- |
| GET      | /api/drivers       | A JSON array of all drivers |
| GET      | /api/drivers/:driverId       | The driver with the specified id |
| POST      | /api/drivers       | A new driver is created |
| PUT      | /api/drivers/:driverId       | The driver with the specified id is updated |
| DELETE     | /api/drivers       | The driver with the specified id is deleted |

There is also a special **nested** resource route, allowing users to query for all models belonging to a given make:

`/api/makes/:makeId/models` will send all models belonging to the make with the specified makeId.

## Sending Requests with Body

When making CREATE or UPDATE requests, be sure to send your data in the request body with JSON encoding.