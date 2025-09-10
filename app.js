const opacityInput = document.getElementById('sliderDiv');

			const FeatureLayer = await $arcgis.import("@arcgis/core/layers/FeatureLayer.js");
            const TileLayer = await $arcgis.import("@arcgis/core/layers/TileLayer.js");
			const viewElement = document.querySelector("arcgis-map");
			const selectFilter = document.querySelector("#sqlSelect");
			const dateSlider = document.querySelector("#dateSlider");
			const defaultOption = document.querySelector("#defaultOption");
			const pointsFilterMenu = document.querySelector("#pointsFilter");
			const pointsSwitch = document.querySelector("calcite-switch");
			const defaultFilter = document.querySelector("#defaultFilter");
			let whereClause = defaultOption.value;
			const zoom = viewElement.zoom;
			const featureNode = document.querySelector("#feature-node");
			const expandCollapse = document.querySelector("#expandCollapse");
			let highlight;
          	let objectId;
          	const collapseIcon = document.getElementById('collapse-icon');
    		const expandIcon = document.getElementById('expand-icon');
    		let clickedGraphic = null;
			let currentHighlight = null;

			viewElement.addEventListener("arcgisViewReadyChange", () => {
    // All layer, popup, and event listener declarations should go here

    // Define popup for points layer
    const popupPoints = {
        title: "{orig_address_no} {orig_address_street}",
        content:
            "Original Street Address: {orig_address_no} {orig_address_street}<br>Municipality: {orig_city}<br>Primary Material: {prime_material}<br>Primary Function: {function_prime}<br>Place Description: {place_descript}<br>Source: 1902 Sanborn",
    };
    
    const points = {
    type: "unique-value",
    field: "prime_material",
    uniqueValueInfos: [{
        value: "wood frame",
        symbol: {
            type: "simple-marker", // Added type
            style: "circle",
            color: "#660000",
            size: 7.0,
            angle: 0.0,
            xoffset: 0,
            yoffset: 0,
            outline: {
                color: "#bfa87c",
                width: 1
            }
        }
    },
        {
        value: "brick", 
        symbol: {
            type: "simple-marker",
            style: "circle",
            color: "#bfa87c",
            size: 7.0,
            angle: 0.0,
            xoffset: 0,
            yoffset: 0,
            outline: {
                color: "#660000",
                width: 1
            }
        }
    }]
};
    
//const points = {
    //type: "unique-value",
    //field: "Is_NHL",
    //field2: "STATUS",
    //fieldDelimiter: ",",
    //uniqueValueInfos: [{
        //value: "X,Listed",
        //symbol: {
            //type: "simple-marker", // Added type
            //style: "circle",
            //color: [0, 112, 255, 255],
            //size: 10.0,
            //angle: 0.0,
            //xoffset: 0,
            //yoffset: 0,
            //outline: { // Corrected outline object
                //color: [0, 112, 255, 255],
                //width: 1
            //}
        //}
    //},
    //{
        //value: "<Null>,Listed",
        //symbol: {
            //type: "simple-marker", // Added type
            //style: "circle",
            //color: [255, 170, 0, 255],
            //size: 10.0,
            //angle: 0.0,
            //xoffset: 0,
            //yoffset: 0,
            //outline: { // Corrected outline object
                //color: [255, 170, 0, 255],
                //width: 1
            //}
        //}
    //},
    //{
        //value: "<Null>,Removed", // Added a new unique value for "Removed"
        //symbol: {
            //type: "simple-marker",
            //style: "circle",
            //color: "gray",
            //angle: 0.0,
            //xoffset: 0,
            //yoffset: 0,
            //outline: {
                //color: "gray",
                //width: 1
            //}
        //}
    //}]
//};
    
    // Define points layer
    //const pointsLayer = new FeatureLayer({
        //url: "https://mapservices.nps.gov/arcgis/rest/services/cultural_resources/nrhp_locations/MapServer/0",
        //outFields: ["RESNAME", "Address", "City", "NARA_URL", "Is_NHL", "STATUS"],
        //popupTemplate: popupPoints,
        //renderer: points,
    //});
    
    const pointsLayer = new FeatureLayer({
        url: "https://lyre.cofc.edu/server/rest/services/shoc/pl_sanborn1902/FeatureServer/0",
        outFields: ["prime_material", "function_prime", "place_descript", "orig_address_no", "orig_address_street", "orig_city"],
        //popupTemplate: popupPoints,
        renderer: points,
    });
    
    viewElement.map.add(pointsLayer, 1);

    // All event listeners are now consolidated in one place
    
viewElement.view.on("click", (event) => {
        viewElement.view.hitTest(event).then(function(response) {
    	if (response.results.length > 0) {
    const graphic = response.results[0].graphic;
    const prefix = graphic.attributes;
    // Clear the previous highlight
            if (currentHighlight) {
                currentHighlight.remove();
            }
            
 viewElement.view.whenLayerView(pointsLayer).then((layerView) => {
                currentHighlight = layerView.highlight(graphic, {
                    color: "red",
                    haloColor: "white",
                    haloOpacity: 0.8,
                    width: 2
                });
            });
             // Set the clicked graphic
            clickedGraphic = graphic;
    // Check if the prefix object is defined before trying to access its properties
    if (prefix.orig_city !== undefined) {
        const contentHTML = `
        <h2>${prefix.orig_address_no} ${prefix.orig_address_street}</h2>
            <b>Original Street Address:</b> ${prefix.orig_address_no} ${prefix.orig_address_street}<br>
            <b>Municipality:</b> ${prefix.orig_city}<br>
            <b>Primary Material:</b> ${prefix.prime_material}<br>
            <b>Primary Function:</b> ${prefix.function_prime}<br>
            <b>Place Description:</b> ${prefix.place_descript}<br>
            <b>Source:</b> 1902 Sanborn
        `;
        pointsInfo.innerHTML = contentHTML;
        featureNode.style.display = "block";
        featureNode.style.width= "25vw";
        viewElement.style.width="75vw";
        collapseIcon.style.display = "block";
        expandIcon.style.display = "none";
        
        
    } else {
        pointsInfo.innerHTML = "No points selected";
        clickedGraphic = null;
        //featureNode.style.display = "none";
        //viewElement.style.width="100vw";
    }
} else {
if (currentHighlight) {
                currentHighlight.remove();
            }
    pointsInfo.innerHTML = "No points selected";
    //featureNode.style.display = "none";
    //viewElement.style.width="100vw";
}
    });
});

    viewElement.addEventListener("arcgisViewChange", (event) => {
        queryCount(viewElement.extent);
    });
    
    dateSlider.addEventListener("calciteSliderChange", (event) => {
        queryCount(viewElement.extent);
    });

    pointsSwitch.addEventListener("calciteSwitchChange", () => {
        pointsLayer.visible = pointsSwitch.checked;
    });
pointsFilterMenu.addEventListener("change", (event) => {
    // Get the ID of the checked radio button, which corresponds to the filter value
    const selectedValue = event.target.id;
    console.log("Selected value: " + selectedValue);
    
     // Update active button styling
        const buttons = pointsFilterMenu.querySelectorAll('label');
        buttons.forEach(button => {
            button.classList.remove('active');
        });

// Add the 'active' class to the parent label of the clicked input
        event.target.closest('label').classList.add('active');
        
    let pointsFilterExpression = "";

    switch (selectedValue) {
        case "brick":
            pointsFilterExpression = "prime_material = 'brick'";
            break;
        case "wood":
            pointsFilterExpression = "prime_material = 'wood frame'";
            break;
        case "both":
        default:
            pointsFilterExpression = "1=1";
            break;
    }
    
    // Check if pointsLayer is defined before applying the filter
    if (pointsLayer) {
        pointsLayer.definitionExpression = pointsFilterExpression;
    }
});

expandCollapse.addEventListener('click', () => {

    // Check if the featureNode is currently visible
    if (featureNode.style.display === "block") {
        // If it's visible, collapse it
        featureNode.style.display = "none";
        viewElement.style.width = "100vw";
        collapseIcon.style.display = "none";
        expandIcon.style.display = "block";
    } else {
        // If it's hidden, expand it
        featureNode.style.display = "block";
        viewElement.style.width = "75vw";
        collapseIcon.style.display = "block";
        expandIcon.style.display = "none";
    }
});
});

