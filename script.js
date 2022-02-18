let palette = [];
let colorsChosen = false;
let imageCounter = 0;

document.getElementById("colorSubmit").addEventListener("click", function(event) {
    event.preventDefault();
    // const value = document.getElementById("paramsInput").value;
    // if (value === "")
    //     return;
    //console.log(value);

    //get a random color scheme
    var url = "http://colormind.io/api/";
    var data = {
        model : "default"
    };

    var http = new XMLHttpRequest();

    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            var colorPalette = JSON.parse(http.responseText).result;
            console.log(colorPalette);
            palette = colorPalette;
            colorsChosen = true;
            applyPallete();
        }
    }

    http.open("POST", url, true);
    http.send(JSON.stringify(data));
});

function applyPallete()
{
    //set background color
    let backgroundCol = palette[0];
    setElementStyle(backgroundCol, function() { return document.getElementById("pageContent"); });

    //set content container color
    for(let i = 0; i < document.getElementsByClassName("content-container").length; i++) {
        setElementStyle(palette[1], function() { return document.getElementsByClassName("content-container")[i]; });
    }

    //set background color
    setElementStyle(palette[2], function() { return document.getElementById("pageHeader"); });

    //set content container color
    for(let i = 0; i < document.getElementsByTagName("h3").length; i++) {
        setElementStyle(palette[3], function() { return document.getElementsByTagName("h3")[i]; });
    }

    //set footer color
    setElementStyle(palette[4], function() { return document.getElementById("pageFooter"); }, "position: sticky; width: 55%; margin-left: auto; margin-right: auto; border-radius: 8px;");
    setElementStyle(palette[4], function() { return document.getElementById("githubRepo"); });

    //show color palette
    let colorResultsHtml = `
    <p>Page color scheme generated using the following colors, pulled from <a href="http://colormind.io/" class="apiSiteLink">Colormind</a>:</p>
    <div style="background-color: white; padding: 8px; border-radius: 100px; display: flex; justify-content: center">
    `;
    for(let i = 0; i < palette.length; i++) {
        colorResultsHtml += `<div style="background-color: rgb(` + palette[i] + `); width: 20px; height: 20px;"></div>`;
    }
    colorResultsHtml += "</div>";
    document.getElementById("colorResults").innerHTML = colorResultsHtml;

    //fix api site link color to match the paragraph's colors
    for(let i = 0; i < document.getElementsByClassName("apiSiteLink").length; i++) {
        setElementStyle(palette[1], function() { return document.getElementsByClassName("apiSiteLink")[i]; });
    }

    //style the input buttons
    for(let i = 0; i < document.querySelectorAll("input[type=submit]").length; i++) {
        setElementStyle(palette[2], function() { return document.querySelectorAll("input")[i]; });
    }

    //style the footer
    // document.getElementById("pageFooter").style = ;
}

function setElementStyle(targetCol, selectElement, additionalStyling = "") {
    let textColor = (targetCol.reduce((a, b) => a + b) / 3 > 128) ? "black" : "white";
    let styleText = "background-color: rgb(" + targetCol + "); color: " + textColor + ";" + additionalStyling;

    selectElement().style = styleText;
}



document.getElementById("contentSubmit").addEventListener("click", function(event) {
    event.preventDefault();

    let url2 = "https://baconipsum.com/api/?type=meat-and-filler";
    fetch(url2)
    .then(function(response) {
        return response.json();
    }).then(function(json) {
        let targetElement = document.getElementById("addedContent");
        targetElement.classList.add("content-container");
        
        var url = "https://picsum.photos/400/200?random=" + imageCounter;
        imageCounter++;
        let targetHtml = '<img src="' + url + '" style="margin-left: auto; margin-right: auto; border-radius: 4px; display: block; width: 80%;">';
        
        console.log(json);
        for(let i = 0; i < json.length; i++) {
            targetHtml += "<p>" + json[i] + "</p>";
        }

        targetHtml += '<p>Random image pulled from <a href="https://picsum.photos/" class="apiSiteLink">Picsum</a>.</p>';
        targetHtml += '<p>Random text pulled from <a href="https://baconipsum.com/json-api/" class="apiSiteLink">Bacon ipsum</a>.</p>';
        
        targetElement.innerHTML = targetHtml;

        document.getElementById("pageFooter").style = "position: sticky; width: 55%; margin-left: auto; margin-right: auto; border-radius: 8px;";

        if(colorsChosen) {
            applyPallete();
        }
    });
});