export const LOCATIONS = [
    {
        name: "Australia",
        states: [
            {
                name: "New South Wales",
                cities: ["Sydney", "Newcastle", "Central Coast", "Wollongong", "Maitland", "Tweed Heads", "Coffs Harbour", "Albury", "Port Macquarie"]
            },
            {
                name: "Victoria",
                cities: ["Melbourne", "Geelong", "Ballarat", "Bendigo", "Shepparton", "Melton", "Mildura", "Warrnambool", "Sunbury"]
            },
            {
                name: "Queensland",
                cities: ["Brisbane", "Gold Coast", "Sunshine Coast", "Townsville", "Cairns", "Toowoomba", "Mackay", "Rockhampton", "Bundaberg"]
            },
            {
                name: "Western Australia",
                cities: ["Perth", "Bunbury", "Mandurah", "Busselton", "Geraldton", "Kalgoorlie", "Albany", "Broome"]
            },
            {
                name: "South Australia",
                cities: ["Adelaide", "Mount Gambier", "Gawler", "Whyalla", "Murray Bridge", "Mount Barker", "Port Lincoln"]
            },
            {
                name: "Tasmania",
                cities: ["Hobart", "Launceston", "Devonport", "Burnie", "Kingston"]
            },
            {
                name: "Australian Capital Territory",
                cities: ["Canberra"]
            },
            {
                name: "Northern Territory",
                cities: ["Darwin", "Alice Springs", "Palmerston", "Katherine"]
            }
        ]
    },
    {
        name: "United States",
        states: [
            { name: "Alabama", cities: ["Birmingham", "Montgomery", "Mobile", "Huntsville"] },
            { name: "Alaska", cities: ["Anchorage", "Juneau", "Fairbanks", "Sitka"] },
            { name: "Arizona", cities: ["Phoenix", "Tucson", "Mesa", "Chandler", "Scottsdale"] },
            { name: "Arkansas", cities: ["Little Rock", "Fort Smith", "Fayetteville", "Springdale"] },
            { name: "California", cities: ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Sacramento", "Fresno"] },
            { name: "Colorado", cities: ["Denver", "Colorado Springs", "Aurora", "Fort Collins"] },
            { name: "Connecticut", cities: ["Bridgeport", "New Haven", "Stamford", "Hartford"] },
            { name: "Delaware", cities: ["Wilmington", "Dover", "Newark", "Middletown"] },
            { name: "Florida", cities: ["Miami", "Orlando", "Tampa", "Jacksonville", "Tallahassee"] },
            { name: "Georgia", cities: ["Atlanta", "Columbus", "Augusta", "Macon", "Savannah"] },
            { name: "Hawaii", cities: ["Honolulu", "Hilo", "Kailua", "Kapolei"] },
            { name: "Idaho", cities: ["Boise", "Meridian", "Nampa", "Idaho Falls"] },
            { name: "Illinois", cities: ["Chicago", "Aurora", "Rockford", "Joliet", "Naperville"] },
            { name: "Indiana", cities: ["Indianapolis", "Fort Wayne", "Evansville", "South Bend"] },
            { name: "Iowa", cities: ["Des Moines", "Cedar Rapids", "Davenport", "Sioux City"] },
            { name: "Kansas", cities: ["Wichita", "Overland Park", "Kansas City", "Olathe"] },
            { name: "Kentucky", cities: ["Louisville", "Lexington", "Bowling Green", "Owensboro"] },
            { name: "Louisiana", cities: ["New Orleans", "Baton Rouge", "Shreveport", "Metairie"] },
            { name: "Maine", cities: ["Portland", "Lewiston", "Bangor", "South Portland"] },
            { name: "Maryland", cities: ["Baltimore", "Columbia", "Germantown", "Silver Spring"] },
            { name: "Massachusetts", cities: ["Boston", "Worcester", "Springfield", "Cambridge"] },
            { name: "Michigan", cities: ["Detroit", "Grand Rapids", "Warren", "Sterling Heights"] },
            { name: "Minnesota", cities: ["Minneapolis", "Saint Paul", "Rochester", "Duluth"] },
            { name: "Mississippi", cities: ["Jackson", "Gulfport", "Southaven", "Hattiesburg"] },
            { name: "Missouri", cities: ["Kansas City", "Saint Louis", "Springfield", "Independence"] },
            { name: "Montana", cities: ["Billings", "Missoula", "Great Falls", "Bozeman"] },
            { name: "Nebraska", cities: ["Omaha", "Lincoln", "Bellevue", "Grand Island"] },
            { name: "Nevada", cities: ["Las Vegas", "Henderson", "Reno", "North Las Vegas"] },
            { name: "New Hampshire", cities: ["Manchester", "Nashua", "Concord", "Derry"] },
            { name: "New Jersey", cities: ["Newark", "Jersey City", "Paterson", "Elizabeth"] },
            { name: "New Mexico", cities: ["Albuquerque", "Las Cruces", "Rio Rancho", "Santa Fe"] },
            { name: "New York", cities: ["New York City", "Buffalo", "Rochester", "Yonkers", "Syracuse"] },
            { name: "North Carolina", cities: ["Charlotte", "Raleigh", "Greensboro", "Durham"] },
            { name: "North Dakota", cities: ["Fargo", "Bismarck", "Grand Forks", "Minot"] },
            { name: "Ohio", cities: ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron"] },
            { name: "Oklahoma", cities: ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow"] },
            { name: "Oregon", cities: ["Portland", "Salem", "Eugene", "Gresham"] },
            { name: "Pennsylvania", cities: ["Philadelphia", "Pittsburgh", "Allentown", "Reading"] },
            { name: "Rhode Island", cities: ["Providence", "Warwick", "Cranston", "Pawtucket"] },
            { name: "South Carolina", cities: ["Charleston", "Columbia", "North Charleston", "Mount Pleasant"] },
            { name: "South Dakota", cities: ["Sioux Falls", "Rapid City", "Aberdeen", "Brookings"] },
            { name: "Tennessee", cities: ["Nashville", "Memphis", "Knoxville", "Chattanooga"] },
            { name: "Texas", cities: ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth", "El Paso"] },
            { name: "Utah", cities: ["Salt Lake City", "West Valley City", "Provo", "West Jordan"] },
            { name: "Vermont", cities: ["Burlington", "South Burlington", "Rutland", "Barre"] },
            { name: "Virginia", cities: ["Virginia Beach", "Norfolk", "Chesapeake", "Richmond"] },
            { name: "Washington", cities: ["Seattle", "Spokane", "Tacoma", "Vancouver", "Bellevue"] },
            { name: "West Virginia", cities: ["Charleston", "Huntington", "Morgantown", "Parkersburg"] },
            { name: "Wisconsin", cities: ["Milwaukee", "Madison", "Green Bay", "Kenosha"] },
            { name: "Wyoming", cities: ["Cheyenne", "Casper", "Laramie", "Gillette"] }
        ]
    },
    {
        name: "United Kingdom",
        states: [
            { name: "England", cities: ["London", "Birmingham", "Manchester", "Liverpool", "Leeds", "Sheffield", "Bristol", "Leicester"] },
            { name: "Scotland", cities: ["Glasgow", "Edinburgh", "Aberdeen", "Dundee", "Inverness", "Perth", "Stirling"] },
            { name: "Wales", cities: ["Cardiff", "Swansea", "Newport", "Wrexham", "Bangor", "St Davids"] },
            { name: "Northern Ireland", cities: ["Belfast", "Derry", "Lisburn", "Newry", "Armagh"] }
        ]
    }
];
