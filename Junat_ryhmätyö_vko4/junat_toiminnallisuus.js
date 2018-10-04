
var nyt = new Date();
Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}
nyt.addHours(3);
$("#alkuaika").val(nyt.toISOString().slice(0, -8));
console.log(nyt.toISOString().slice(0, -5));
nyt.addHours(3);
$("#loppuaika").val(nyt.toISOString().slice(0, -8));

var alkuRimpsu = "https://rata.digitraffic.fi/api/v1/live-trains/station/";
var lahtoasema = " ";
var saapumisasema = " ";
var optiot = { hour: '2-digit', minute: '2-digit', hour12: false };





$("input[name=lahtoAsemat]").focusout(function () {
   
    lahtoasema = ($(this).val());
});

$("input[name=saapumisAsemat]").focusout(function () {
    
    saapumisasema = ($(this).val());
});




var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === 4) {
        if (xmlhttp.status === 200) {

            var tulos = JSON.parse(xmlhttp.responseText);
            console.dir(tulos);
            for (var i = 0; i < tulos.length; ++i) {
                var elem = document.createElement("li");
                var juna = tulos[i];
                var lahtoaika = new Date(juna.timeTableRows[0].scheduledTime).toLocaleTimeString("fi", { hour: '2-digit', minute: '2-digit', hour12: false });
                var saapumisaika = new Date(getSaapumisaika(juna.timeTableRows, saapumisasema)).toLocaleTimeString("fi", optiot);
                elem.appendChild(document.createTextNode(juna.trainType + juna.trainNumber + ", lähtee: " + lahtoaika + " saapuu: " + saapumisaika));
                lista.appendChild(elem);
            }
            //document.getElementById("hae").innerText = "Hae data uudestaan painamalla nappulaa:";
           // document.getElementById("btn").style.visibility = "visible";
        } else {
            alert("Asemien välillä ei välttämättä ole suoria yhteyksiä.");
            document.getElementById("hae").innerText = "Hae data uudestaan painamalla nappulaa:";
            document.getElementById("btn").style.visibility = "visible";
        }
    }

};
var lista = document.getElementById("lista");
function haedatat() {
    $("#lista").empty();
    xmlhttp.open('get', alkuRimpsu + lahtoasema +"/"+ saapumisasema);
    xmlhttp.send();
}


function getSaapumisaika(timetablerows, asema) {

    var sr = timetablerows.find(tr => tr.stationShortCode === asema);
    return sr.scheduledTime;
}



// Tietojen tallennus lomakkeelle
function store() {
    var name = document.getElementById('name');
    var pw = document.getElementById('pw');

    //Tässä laitetaan nämä tiedot arrayhin
    localStorage.setItem('name', name.value);
    localStorage.setItem('pw', pw.value);
}
    // tarkistaa että tallennettu tieto vastaa syötettyä tietoa
function check() {

    // Rekisteröitymislomakkeen tallennettu tieto
    var storedName = localStorage.getItem('name');
    var storedPw = localStorage.getItem('pw');

    // Kirjautumislomakkeen syötetty tieto
    var userName = document.getElementById('userName');
    var userPw = document.getElementById('userPw');

    // tarkista että rekisteröintilomakkeen tallennettu tieto vastaa kirjautumistietoja
    if (userName.value !== storedName || userPw.value !== storedPw) {
        alert('Sinä epäonnistuit');
    } else {
        alert(storedName+', sinä onnistuit!');
    }
}


//function valinta_lähtö() {
  //  var Valinta_lähtö = document.getElementById("lähtövalinta").value;
   // localStorage.setItem("valinta", Valinta_lähtö);

//}

///* Funktio käyttäjänAsetus, joka suoritetaan heti määrittelyn jälkeen. Tämän avulla palautetaan käyttäjän edellinen valinta oletuksena.
//*  Määritellään muuttuja edellinenValinta, joka saa arvon localstoragesta
//*  "lähtövalinta"-elementin arvoksi asetetaan edellinenValinta-muuttujan arvo. */

//function käyttäjänAsetus_lähtö() {

//    var edellinenValinta = localStorage.getItem("valinta");

//    document.getElementById("lähtövalinta").value = edellinenValinta;

//}
//käyttäjänAsetus_lähtö();





/*Määränpääaseman tallennus: */

// valinta_määränpää() {
  //  var Valinta_määränpää = document.getElementById("kohdevalinta").value;
//    localStorage.setItem("valinta2", Valinta_määränpää);

//}

//function käyttäjänAsetus_kohde() {

//    var edellinenValinta = localStorage.getItem("valinta2");

