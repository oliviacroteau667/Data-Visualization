/**
 * Olivia Croteau
 * IGME-102: P2 Data Visualization, 04/28/24
 * constructor and methhods for Tract objects. called in sketch.js
 */

class Tract {
    constructor(tractObj, county) {
        //assign each property of tract to that of object instance
        for (let property in tractObj) {
            this[property] = tractObj[property];
        }

        //destructure acs properties
        [, this.NONCITIZEN, this.MEDIANINCOME, this.POVERTY, , , this.GROSSRENT, ] = tractObj.acs;
        this.NONCITIZEN = (this.NONCITIZEN / this.population);

        //grab health properties from risks and statuses objects
        this.sleep = this.risks["Sleep <7 hours"];
        this.health = (this.statuses["General Health"]);

        //scale/map lat and lon ranges to canvas x and y coords
        if (county == "Mecklenburg, NC") {
            this.x = map(this.lon, -81.04, -80.59, 100, width-200); //-81.04 to -80.59
            this.y = map(this.lat, 35.51, 35.01, 100, height-300); //35.51 to 35.01
        } else if (county == "Monroe, NY") {
            this.x = map(this.lon, -77.96, -77.41, 100, width-200); //-77.96 to -77.4
            this.y = map(this.lat, 43.33, 42.96, 100, height-300); //43.33 to 42.96
        }

        //scale population size to ellipse diamter range
        this.diamter = map(this.population, 0, 10000, 30, 70);

        //****VISUALIZATION DROPDOWN CASE 1 */
        //scale % non-citizens to arc range
        this.nsArcStop = map(this.NONCITIZEN, 0, 4, 0, 360);
        //scale median household income to bar length
        this.incomeBar = map(this.MEDIANINCOME, 0, 90000, 0, 50);
        //scale median gross rent to bar length
        this.rentBar = map(this.GROSSRENT, 0, 1500, 0, 50);

        //****VISUALIZATION DROPDOWN CASE 2 */
        //sacle % income below poverty line to arc range
        this.povertyArcStop = map(this.POVERTY, 0, 1000, 0, 360);
        //scale % general health status to bar length
        this.healthBar = map(this.health, 0, 35, 0, 50);
        //scale % sleeping <7 hours/night to bar length
        this.sleepBar = map(this.sleep, 0, 35, 0, 50);
    }

    /**
     * display: display graphics based on selected VIZ case
     * visual is only shown if data is available (>0)
     */
    display() {
        //draw ellipse based on population size (present for either case)
        fill(132, 140, 207, 100);
        ellipse(this.x, this.y, this.diamter);

        //get and store visualization case from UIMANG dropdown
        VIZ = UIMANG.getViz();

        switch(VIZ) {
            case "Map non-citizens, median household income, median gross-rent":
                //pi chart based on % non-citizens
                if (this.NONCITIZEN > 0) {
                    fill(22, 160, 133, 100);
                    arc(this.x, this.y, this.diamter, this.diamter, 0, this.nsArcStop*25);
                }

                //bar graph based on median household income
                if (this.MEDIANINCOME > 0) {
                    fill(154, 18, 179, 100);
                    rect(this.x-(this.diamter/2), this.y, 15, this.incomeBar);
                }

                //bar graph based on median gross rent
                if (this.GROSSRENT > 0) {
                    fill(186, 228, 229, 100);
                    rect(this.x+(this.diamter/2-15), this.y, 15, this.rentBar);
                }
                break;
            
            case "Map general health, sleep <7 hours, population income below poverty level":
                //pi chart based on % with income below poverty line
                if (this.POVERTY > 0) {
                    fill(250, 190, 88, 100);
                    arc(this.x, this.y, this.diamter, this.diamter, 0, this.povertyArcStop);
                }
                //bar graph based on % general health status
                if (this.health > 0) {
                    fill(175, 65, 84, 100);
                    rect(this.x-(this.diamter/2), this.y, 15, this.healthBar);
                }
                //bar graph based on % sleeping <7 hours/night
                if (this.sleep > 0) {
                    fill(241, 169, 160, 100);
                    rect(this.x+(this.diamter/2-15), this.y, 15, this.sleepBar);
                }

        }

        //if UIMANG checkbox checked then display string details on top of graphics
        if (UIMANG.detailsChecked()) {
            fill("white");
            text(this.toString(), this.x, this.y);
        }
    }

    /**
     * toString: make string from desired tract properties to display based on selected VIZ case
     * @returns {string} tractString
     */
    toString() {
        let tractString;

        switch(VIZ) {
            case "Map non-citizens, median household income, median gross-rent":
                //declare/format strings
                let noncitizenFormatted = formatObjs.percentage.format(this.NONCITIZEN);
                let medianincomeFormatted;
                let grossrentFormatted;

                //save "No data avilable" if data doesn't exist (<0), else format data
                if (this.MEDIANINCOME < 0) {
                    medianincomeFormatted = "No data available for";
                } else {
                    medianincomeFormatted = formatObjs.dollars.format(this.MEDIANINCOME);
                }

                if (this.GROSSRENT < 0) {
                    grossrentFormatted = "No data available for";
                } else {
                    grossrentFormatted = formatObjs.dollars.format(this.GROSSRENT);
                }
        
                //append formatted info to tractString
                tractString = "pop " + this.population + ", " + noncitizenFormatted + " noncitizens\n" +
                medianincomeFormatted + " median household income.\n" +
                grossrentFormatted + " median gross rent.";
                break;

            case "Map general health, sleep <7 hours, population income below poverty level":
                //declare/format strings    
                let healthFormatted;
                let sleepFormatted;
                let povertyFormatted = formatObjs.percentage.format(this.POVERTY / 1000);

                //save "No data avilable" if data doesn't exist (isNaN), else format data
                if (isNaN(this.health)) {
                    healthFormatted = "No data available for";
                } else {
                    healthFormatted = formatObjs.percentage.format(this.health / 100);
                }

                if (isNaN(this.sleep)) {
                    sleepFormatted = "No data available for";
                } else {
                    sleepFormatted = formatObjs.percentage.format(this.sleep / 100)
                }

                //append formatted info to tractString
                tractString = "pop " + this.population + ".\n" +
                healthFormatted + " general health status.\n" +
                sleepFormatted + " sleep <7 hours per night.\n" +
                povertyFormatted + " income below poverty level.";
                break;
        }

        return tractString;
    }
}