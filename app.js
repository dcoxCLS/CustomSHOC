  const opacityInput = document.getElementById('sliderDiv');

			const FeatureLayer = await $arcgis.import("@arcgis/core/layers/FeatureLayer.js");
            const TileLayer = await $arcgis.import("@arcgis/core/layers/TileLayer.js");

			const viewElement = document.querySelector("arcgis-map");
			const selectFilter = document.querySelector("#sqlSelect");
			const defaultOption = document.querySelector("#defaultOption");
			let whereClause = defaultOption.value;
			const zoom = viewElement.zoom;

			viewElement.addEventListener("arcgisViewReadyChange", () => {

				//dynamically update dropdown
				//event listener for when the extent of the map changes
				viewElement.addEventListener("arcgisViewChange", (event) => {
					queryCount(viewElement.extent);
				});

				function queryCount(extent) {
					selectFilter.innerHTML = '<calcite-option id="defaultOption" value="1=0" label="Choose a historic map"></calcite-option>';
					const parcelQuery = {
						spatialRelationship: "intersects", // Relationship operation to apply
						geometry: extent, // Restricted to visible extent of the map
						outFields: ["title", "mapyear", "service_url"], // Attributes to return
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

							if (seenYears.has(year)) return;
							seenYears.add(year);

							const option = document.createElement("calcite-option");
							option.setAttribute("label", `${year} ${title}`);
							option.setAttribute("value", `mapyear = '${year}'`);
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
                    viewElement.map.layers.removeAll();
					const parcelQuery = {
						where: whereClause, // Set by select element
						spatialRelationship: "intersects", // Relationship operation to apply
						geometry: extent, // Restricted to visible extent of the map
						outFields: ["title", "mapyear", "service_url"], // Attributes to return
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

                viewElement.map.add(tileLayer);

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
						title: "{title} {mapyear}",
						content:
							"Maker: {title} <br> Year: {mapyear} <br> <a href={service_url}>View Service URL</a>",
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
});