//    document.getElementById("kohdevalinta").value = edellinenValinta;

//}
//käyttäjänAsetus_kohde();

var xhr;
xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
    console.dir(xhr);
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            //document.getElementById("lista").innerHTML = xhr.responseText;     //Tämä tulostaa kaiken junadatan sivuille ja consoliin
            //Tässä luodaan JSON.parse lista asemien nimistä ja lyhenteistä-Arttu
            console.log(xhr.responseText);
            var taul_asemat = JSON.parse(xhr.responseText);
            for (var i = 0; i < taul_asemat.length; i++) {
                // var asemat = taul_asemat[i]
                //Tämä laittaa asemien nimet ja shortnimet optionvalueihin


                console.dir(taul_asemat[i]);
                if (taul_asemat[i].passengerTraffic === true) {
                    document.getElementById("asemien_nimet").innerHTML += "<option value='" + taul_asemat[i].stationShortCode + "'>" + taul_asemat[i].stationName + "</option>";
                }
                
            }
        }
    }
}



function Hae() {
    console.log("Hae()");
    xhr.open("GET", "https://rata.digitraffic.fi/api/v1/metadata/stations", true);
    xhr.send(null);

}
Hae();

var long;
var lati;
function GeoHaku() {
    navigator.geolocation.getCurrentPosition(
        function (loc) {
            long = loc.coords.longitude;
            lati = loc.coords.latitude;
            //document.getElementById("lista").innerHTML = ('leveyspiiri: ' + loc.coords.latitude + " " + 'pituuspiiri: ' + loc.coords.longitude);
            //nearestStation(lati, long);
        },
        function (errordata) {
            console.log('virhe:' + errordata.message);
        },
        { enableHighAccuracy: true }
    );
}
function Etäisyys() {
    var AsemanLokaatio;
    var asemanlong;
    var asemanlat;
    AsemanLokaatio = new XMLHttpRequest();
    AsemanLokaatio.onreadystatechange = function () {
        console.dir(AsemanLokaatio);
        if (AsemanLokaatio.readyState === 4) {
            if (AsemanLokaatio.status === 200) {
                //console.log(AsemanLokaatio.responseText);
                var taul_asemat = JSON.parse(AsemanLokaatio.responseText);
                getNearestStation(taul_asemat);
                for (var i = 0; i < taul_asemat.length; i++) {
                    if (taul_asemat[i].passengerTraffic === true) {
                        asemanlong = taul_asemat[i].longitude;
                        asemanlat = taul_asemat[i].latitude;
                    }
                    //console.dir(taul_asemat[i]);
                   
                    //document.getElementById("lista").innerHTML += "<li>" + taul_asemat[i].stationShortCode + "  " + taul_asemat[i].longitude + "  " + taul_asemat[i].latitude;
                }
            }
        }
    }
    //console.log("GeoHaku()");
    AsemanLokaatio.open("GET", "https://rata.digitraffic.fi/api/v1/metadata/stations", true);
    AsemanLokaatio.send(null);
    function getNearestStation(taul_asemat) {
        var lyhinEtaisyys = 99999;
        var lahinAsema;
        for (var asema of taul_asemat) {
            //console.log(distance(asema.latitude, asema.longitude));
        }
        for (var i = 0; i < taul_asemat.length; i++) {
            var asema = taul_asemat[i];
            //  console.dir(asema);
            var dist = distance(asema.latitude, asema.longitude)
            if (dist < lyhinEtaisyys) {
                lyhinEtaisyys = dist;
                lahinAsema = asema.stationShortCode;
            }
        }
        console.log(lahinAsema + "," + lyhinEtaisyys);
        lahtoasema = lahinAsema;
        document.getElementById("lähtövalinta").value=lahinAsema;

    }
    // function nearestStation(lati, long) {
    //     var lyhinEtaisyys = 99999;
    //     for (var asema in taul_asemat) {
    //         var asema = taul_asemat[asema]
    //         console.log(asema.name)
    //         if (asema.dist < lyhinEtaisyys) {
    //             lyhinEtaisyys = asema.dist;
    //             console.log(lyhinEtaisyys);
    //         }
    //}
    function distance(lat2, lon2, unit) {
        //lati;
        //long;
        //var lat2 = asemanlat;
        //var lon2 = asemanlong;
        unit = 'K';
        var radlati = Math.PI * lati / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = long - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlati) * Math.sin(radlat2) + Math.cos(radlati) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit === "K") { dist = dist * 1.609344 };
        if (unit === "N") { dist = dist * 0.8684 };
        // console.dir(dist);
        return dist;
    }
}