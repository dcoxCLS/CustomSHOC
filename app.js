window.Ionic = {
    config: {
        rippleEffect: false,
        innerHTMLTemplatesEnabled: true,
        mode: 'md',
    },
};

// Fetch the config.json file
fetch('config.json')
    .then(response => response.json())
    .then(config => {
        // Apply title from the config.json file
        document.title = config.navbar.title;
        // Apply style settings from the config.json file
        const appTitle = document.getElementById('appTitle');
        const mainToolbar = document.getElementById('mainToolbar');
        const storyToolbar = document.getElementById('storyToolbar');
        const footer = document.getElementById('footer');
        const splash = document.getElementById('splashModal');
        const splashText = document.getElementById('splashText');
        const splashNavBar = document.getElementById('splashNavBar');
        const mapcount = document.getElementById('mapcount');
        const slider = document.getElementById('slider');
        const geolocation = document.getElementById('geolocation');
        const progress = document.querySelector('ion-progress-bar');

        appTitle.textContent = config.navbar.title;
        appTitle.style.setProperty('color', config.navbar.textColor);
        mainToolbar.style.setProperty('--ion-toolbar-background', config.navbar.backgroundColor);
        document.documentElement.style.setProperty('--ion-tab-bar-background', config.footer.backgroundColor);
        document.documentElement.style.setProperty('--ion-tab-bar-color-selected', config.footer.iconColorActive);
        document.documentElement.style.setProperty('--ion-tab-bar-color', config.footer.iconColorInactive);
        document.getElementById('app-logo').src = config.navbar.logo;
        document.documentElement.style.setProperty('--ion-tab-bar-color', config.footer.iconColorInactive);
        splash.style.setProperty('--ion-background-color', config.splashScreen.backgroundColor);
        document.getElementById('splashImg').src = config.splashScreen.image;
        splashText.innerHTML = config.splashScreen.paragraphText;
        splashText.style.setProperty('color', config.splashScreen.textColor);
        splashNavBar.style.setProperty('--ion-toolbar-background', config.splashScreen.navBarColor);
        splashTitle.style.setProperty('color', config.splashScreen.titleColor);
        splashTitle.innerHTML = config.splashScreen.title;
        splashModalClose.style.setProperty('color', config.splashScreen.closeTextColor);
        mapcount.style.setProperty('background-color', config.mapCountIcon.backgroundColor);
        mapcount.style.setProperty('color', config.mapCountIcon.textColor);
        slider.style.setProperty('--bar-background', config.transparencySlider.barColorInactive);
        slider.style.setProperty('--bar-background-active', config.transparencySlider.barColorActive);
        slider.style.setProperty('--knob-background', config.transparencySlider.handleColor);
        geolocation.style.setProperty('--ion-color-base', config.gpsButton.backgroundColor);
        geolocation.style.setProperty('color', config.gpsButton.iconColorInactive);
        takeMed.style.setProperty('color', config.storyButtons.textColor);
        takeMed.style.setProperty('--ion-color-primary', config.storyButtons.backgroundColor);
        takeVid.style.setProperty('color', config.storyButtons.textColor);
        takeVid.style.setProperty('--ion-color-primary', config.storyButtons.backgroundColor);
        takePic.style.setProperty('color', config.storyButtons.textColor);
        takePic.style.setProperty('--ion-color-primary', config.storyButtons.backgroundColor);
        takeAud.style.setProperty('color', config.storyButtons.textColor);
        takeAud.style.setProperty('--ion-color-primary', config.storyButtons.backgroundColor);
        locOpt.style.setProperty('color', config.storyButtons.textColor);
        locOpt.style.setProperty('--ion-color-primary', config.storyButtons.backgroundColor);
        mapOpt.style.setProperty('color', config.storyButtons.textColor);
        backBtn1.style.setProperty('--ion-color-primary', config.storyButtons.textColor);
        nextBtn2.style.setProperty('--ion-color-primary', config.storyButtons.textColor);
        backBtn2.style.setProperty('--ion-color-primary', config.storyButtons.textColor);
        nextBtn3.style.setProperty('--ion-color-primary', config.storyButtons.textColor);
        backBtn3.style.setProperty('--ion-color-primary', config.storyButtons.textColor);
        submitBtn.style.setProperty('--ion-color-primary', config.storyButtons.textColor);
        mapOpt.style.setProperty('--ion-color-primary', config.storyButtons.backgroundColor);
        submitIcon.style.setProperty('color', config.storyButtons.backgroundColor);
        bar1.style.setProperty('--background', config.storyProgressBar.colorInactive);
        bar1.style.setProperty('--progress-background', config.storyProgressBar.colorActive);
        bar2.style.setProperty('--background', config.storyProgressBar.colorInactive);
        bar2.style.setProperty('--progress-background', config.storyProgressBar.colorActive);
        bar3.style.setProperty('--background', config.storyProgressBar.colorInactive);
        bar3.style.setProperty('--progress-background', config.storyProgressBar.colorActive);
        bar4.style.setProperty('--background', config.storyProgressBar.colorInactive);
        bar4.style.setProperty('--progress-background', config.storyProgressBar.colorActive);
        document.documentElement.style.setProperty('--ion-background-color', config.body.backgroundColor);
        document.documentElement.style.setProperty('--ion-text-color', config.body.textColor);
        document.documentElement.style.setProperty('--ion-border-color', config.body.textColor);
        storyToolbar.style.setProperty('--ion-toolbar-background', config.storyPopup.headerBackgroundColor);
        storymodaltitle.style.setProperty('color', config.storyPopup.headerTextColor);

        // Generare links from the link list
        const links = config.links; // Array of links from config.json
        const linkList = document.getElementById('linkList'); // The ion-list element

        // Clear existing content
        linkList.innerHTML = '';

        // Loop through each link in the config and create an ion-item
        links.forEach(link => {
            const ionItem = document.createElement('ion-item');
            ionItem.setAttribute('button', 'true');
            ionItem.setAttribute('detail', 'false');
            ionItem.setAttribute('href', link.url);
            ionItem.textContent = link.text; // Set the display text

            // Append the ion-item to the list
            linkList.appendChild(ionItem);
        });

        require(["esri/config",
                "esri/Map",
                "esri/views/MapView",
                "esri/layers/FeatureLayer",
                "esri/layers/TileLayer",
                'esri/layers/WebTileLayer',
                "esri/widgets/Track", "esri/Graphic",
                "esri/layers/GraphicsLayer",
                "esri/geometry/support/webMercatorUtils",
                "esri/geometry/Point"
            ],
            function(esriConfig, Map, MapView, FeatureLayer, TileLayer, WebTileLayer, Track, Graphic, GraphicsLayer, webMercatorUtils, Point) {
                function validateFile(file) {
                    const video = document.createElement('video');
                    video.preload = 'metadata';
                    video.onloadedmetadata = function() {
                        window.URL.revokeObjectURL(video.src);
                        if (video.duration > 15) {
                            console.log("this video is longer than 15 seconds!");
                            return;
                        }
                        methodToCallIfValid();
                    }
                    video.src = URL.createObjectURL(file);
                }

                async function presentToast() {
                    const toast = document.createElement('ion-toast');
                    toast.message = 'Press and hold on the map where you want to share a story.';
                    toast.duration = 2000;
                    document.body.appendChild(toast);
                    return toast.present();
                }

                const StoryModal = document.getElementById('storyModal');

                const splashModal = document.getElementById('splashModal');

                const tabs = document.querySelector('ion-tabs');

                const submitting = document.getElementById('loadSubmit');

                const range = document.querySelector('ion-range');

                if (config.splashScreen.visible == false) {
                    splashModal.isOpen = false;
                } else {
                    splashModal.isOpen = true;
                }

                /* $(document).ready(function() {
                   if ($.cookie('pop') == null) {
                     splashModal.isOpen = true;
                     $.cookie('pop', '7');
                   }
                  });  */

                $("#nextBtn1").click(function() {
                    slides.update();
                    slides.slideNext();
                    console.log('slides');
                });

                $("#backBtn1").click(function() {
                    slides.update();
                    slides.slidePrev();
                    console.log('slides');
                });

                $("#nextBtn2").click(function() {

                    slides.update();
                    slides.slideNext();
                    console.log('slides');
                });

                function validate() {
                    const userDate = $('#userDate').val();
                    const userTitle = $('#userTitle').val();
                    console.log(userTitle, userDate);
                    const dateRGEX = /^\d{4}$|^\d{4}-\d{4}$|^\d{2}\/\d{2}\/\d{4}$/;
                    const dateResult = dateRGEX.test(userDate);
                    console.log(dateResult);
                    if (userTitle == "" || userTitle == null) {
                        $("#titleError").css("display", "block");
                        $("#userTitle").css("--border-color", "red");
                        console.log("invalid story title!");
                    }
                    if (dateResult == false) {
                        $("#dateError").css("display", "block");
                    }

                    if (dateResult == true && userTitle != "") {
                        $("#titleError").css("display", "none");
                        $("#dateError").css("display", "none");
                        slides.update();
                        slides.slideNext();
                    }
                }

                $("#backBtn2").click(function() {
                    slides.update();
                    slides.slidePrev();
                });

                $("#nextBtn3").click(function() {
                    validate();
                });

                $("#backBtn3").click(function() {
                    slides.update();
                    slides.slidePrev();
                    console.log('slides');
                });

                $("#takeAud").click(function() {
                    presentAlert();
                });

                $("#takeVid").click(function() {
                    const vidFile = document.getElementById('vidInput');
                    vidFile.click();
                });

                $("#takeMed").click(function() {
                    const medFile = document.getElementById('medInput');
                    medFile.click();
                });

                $("#takePic").click(function() {
                    const picFile = document.getElementById('picInput');
                    picFile.click();
                });

                // create an array of empty files  
                const files = [];
                // get files from input sources and push into array
                const picInput = document.getElementById('picInput');
                picInput.onchange = () => {
                    files.push(picInput.files[0]);
                    console.log(picInput.files[0]);
                    const picFileVal = $('#picInput').val();
                    takePic.textContent = "..." + picFileVal.substring(30);
                }

                // get files from input sources and push into array
                const medInput = document.getElementById('medInput');
                medInput.onchange = () => {
                    files.push(medInput.files[0]);
                    console.log(medInput.files[0]);
                    const medFileVal = $('#medInput').val();
                    takeMed.textContent = "..." + medFileVal.substring(20);
                }

                let vidSize;
                const vidInput = document.getElementById('vidInput');
                vidInput.onchange = () => {
                    const selectedFile = vidInput.files[0];
                    const video = document.createElement('video');
                    video.preload = 'metadata';
                    video.onloadedmetadata = function() {
                        window.URL.revokeObjectURL(video.src);
                        if (video.duration > 15.999999) { // limit video to 15 seconds
                            vidAlert();
                        } else {
                            files.push(vidInput.files[0]);
                            console.log(vidInput.files[0]);
                            const vidFileVal = $('#vidInput').val();
                            takeVid.textContent = "..." + vidFileVal.substring(20);
                        }
                    }

                    video.src = URL.createObjectURL(selectedFile);

                }

                const audInput = document.getElementById('audInput');
                audInput.onchange = () => {
                    files.push(audInput.files[0]);
                    console.log(audInput.files[0]);
                }

                // when the user clicks the audio record button
                $(document).on('click', '#record', function() {
                    alert.backdropDismiss = false;
                    // check if the user has a microphone
                    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                        console.log("getUserMedia supported.");
                        navigator.mediaDevices
                            .getUserMedia(
                                // constraints - only audio needed for this app
                                {
                                    audio: true,
                                }
                            )

                            // Success callback
                            .then(function(stream) {
                                const options = {
                                    // mimeType: 'audio/mpeg'
                                }
                                const mediaRecorder = new MediaRecorder(stream, options);
                                mediaRecorder.start();

                                document.getElementById("message").innerHTML = '<center><ion-fab-button color="danger" id="stop" style="width: 120px; height: 120px;"><ion-icon name="mic-outline" id="stopicon" style="width: 100px; height: 100px;"></ion-icon></ion-fab-button></center>';

                                alert.header = 'Recording...';
                                alert.subHeader = 'Tap on the mic icon to stop recording.';

                                function blink() {
                                    $('#stop').delay(500).fadeTo(500, 0.5).delay(500).fadeTo(500, 1, blink);
                                }

                                $(document).ready(function() {
                                    blink();
                                });

                                // setup a count timer for the audio recording
                                let time = 0;

                                const timer = setInterval(function() {
                                    time++;
                                    let minutes = Math.floor(time / 60);
                                    let seconds = time - minutes * 60;

                                    function str_pad_left(string, pad, length) {
                                        return (new Array(length + 1).join(pad) + string).slice(-length);
                                    }

                                    let finalTime = str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2);
                                    document.getElementById("time").innerHTML = "<center><h2>" + finalTime + "</h2></center>";
                                }, 1000);

                                let chunks = [];

                                mediaRecorder.ondataavailable = function(e) {
                                    chunks.push(e.data);
                                };

                                // when the user clicks the audio stop button
                                $(document).on('click', '#stop', function() {
                                    alert.backdropDismiss = true;
                                    // stop the timer
                                    clearInterval(timer);
                                    // stop the recording
                                    mediaRecorder.stop();
                                    const tracks = stream.getTracks();
                                    tracks.forEach(function(track) {
                                        track.stop();
                                    });
                                });

                                mediaRecorder.onstop = function(e) {
                                    const blob = new Blob(chunks, {
                                        type: "audio/mpeg"
                                    });
                                    chunks = [];
                                    const audioURL = window.URL.createObjectURL(blob);
                                    const file = new File([blob], 'audiostory.mp3', {
                                        type: blob.type,
                                    });

                                    console.log(file);
                                    files.push(file);
                                    //console.log(audioURL);
                                    alert.dismiss();
                                    takeAud.textContent = file.name;
                                    //audio.src = audioURL;
                                };
                            })

                            // Error callback
                            .catch(function(err) {
                                console.error(`The following getUserMedia error occurred: ${err}`);
                            });
                    } else {
                        console.log("getUserMedia not supported on your browser!");
                    }
                });

                // Dynamically generates a story for the modal
                // Either on click or from URL paramters 
                function buildStory(graphic) {
                    //const graphic = response.results[0].graphic; 
                    console.log(graphic);
                    $("#storyimg").attr("src", "");
                    $("#piclabel").hide();
                    $("#audlabel").hide();
                    $("#vidlabel").hide();
                    document.getElementById("pictures").innerHTML = "";
                    document.getElementById("videos").innerHTML = "";
                    document.getElementById("sound").innerHTML = "";
                    const objectId = graphic.attributes.objectid;
                    const title = graphic.attributes.title;
                    const desc = linkifyHtml(graphic.attributes.description);
                    const date = graphic.attributes.userdate;
                    const name = graphic.attributes.name;
                    $('#subtitle').html(date);
                    $('#storydesc').html(desc);
                    $('#storytitle').html(title);
                    $('#storymodaltitle').html(title);
                    if (name == "" || name == null) {
                        $('#storyauthor').html("by Anonymous");
                    } else {
                        $('#storyauthor').html("by " + name);
                    }
                    // Open the modal popup for storeis
                    storyModal.isOpen = true;
                    // Query the attachments from the clicked story
                    storyLayer.queryAttachments({
                        //  attachmentTypes: ["image/jpeg", "video/mp4", "sound/mp3"],
                        objectIds: objectId
                    }).then(function(attachmentsByFeatureId) {
                        console.log(attachmentsByFeatureId);
                        if (!attachmentsByFeatureId) {
                            return;
                        }
                        if (Object.keys(attachmentsByFeatureId).length === 0) {
                            // if there are no attachments, do something here.
                            $("#storyimg").attr("src", "");
                        }
                        // Display the attachments
                        Object.keys(attachmentsByFeatureId)
                            .forEach(function(objectId) {
                                const attachments = attachmentsByFeatureId[objectId];
                                attachments.forEach(function(attachment) {
                                    if (attachment.contentType == "image/jpeg" || attachment.contentType == "image/png" || attachment.contentType == "image/gif") {
                                        const imgarray = [];
                                        imgarray.push(attachment);
                                        const attachUrl = imgarray[0].url;
                                        $("#storyimg").attr("src", attachUrl);
                                        $("#piclabel").show();
                                        const elem = document.createElement("img");
                                        elem.src = imgarray[0].url;
                                        document.getElementById("pictures").appendChild(elem);
                                    } else if (attachment.contentType == "video/mp4" || attachment.contentType == "video/quicktime") {
                                        $("#vidlabel").show();
                                        const vidarray = [];
                                        vidarray.push(attachment);
                                        const vidUrl = vidarray[0].url;
                                        const video = document.createElement('video');
                                        // video.classList.add("controls");
                                        const source = document.createElement('source');
                                        source.setAttribute('src', vidUrl);
                                        source.setAttribute('type', 'video/mp4');
                                        document.getElementById("videos").appendChild(video);
                                        video.appendChild(source);
                                        video.controls = "true";
                                        video.style.width = "100%";
                                        video.preload = "none";
                                        //video.load();
                                    } else if (attachment.contentType == "audio/mpeg") {
                                        $("#audlabel").show();
                                        const audarray = [];
                                        audarray.push(attachment);
                                        const audUrl = audarray[0].url;
                                        const audio = document.createElement('audio');
                                        const source = document.createElement('source');
                                        source.setAttribute('src', audUrl);
                                        source.setAttribute('type', 'audio/mpeg');
                                        document.getElementById("sound").appendChild(audio);
                                        audio.appendChild(source);
                                        audio.controls = "true";
                                        audio.style.width = "100%";
                                        audio.load();
                                    }
                                });
                            });
                    });
                    /* $( "#socShare" ).click(function() {
                       console.log("clicked the share btn!");
                       if (navigator.share) {

                         navigator.share({
                           //title: title,
                           //text: desc,
                           url: shareURL,
                         })
                           .then(() => console.log('Successful share'))
                           .catch((error) => console.log('Error sharing', error));
                       }
                     }); */
                }

                function parseDateEntry(dateEntry) {
                    const response = {
                        valid: false,
                        invalidReason: null,
                        estimated: true,
                        beginDate: null,
                        endDate: null,
                        accuracyLevel: 0
                    }
                    const rangeSymbol = dateEntry.indexOf("-") !== -1 ? "-" : dateEntry.indexOf("-") !== -1 ? "-" : dateEntry.indexOf("-") !== -1 ? "-" : null;
                    if (rangeSymbol != null) {
                        const rangeParts = dateEntry.split(rangeSymbol);
                        if (rangeParts.length != 2) {
                            response.invalidReason = "'-' means a date range. Please use the format mm/dd/yyyy for dates."
                            return response;
                        }
                        let lhs = rangeParts[0].trim();
                        let rhs = rangeParts[1].trim();

                        const lhsSlashSplit = lhs.split("/");
                        const rhsSlashSplit = rhs.split("/");

                        if (lhsSlashSplit.length == 3 && rhsSlashSplit.length == 3) {
                            response.estimated = false;
                            response.accuracyLevel = 3;
                        } else if (lhsSlashSplit.length == 2 && rhsSlashSplit.length == 2) {
                            response.accuracyLevel = 2;
                        } else {
                            response.accuracyLevel = 1;
                        }

                        if (lhsSlashSplit.length == 2) {
                            lhs = lhsSlashSplit[0] + "/01/" + lhsSlashSplit[1];
                        }
                        if (rhsSlashSplit.length == 2) {
                            rhs = rhsSlashSplit[0] + "/01/" + rhsSlashSplit[1];
                        }

                        const beginDateNum = Date.parse(lhs);
                        const endDateNum = Date.parse(rhs);
                        if (isNaN(beginDateNum) || isNaN(endDateNum)) {
                            response.invalidReason = "Please enter the date in one of the three suggested formats.";
                            return response;
                        } else {
                            response.beginDate = new Date(beginDateNum);
                            response.endDate = new Date(endDateNum);
                        }
                        if (beginDateNum > Date.now() || endDateNum > Date.now()) {
                            response.invalidReason = "Looks like that date is in the future. Please enter a date in the past.";
                            return response;
                        }
                    } else {
                        const slashSplit = dateEntry.split("/");
                        if (slashSplit.length == 3) {
                            response.estimated = false;
                            response.accuracyLevel = 3;
                        } else if (slashSplit.length == 2) {
                            dateEntry = slashSplit[0] + "/01/" + slashSplit[1];
                            response.accuracyLevel = 2;
                        } else {
                            response.accuracyLevel = 1;
                        }
                        const dateNum = Date.parse(dateEntry);
                        if (dateNum > Date.now()) {
                            response.invalidReason = "Looks like that date is in the future. Please enter a date in the past.";
                            return response;
                        }
                        if (isNaN(dateNum)) {
                            response.invalidReason = "Please enter the date in one of the three suggested formats.";
                            return response;
                        } else {
                            response.beginDate = response.endDate = new Date(dateNum);
                        }
                    }
                    if (response.beginDate == null || response.endDate == null) {
                        response.invalidReason = "Please enter the date in one of the three suggested formats.";
                        return response;
                    }
                    response.valid = true;
                    return response;
                }

                let mapyear;
                // takes a user-entered date value and places it into a map year for a story submission
                function getMapYear(date) {
                    if (date >= 1850 && date <= 1894) {
                        mapyear = 1888;
                    } else if (date >= 1895 && date <= 1904) {
                        mapyear = 1900;
                    } else if (date >= 1905 && date <= 1913) {
                        mapyear = 1908;
                    } else if (date >= 1914 && date <= 1924) {
                        mapyear = 1917;
                    } else if (date >= 1925 && date <= 1938) {
                        mapyear = 1928;
                    } else if (date >= 1939 && date <= 1942) {
                        mapyear = 1942;
                    } else if (date >= 1946 && date <= 1955) {
                        mapyear = 1949;
                    } else if (date > 1955) {
                        mapyear = date;
                    }
                }

                // when the user clicks the story submit button
                $("#submitBtn").click(function() {
                    submitting.isOpen = true;
                    // get values from the story submission slides
                    const title = $('#userTitle').val();
                    const desc = $('#userDesc').val();
                    const name = $('#userName').val();
                    let date = $('#userDate').val();

                    const yearRGEX = /^\d{4}$/;
                    const rangeRGEX = /^\d{4}-\d{4}$/;
                    const dateRGEX = /^\d{2}\/\d{2}\/\d{4}$/;

                    const dateResult = dateRGEX.test(date);
                    const yearResult = yearRGEX.test(date);
                    const rangeResult = rangeRGEX.test(date);

                    if (dateResult == true) {
                        const dateSplit = date.split("/");
                        getMapYear(dateSplit[0]);
                    }

                    if (rangeResult == true) {
                        const dateSplit = date.split("-");
                        getMapYear(dateSplit[0]);
                    }

                    if (yearResult == true) {
                        getMapYear(date);
                    }

                    // on submit button add features to stories map service
                    const featureServiceLayerUrl = config.layers.storiesLayerUrl;
                    // create a new feature to add using the REST API
                    const featureToAdd = {
                        attributes: {
                            title: title,
                            description: desc,
                            name: name,
                            userdate: date,
                            map: currentMapUrl,
                        },
                        geometry: {
                            x: lon,
                            y: lat,
                            spatialReference: {
                                wkid: 4326
                            }
                        }
                    };

                    // begin by adding a new feature to the feature service layer      
                    arcgisRest
                        .addFeatures({
                            url: featureServiceLayerUrl,
                            features: [featureToAdd],
                            //authentication
                        })
                        .then(handleAdded);

                    function handleAdded(response) {
                        console.log(response);
                        if (response.addResults[0].success === true) {
                            const storyObjId = response.addResults[0].objectId;
                            console.log(files, files.length);
                            if (files.length > 0) {
                                files.forEach(function(file) {
                                    arcgisRest
                                        .addAttachment({
                                            url: featureServiceLayerUrl,
                                            featureId: storyObjId,
                                            attachment: file
                                        })
                                        .then(attachmentAdded);

                                    function attachmentAdded(newresponse) {
                                        console.log("added attachment" + newresponse);
                                        submitting.isOpen = false;
                                        // Delay the alert dismissal until the slide transition is fully complete
                                        setTimeout(() => {
                                            slides.update();
                                            slides.slideNext();
                                            storyLayer.refresh();
                                        }, 600); // 300ms delay, adjust as necessary
                                    }
                                });
                            } else {
                                submitting.isOpen = false;
                                setTimeout(() => {
                                    slides.update();
                                    slides.slideNext();
                                    storyLayer.refresh();
                                }, 600); // 300ms delay, adjust as necessary     
                            }
                        }

                        if (!response.addResults[0].success) {
                            // stop early if adding a new feature was not successful
                            return;
                        }
                    }
                });
                async function vidAlert() {
                    const vidAlert = document.createElement('ion-alert');
                    vidAlert.header = 'Video Length Exceeded';
                    //vidAlert.subHeader = 'Video limit exceeded';
                    vidAlert.message = 'Video recordings must be 15 seconds or less. Please try recording a shorter video.';
                    vidAlert.buttons = ['OK'];

                    document.body.appendChild(vidAlert);
                    await vidAlert.present();
                }

                // Setup the alerts
                const alert = document.createElement('ion-alert');
                async function presentAlert() {
                    alert.header = 'Record a Story';
                    alert.subHeader = 'Tap on the mic icon to begin recording.';
                    alert.message = '<div id="message"><center><ion-fab-button class="green" id="record" style="width: 120px; height: 120px; !important"><ion-icon name="mic-outline" id="micicon" style="width: 1,h200px; height: 100px"></ion-icon></ion-fab-button></center></div><br><div id="time"><center><h2>0.00</h2></center></div>';
                    document.body.appendChild(alert);
                    await alert.present();
                };

                const submitAlert = document.createElement('ion-alert');
                submitAlert.header = 'Submitting Story...';
                submitAlert.subHeader = 'This may take a few minutes.';
                submitAlert.message = '<center><ion-spinner class="blue"></ion-spinner></center>';
                submitAlert.backdropDismiss = false;

                document.body.appendChild(submitAlert);

                const slides = new Swiper('.swiper', {
                    direction: 'horizontal',
                    initialSlide: 0,
                    loop: false,
                    speed: 400,
                    allowTouchMove: false,
                    // If we need pagination
                    pagination: {
                        el: '.swiper-pagination',
                    },

                    // Navigation arrows
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },

                    // And if we need scrollbar
                    scrollbar: {
                        el: '.swiper-scrollbar',
                    },
                });

                // styling for the story points layer
                const storiesRenderer = {
                    "type": "simple",
                    "symbol": {
                        "type": "picture-marker",
                        "url": config.markers.storyMarkerUrl,
                        "width": config.markers.storyMarkerWidth,
                        "height": config.markers.storyMarkerHeight
                    }
                };

                // Layer for the map index 
                const indexLayer = new FeatureLayer({
                    url: config.layers.indexLayerUrl,
                    outFields: ["title", "mapyear", "service_url"], // Return all fields so it can be queried client-side
                    opacity: 0
                    //renderer: renderer
                });

                // Layer for the story points
                const storyLayer = new FeatureLayer({
                    url: config.layers.storiesLayerUrl,
                    outFields: ["title", "description", "name", "userdate", "objectid", "globalid", "map"], // Return all fields so it can be queried client-side        
                    renderer: storiesRenderer,
                    definitionExpression: "flag IS NULL",
                    visible: true
                });

                const graphicsLayer = new GraphicsLayer();

                const map = new Map({
                    basemap: config.map.basemap, // Basemap layer service
                    layers: [indexLayer, storyLayer, graphicsLayer]
                });

                const view = new MapView({
                    map: map,
                    center: config.map.extent, // Longitude, latitude
                    zoom: config.map.zoom, // Zoom level
                    container: "viewDiv", // Div element
                    highlightOptions: {
                        fillOpacity: 0
                    },
                });

                // Removes the zoom widget from the view
                view.ui.remove("zoom");

                // new gelocation widget
                let track = new Track({
                    view: view,
                    useHeadingEnabled: false,
                    goToLocationEnabled: false,
                    geolocationOptions: {
                        maximumAge: 0,
                        timeout: 15000,
                        enableHighAccuracy: true
                    }
                });

                let highlightSelect;
                // once the view becomes ready
              view.when(function() {
                const queryString = window.location.search;
                console.log(queryString);
                if (queryString != "") {
                    splashModal.isOpen = false;
                    const urlParams = new URLSearchParams(queryString);
                    const storyId = urlParams.get('id');
                    const mapid = urlParams.get('map');
                    console.log(storyId, mapid);

                    const storyQuery = {
                        where: "objectid ='" + storyId + "'", // Fixed formatting
                        outFields: ["*"],
                        returnGeometry: true,
                        outSpatialReference: 4326
                    };

                    // Remove existing tile layers
                    map.allLayers.forEach(function(layer) {
                        if (layer.type === "tile" || layer.type === "web-tile") {
                            map.remove(layer);
                        }
                    });

                    let storyMapLayer; 
                    if (mapid != "Present" || mapid != null) {  // Fixed condition
                        if (mapid.includes("{z}") && mapid.includes("{x}") && mapid.includes("{y}")) {
                            // Use WebTileLayer for XYZ tiles
                            storyMapLayer = new WebTileLayer({
                                urlTemplate: mapid
                            });
                        } else {
                            // Use TileLayer for Esri services
                            storyMapLayer = new TileLayer({
                                url: mapid
                            });
                        }
                    }       

                    if (storyMapLayer) {
                        map.add(storyMapLayer);
                        map.reorder(storyMapLayer, 1);
                    }

                    // Get the value of the range slider  
                    let rangeVal = document.querySelector("ion-range")?.value || 0;
                    if (storyMapLayer) {
                        storyMapLayer.opacity = rangeVal / 100;
                    }

                    // Adjust transparency of the map based on the slider's value  
                    range.addEventListener('ionInput', ({ detail }) => {
                        if (storyMapLayer) {
                            storyMapLayer.opacity = detail.value / 100;
                        }
                    });

                    // Query the story layer
                    storyLayer.queryFeatures(storyQuery)
                        .then((results) => {
                            console.log(results);
                            view.goTo({
                                center: [results.features[0].geometry.x, results.features[0].geometry.y],
                                zoom: 19,
                                speedFactor: 0.00000000001,
                                easing: "out-quint"
                            });

                            // Set a small delay until the story shows up
                            setTimeout(() => {
                                console.log("Delayed for 2 seconds.");
                                buildStory(results.features[0]);
                            }, 2000); // Fixed timeout

                            view.whenLayerView(storyLayer).then((layerView) => {
                                const feature = results.features[0];
                                highlightSelect = layerView.highlight(feature.attributes.objectid);
                            });
                        })
                        .catch((error) => {
                            console.error(error); // Fixed error logging
                        });
                }
            });


                $("#geolocation").click(function() {
                    // track.start();
                    if (track.tracking == false) {
                        track.start();
                        geolocation.style.setProperty('color', config.gpsButton.iconColorActive);
                        track.once("track", ({
                            position
                        }) => {
                            currentCoords = position.coords;
                            const point = new Point({
                                latitude: currentCoords.latitude,
                                longitude: currentCoords.longitude
                            });
                            view.goTo({
                                target: point,
                                scale: 5000,
                                speedFactor: 0.1
                            });
                            console.log(currentCoords);
                        });
                    } else {
                        track.stop();
                        geolocation.style.setProperty('color', config.gpsButton.iconColorInactive);
                    }
                });

                // declare lat and long on global scales
                let lat;
                let lon;

                function setGeolocation() {
                    const geolocation = window.navigator.geolocation.watchPosition(function(position) {

                            window.setTimeout(function() {
                                lat = position.coords.latitude;
                                lon = position.coords.longitude;
                            }, 5000);

                        },
                        function() {
                            //error
                            console.log("No GPS Support");
                        }, {
                            maximumAge: 0,
                            enableHighAccuracy: true
                        }
                    );

                    window.setTimeout(function() {
                        window.navigator.geolocation.clearWatch(geolocation)
                    }, 5000);
                };

                $("#locOpt").click(function() {
                    if (track.tracking == false) {
                        setGeolocation();
                        slides.update();
                        slides.slideTo(1);

                    } else {
                        lat = currentCoords.latitude;
                        lon = currentCoords.longitude;
                        slides.update();
                        slides.slideTo(1);
                    }
                });

                $("#mapOpt").click(function() {
                    tabs.select('home');
                    presentToast();
                    view.on("hold", function(evt) {
                        lat = evt.mapPoint.latitude
                        lon = evt.mapPoint.longitude
                        tabs.select('stories');
                        return setTimeout(() => {
                            slides.update();
                            slides.slideTo(1);
                        }, 50);

                        console.log('map hold' + lon, lat);
                    });
                });

                const listNode = document.getElementById("mapcontent");

                let graphics;
                let currentMapUrl = 'present'; // track the url of the currently selected overlay map 
                view.whenLayerView(indexLayer).then(function(layerView) {
                    layerView.watch("updating", function(value) {
                        listNode.innerHTML = "";
                        if (!value) {
                            // wait for the layer view to finish updating.
                            // get all the features available for drawing.
                            layerView
                                .queryFeatures({
                                    geometry: view.extent,
                                    returnGeometry: true
                                })
                                .then(function(results) {
                                    // do something with the resulting graphics
                                    graphics = results.features;

                                    // Sort the features first by title, then by year  
                                    graphics.sort(function(a, b) {
                                        return a.attributes.mapyear.localeCompare(b.attributes.mapyear) || a.attributes.title - b.attributes.title;
                                    });

                                    document.getElementById("mapcount").innerHTML = results.features.length;
                                    let item;
                                    const fragment = document.createDocumentFragment();
                                    graphics.forEach(function(result, index) {
                                        const attributes = result.attributes;
                                        const title = attributes.title;
                                        const year = attributes.mapyear;
                                        item = document.createElement("ion-item");
                                        const label = document.createElement("ion-label");
                                        const icon = document.createElement("ion-icon");
                                        item.href = "#";
                                        icon.name = "map-outline";
                                        item.detail = "false";
                                        icon.slot = "end";
                                        icon.color = config.textColor; // color set from config.json
                                        label.innerHTML = year + " " + title;
                                        item.appendChild(icon);
                                        item.appendChild(label);
                                        item.addEventListener("click", () => resultClickHandler(result, index));
                                        fragment.appendChild(item);
                                        listNode.appendChild(fragment);
                                    });


                                    function resultClickHandler(result, index) {
                                        currentMapUrl = 'present';

                                        tabs.select('home');
                                        const popup = graphics && graphics[parseInt(index, 10)];

                                        // Remove existing tile layers
                                        map.allLayers.forEach(function(layer) {
                                            if (layer.type === "tile" || layer.type === "web-tile") {
                                                map.remove(layer);
                                            }
                                        });

                                        currentMapUrl = result.attributes.service_url;

                                        let current_layer;

                                        if (currentMapUrl.includes("{z}") && currentMapUrl.includes("{x}") && currentMapUrl.includes("{y}")) {
                                            // Use WebTileLayer for XYZ tiles
                                            current_layer = new WebTileLayer({
                                                urlTemplate: currentMapUrl
                                            });
                                        } else {
                                            // Use TileLayer for Esri services
                                            current_layer = new TileLayer({
                                                url: currentMapUrl
                                            });
                                        }

                                        map.add(current_layer);

                                        // push the current layer to the back
                                        map.reorder(current_layer, 1);

                                        // get the value of the range slider  
                                        let rangeVal = $("ion-range").val();

                                        current_layer.opacity = rangeVal / 100;
                                        
                                        // const lastEmittedValue = document.querySelector('#lastValue');
                                        // adjust the transparency of the map based on the sliders value  
                                        range.addEventListener('ionInput', ({
                                            detail
                                        }) => {
                                            current_layer.opacity = detail.value / 100;
                                        });
                                    };
                                });
                        }
                    });
                });

                let shareURL;
                let originURL = window.location.href;
                console.log(originURL);
                // generates a share URL to be shared with the Web Share API
                function shareStory(graphic) {
                    // query the stories layer for the objectid        
                    arcgisRest
                        .queryFeatures({
                            url: config.layers.storiesLayerUrl,
                            where: "objectid = " + "'" + graphic.attributes.objectid + "'",
                            resultRecordCount: 1
                        })
                        .then((response) => {
                            const baseURL = window.location.href;
                            const locCode = response.features[0].attributes.loccode;
                            const rawShareURL = baseURL + "?id=" + graphic.attributes.objectid + "&title=" + graphic.attributes.title + "&map=" + graphic.attributes.map;

                            shareURL = rawShareURL.replace(/\s/g, '%20');
                            shareURL = shareURL.replace(/\|/g, "%7C");
                            shareURL = shareURL.replace(/\{/g, "%7B");
                            shareURL = shareURL.replace(/\}/g, "%7D");

                            console.log(shareURL);
                            // changes the browsers url to one corresponding when the current story being viewed
                            const nextURL = shareURL;
                            const nextTitle = graphic.attributes.title;
                            const nextState = {
                                additionalInformation: 'Updated the URL with JS'
                            };

                            // This will create a new entry in the browser's history, without reloading
                            window.history.pushState(nextState, nextTitle, nextURL);

                            // This will replace the current entry in the browser's history, without reloading
                            window.history.replaceState(nextState, nextTitle, nextURL);
                        });
                }

                view.on("click", (event) => {
                    // only include graphics from the layer in the hitTest
                    const opts = {
                        include: [storyLayer]
                    }
                    // check for a click on the story layer
                    view.hitTest(event, opts).then((response) => {
                        // check if a feature is returned from the index layer
                        if (response.results.length) {
                            console.log(response.results[0].graphic);
                            // if a feature is already highlighted, then remove the highlight
                            if (highlightSelect) {
                                highlightSelect.remove();
                            }

                            // Build the story from the results of the graphic             
                            buildStory(response.results[0].graphic);
                            shareStory(response.results[0].graphic);
                        }
                    });
                });

                storyModal.addEventListener('didDismiss', (ev) => {
                    storyModal.isOpen = false;
                    // if the storyModal is closed, return the window URL to normal
                    // This will create a new entry in the browser's history, without reloading
                    window.history.pushState("", "", originURL);
                    // This will replace the current entry in the browser's history, without reloading
                    window.history.replaceState("", "", originURL);
                });

                $("#modalClose").click(function() {
                    storyModal.isOpen = false;
                });

                splashModal.addEventListener('didDismiss', (ev) => {
                    splashModal.isOpen = false;
                });

                $("#splashModalClose").click(function() {
                    splashModal.isOpen = false;
                });
            });
    }); // end json config
