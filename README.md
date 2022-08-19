[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
# Find a Food Truck API

This is a simple Rest API to find food trucks in San Francisco, CA. It gets the data from the [city's food truck open dataset](https://data.sfgov.org/Economy-and-Community/Mobile-Food-Facility-Permit/rqzj-sfat/data).


## Implementation details
When the server starts, it loads the data from the city's API and stores the data of each food truck in a grid in memory representing the map of the area.

Each cell of the grid represents 0.001 degrees of latitude and longitude, about 111m from north to south and 87m from east to west.

When a client requests the food trucks for a given latitude and longitude, the program searches in the corresponding cell in the grid and the ones around it if necessary until it gets the minimum amount of items required or there are no more cells where to look for in the grid.

## Installation
Assuming you’ve already installed [Node.js](https://nodejs.org/), clone this repository and change your working directory.
```bash
$ git clone https://github.com/mscovotti/find-a-food-truck.git
$ cd find-a-food-truck
``` 
And install the dependencies 
```bash
$ npm install
```

## Configuration
There is a `.env` file in the root directory where you can configure the following parameters:
```apache showLineNumbers
PORT=3000
AREA_LIMITS=37.83363071488279, -122.51503834444358, 37.70756928925514, -122.32696736527359
API_URL='https://data.sfgov.org/resource/rqzj-sfat.json'
API_FIELDS='objectid,applicant,locationdescription,fooditems,latitude,longitude'
MIN_QUANTITY_REQUIRED=5
```

- **PORT**: The port where the server listen to requests (optional, default to 3000)
- **AREA_LIMITS**: The latitude and longitude of the North West and South East points that limits the area where the application will search for food trucks (mandatory)
- **API_URL**: The url of the service where to get the data of the food trucks (optional, default to [https://data.sfgov.org/resource/rqzj-sfat.json](https://data.sfgov.org/resource/rqzj-sfat.json))
- **API_FIELDS**: The list of fields to get from the city's API. The same will be returned by this API (optional, default to objectid, applicant, locationdescription, fooditems, latitude, longitude)
- **MIN_QUANTITY_REQUIRED**: The minimum quantity of items to return (optional, default to 5)

## Usage
Start the server 
```bash
$ node app.js
```
And make a request to the API
```bash
$ curl http://localhost:3000/foodtrucks?point=37.815885350100986,-122.42594524663745
```
where `point` is the latitude and longitude where you want to search for food trucks. 

> **_NOTE:_** when starting, the server will console.log a list of the items gotten from the city's API whose latitude and longitude are outside the configured **AREA_LIMITS**.

## Possible improvements
- Fetch the items from the city's API periodically to update the cached info of the food trucks.
