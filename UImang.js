/**
 * Olivia Croteau
 * IGME-102: P2 Data Visualization, 04/28/24
 * UImang classcreates radio, dropdowns, and checkbox for users tp select which data to display
 * Called in sketch.js and Tract.js
 */

class UImang {
    constructor() {
        createElement("br");

        //load visualization legend image
        this.legend = loadImage("media/visualizationLegend.jpg");

        //radio buttons to select which county
        this.countyMenu = createRadio("County to Map");
        this.countyMenu.option("Mecklenburg, NC");
        this.countyMenu.option("Monroe, NY");

        createElement("br");

        //dropdown to select which VIZ
        this.vizDropdown = createSelect("Census Tract Health Visualization Controls:");
        this.vizDropdown.option("Map non-citizens, median household income, median gross-rent");
        this.vizDropdown.option("Map general health, sleep <7 hours, population income below poverty level");

        createElement("br");
        createElement("br");

        //dropdown to select subset
        this.subsetDropdown = createSelect();
        this.subsetDropdown.option("For all tracts");
        this.subsetDropdown.option("Non-citizens < 2% of poulation");
        this.subsetDropdown.option("Median income > $30,000");

        createElement("br");
        createElement("br");

        //checkbox to toggle text detail display
        this.showDetails = createCheckbox("Show Details");

    }

    //***ACCESSORS FOR RADIO/DROPDOWNS/CHECKBOX */
    getCounty() {
        return this.countyMenu.value();
    }

    getViz() {
        return this.vizDropdown.value();
    }

    getSubset() {
        return this.subsetDropdown.value();
    }

    detailsChecked() {
        return this.showDetails.checked();
    }
}