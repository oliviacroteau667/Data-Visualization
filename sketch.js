/**
 * Olivia Croteau
 * IGME-102: P2 Data Visualization, 04/28/24
 * Handle setup functions and visualization updates based on user interaction
 */

"use strict"; //catch some common coding errors

/* Global variables */
let formatObjs = {};
let countyTractInstances = [];
let UIMANG;
let COUNTY;
let VIZ;

/**
 * setup : create initial state (before user interaction)
 */
function setup() {
   //create canvas with intial text
   createCanvas(1600, 1600);
   textSize(25);
   text("Select a county below.", 10, 60);

   //create UI management object
   UIMANG = new UImang();

   //create number formatting objects
   numFormat();

   //set intiial modes
   angleMode(DEGREES);
}

/**
 * numFormat: create number formatting object instances
 */
function numFormat() {
   //Create a property for a new Intl.NumberFormat object with default decimal number formatting.
   formatObjs.basicDecimal = new Intl.NumberFormat();
   
   //Create a property for a new Intl.NumberFormat object for percentages.
   formatObjs.percentage = new Intl.NumberFormat("us-EN", {style: "percent", maximumFractionDigits: 0});
   
   //Create a property for a new Intl.NumberFormat object for currency (US dollars, 0 fraction digits)
   formatObjs.dollars = new Intl.NumberFormat("us-EN", {style: "currency", currency: "USD"});
}

/**
 * mouseClicked: call whichCounty() with every mouse click to ensure constant updates
 */
function mouseClicked(){
   whichCounty();
}

/**
 * whichCounty: determine county selected, load JSON, and call to update visualization
 */
function whichCounty() {
   //determine and save which county radio button is selected
   COUNTY = UIMANG.getCounty();
   //empty tract array
   countyTractInstances.splice(0);

   //load either NC or NY JSON file based on which county radio value saved to COUNTY
   switch(COUNTY) {
      case "Mecklenburg, NC":
         loadJSON("media/ncPlacesHealthTracts.json", readJSON);
         break;

      case "Monroe, NY":
         loadJSON("media/nyPlacesHealthTracts.json", readJSON);
         break;
   }

   //update visuals for selected JSON file
   updateVisuals();
}

/**
 * readJSON: read JSON tract array for selected COUNTY and update visuals
 * @param {array} tracts 
 */
function readJSON(tracts) {
   //create new object instance for each tract line, push to array of objects, and update visuals
   for (let oneTract of tracts) {
      let newTractInstance = new Tract(oneTract, COUNTY);
      countyTractInstances.push(newTractInstance);
   }

   updateVisuals();
}

/**
 * updateVisuals: update canvas visualization for each tract in array
 * 
 */
function updateVisuals() {
   background('#17182b');

   //scale and place visualization image (loaded in UIMANG)
   UIMANG.legend.resize(600, 0)
   image(UIMANG.legend, 0-30, height-310);

   //text settings for tract details
   fill("white");
   textSize(10);

   //create copy of tract array to filter
   let filteredTracts = countyTractInstances;
   //get and save subset selected from dropdown
   let subset = UIMANG.getSubset();

   //filter array copy based on selected subset
   switch(subset) {
      //handle first filter: <2% of population are non-citizens
      case "Non-citizens < 2% of poulation":
         filteredTracts = filteredTracts.filter((tract) => tract.NONCITIZEN < 0.02);
         break;

      //handle second filter: median household income >$30k
      case "Median income > $30,000":
         filteredTracts = filteredTracts.filter((tract) => tract.MEDIANINCOME > 30000);
         break;

      default:
         break;
   }

   //iterate trhough filtered array, calling display method for each
   filteredTracts.forEach((tract) => tract.display());

   //display county name text
   textSize(25);
   fill("white");
   text(COUNTY, 100, 50);
}