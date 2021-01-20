# Travel app - FEND Capstone

The Travel app is the final project of the udacity FEND Program. this project aims at connecting all that i have learned from the past projects into one project

the point of this project was to:

-  Be set up with Webpack, Express, Node, and Sass, and Service Workers

- Have separate dev and prod configurations for Webpack

- Have the developer environment set up with the Webpack dev server

- Make three requests to three different API's : `Geonames` - `weather bit` - `pixabey`
- using outputs from API's as input for others 
- Use Sass for styling

- Minify js and styles in the production environment

- Be able to show content offline

## Installation

Clone the project :

```bash
git clone https://github.com/aalrayes/FEND-travel-app.git
```
- install dependencies the project folder:
```bash
npm install 
```
## Usage

- Start the webpack development server. `Port: 8080`
```bash
npm run build-dev
```
- Build the `dist` folder for express to use.
```bash
npm run build-prod
```
- Start the express server. `Port: 3000`
```bash
npm run express
```
## Test
make sure that the express server is off
```bash
npm run test
```
