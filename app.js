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

			viewElement.addEventListener("arcgisViewReadyChange", () => {
    // All layer, popup, and event listener declarations should go here

    // Define popup for points layer
    const popupPoints = {
        title: "{RESNAME}",
        content:
            "Street Address: {Address}<br>Municipality: {City}<br>URL: <a href={NARA_URL}>View URL</a>",
    };
    
    // Define points layer
    const pointsLayer = new FeatureLayer({
        url: "https://mapservices.nps.gov/arcgis/rest/services/cultural_resources/nrhp_locations/MapServer/0",
        outFields: ["RESNAME", "Address", "City", "NARA_URL", "Is_NHL", "STATUS"],
        popupTemplate: popupPoints,
    });
    
    viewElement.map.add(pointsLayer, 1);

    // All event listeners are now consolidated in one place
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

    let pointsFilterExpression = "";

    switch (selectedValue) {
        case "NHL":
            pointsFilterExpression = "Is_NHL IS NOT NULL AND STATUS = 'Listed'";
            break;
        case "NRHP":
            pointsFilterExpression = "Is_NHL IS NULL AND STATUS = 'Listed'";
            break;
        case "removed":
            pointsFilterExpression = "STATUS = 'Removed'";
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
                    viewElement.map.remove(tileLayer);
					const parcelQuery = {
						where: whereClause, // Set by select element
						spatialRelationship: "intersects", // Relationship operation to apply
						geometry: extent, // Restricted to visible extent of the map
						outFields: ["title", "mapyear", "service_url", "source_description", "mapday", "mapmonth", "publisher", "author", "cartographer_surveyor", "orig_repository"], // Attributes to return
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
let tileLayer; // Declare this BEFORE displayResults is defined

                function displayResults(results) {
                const service_url = results.features[0]?.attributes?.service_url;

                if (!service_url) {
                    console.error("No service_url found in feature attributes.");
                    return;
                }

                // Remove previous tile layer if it exists
                if (tileLayer) {
                    viewElement.map.remove(tileLayer);
                }

                const initialOpacity = parseFloat(opacityInput.value) / 100;

                tileLayer = new TileLayer({
                    url: service_url,
                    opacity: initialOpacity,
                    });

                viewElement.map.add(tileLayer,0);
				const symbol = {
						type: "simple-fill",
						color: [20, 130, 200, 0],
						outline: {
							color: [20, 130, 200, 0],
							width: 0.5,
						},
					};
                    //popup
					const popupTemplate = {
						title: "{mapyear} {title}",
						content:
							"Title: {title}<br>Date: {mapmonth}/{mapday}/{mapyear}<br>Description: {source_description}<br>Publisher: {publisher}<br>Author: {author}<br>Cartographer/Surveyor: {cartographer_surveyor}<br>Original Repository: {orig_repository}<br><a href={service_url}>View Service URL</a>",
					}      

					// Assign styles and popup to features
					results.features.map((feature) => {
						feature.symbol = symbol;
						feature.popupTemplate = popupTemplate;
						return feature;
					});


					// Clear display
					viewElement.closePopup();
					viewElement.graphics.removeAll();
					// Add features to graphics layer
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