//  dynamically populate historic map dropdown

function queryCount(extent) {
    selectFilter.innerHTML = '<calcite-option id="defaultOption" value="1=0" label="Choose a historic map"></calcite-option>';
    const minYear = dateSlider.minValue;
    const maxYear = dateSlider.maxValue;
    console.log(`Filtering maps from ${minYear} to ${maxYear}`);
    const mapYearFilter = `CAST(mapyear AS INTEGER) >= ${minYear} AND CAST(mapyear AS INTEGER) <= ${maxYear}`;
    
    const parcelQuery = {
        where: mapYearFilter,
        spatialRelationship: "intersects",
        geometry: extent,
        outFields: ["title", "mapyear", "service_url", "source_description", "mapday", "mapmonth", "publisher", "author", "cartographer_surveyor", "orig_repository"],
        returnGeometry: true,
    };

					parcelLayer
						.queryFeatures(parcelQuery)
						.then((results) => {
							console.log("Feature count: " + results.features.length);

							// 1. Extract and sort features by mapyear
							const sortedFeatures = results.features
							.filter((feature) => feature.attributes.mapyear) // Ensure mapyear exists
							.sort((a, b) => a.attributes.mapyear - b.attributes.mapyear);

							// 2. Track seen years to avoid duplicates
							const seenYears = new Set();

							// 3. Create and append sorted options
							sortedFeatures.forEach((feature) => {
							const year = feature.attributes.mapyear;
							const title = feature.attributes.title;
							const service_url = feature.attributes.service_url;

							if (seenYears.has(year)) return;
							seenYears.add(year);

							const option = document.createElement("calcite-option");
							option.setAttribute("label", `${year} ${title}`);
							option.setAttribute("value", `service_url = '${service_url}'`);
							selectFilter.appendChild(option);
							});



				});
			};
                
				//pulls up historic map
				// Event listener - after dropdown option selected
				selectFilter.addEventListener("calciteSelectChange", (event) => {
					whereClause = event.target.value;

					queryFeatureLayer(viewElement.extent);

				});

				// Get query layer and set up query
				const parcelLayer = new FeatureLayer({
					url: "https://portal1-geo.sabu.mtu.edu/server/rest/services/Hosted/map_index/FeatureServer/0",
				});

				function queryFeatureLayer(extent) {
				
				// If the default option is selected, remove the tile layer and exit
    if (whereClause === '1=0') {
        if (tileLayer) {
            viewElement.map.remove(tileLayer);
            mapsInfo.innerHTML = "No maps selected"
        }
        // This line is crucial to ensure the historic map is not loaded
        viewElement.graphics.removeAll();
        return;
    }
				
    const parcelQuery = {
        where: whereClause,
        spatialRelationship: "intersects",
        geometry: extent,
        outFields: ["title", "mapyear", "service_url", "source_description", "mapday", "mapmonth", "publisher", "author", "cartographer_surveyor", "orig_repository"],
        returnGeometry: true,
    };

    parcelLayer
        .queryFeatures(parcelQuery)
        .then((results) => {
            console.log("Feature count: " + results.features.length);
            displayResults(results);
        })
        .catch((error) => {
            console.log(error.error);
        });
}

