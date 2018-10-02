﻿var xhr;
xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            //document.getElementById("lista").innerHTML = xhr.responseText;     //Tämä tulostaa kaiken junadatan sivuille ja consoliin
            //Tästä eteenpäin oleva koodi laittaa response textin JSON.parseksi ja hakee sitten taulukon alkioilla tietoa html listaan-Arttu
            console.log(xhr.responseText);
            var taulukko = JSON.parse(xhr.responseText);
            for (var i = 0; i < taulukko.length; i++) {
                //Tässä luodaan var optiot, jotta kellonaika saadaan näkymään järkevämmässä muodossa haun jälkeen-Arttu
                var optiot = { hour: '2-digit', minute: '2-digit', hour12: false };
                var juna = taulukko[i]
                console.log(taulukko);
                var aika = new Date(juna.timeTableRows[0].scheduledTime).toLocaleTimeString("fi-fi", optiot);
                // uutta aikaa käytetään kun lähtöaikaa tulostetaan-Arttu
                document.getElementById("lista").innerHTML += "<li>" + taulukko[i].trainNumber + " " + taulukko[i].trainType + " lähtee klo. " + new Date(juna.timeTableRows[0].scheduledTime).toLocaleTimeString("fi-fi", optiot);
            }
        }
    }
}
function Hae() {
    xhr.open("GET", "https://rata.digitraffic.fi/api/v1/live-trains/station/HKI/TPE", true);
    xhr.send(null);
    console.log("Hae()");
}