let tileLayer;

function displayResults(results) {
    const service_url = results.features[0]?.attributes?.service_url;
    const mapPrefix = results.features[0]?.attributes;

    if (!service_url) {
        console.error("No service_url found in feature attributes.");
        return;
    }

    // Remove previous tile layer if it exists
    if (tileLayer) {
        viewElement.map.remove(tileLayer);
        mapsInfo.innerHTML = "No maps selected"
    }
    
    // Remove the points layer before adding the new tile layer, so we can re-add it on top
    const existingPointsLayer = viewElement.map.layers.find(layer => layer.id === "pointsLayer");
    if (existingPointsLayer) {
        viewElement.map.remove(existingPointsLayer);
    }

    const initialOpacity = parseFloat(opacityInput.value) / 100;

    tileLayer = new TileLayer({
        url: service_url,
        opacity: initialOpacity,
    });

    // Add the tile layer first, at the bottom of the stack
    viewElement.map.add(tileLayer, 0);
    
    
    featureNode.style.display = "block";
    featureNode.style.width= "25vw";
    viewElement.style.width="75vw";
    mapsInfo.innerHTML = `<h2>${mapPrefix.mapyear} ${mapPrefix.title}</h2>
                <b>Title:</b> ${mapPrefix.title}<br>
            <b>Date:</b> ${mapPrefix.mapmonth}/${mapPrefix.mapday}/${mapPrefix.mapyear}<br>
            <b>Description:</b> ${mapPrefix.source_description}<br>
            <b>Publisher:</b> ${mapPrefix.publisher}<br>
            <b>Author:</b> ${mapPrefix.author}<br>
            <b>Cartographer/Surveyor:</b> ${mapPrefix.cartographer_surveyor}<br>
            <b>Original Repository:</b> ${mapPrefix.orig_repository}<br>
            <a href=${mapPrefix.service_url}>View Service URL</a>`;

    // Re-add the points layer on top of the tile layer
    const pointsLayer = new FeatureLayer({
        url: "https://mapservices.nps.gov/arcgis/rest/services/cultural_resources/nrhp_locations/MapServer/0",
        outFields: ["RESNAME", "Address", "City", "NARA_URL", "Is_NHL", "STATUS"],
        //popupTemplate: popupPoints,
        renderer: points,
        id: "pointsLayer" // Give the layer an ID for easy referencing
    });
    viewElement.map.add(pointsLayer, 1);

    const symbol = {
        type: "simple-fill",
        color: [20, 130, 200, 0],
        outline: {
            color: [20, 130, 200, 0],
            width: 0.5,
        },
    };

    const popupTemplate = {
        title: "{mapyear} {title}",
        content:
            "Title: {title}<br>Date: {mapmonth}/{mapday}/{mapyear}<br>Description: {source_description}<br>Publisher: {publisher}<br>Author: {author}<br>Cartographer/Surveyor: {cartographer_surveyor}<br>Original Repository: {orig_repository}<br><a href={service_url}>View Service URL</a>",
    };

    results.features.map((feature) => {
        feature.symbol = symbol;
        //feature.popupTemplate = popupTemplate;
        return feature;
    });

    viewElement.closePopup();
    viewElement.graphics.removeAll();
    viewElement.graphics.addMany(results.features);
}
opacityInput.addEventListener('mouseup', function() {
    if (this.value > 0) {
        console.log("Range Slider has value of " + this.value);
        if (tileLayer) {
            tileLayer.opacity = parseFloat(this.value) / 100;
        }
    } else{
        console.log("Range Slider has value of " + this.value);
    }
});


  const rangeInput = document.getElementById('sliderDiv');
  const rangeOutput = document.getElementById('rangeValue');
