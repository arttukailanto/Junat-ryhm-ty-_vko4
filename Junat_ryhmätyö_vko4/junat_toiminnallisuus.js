
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
var baseurl = "https://rata.digitraffic.fi/api/v1";
var loppuurl = "/live-trains/station/";
var lahtoasema = " ";
var saapumisasema = " ";
var optiot = { hour: '2-digit', minute: '2-digit', hour12: false };

$("input[name=lahtoAsemat]").focusout(function () {
   // alert($(this).val());
    lahtoasema = ($(this).val());
});

$("input[name=saapumisAsemat]").focusout(function () {
    // alert($(this).val());
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
            alert("Pyyntö epäonnistui");
            document.getElementById("hae").innerText = "Hae data uudestaan painamalla nappulaa:";
            document.getElementById("btn").style.visibility = "visible";
        }
    }

};
var lista = document.getElementById("lista");
function haedatat() {
    $("#lista").empty();
    xmlhttp.open('get', baseurl + loppuurl + lahtoasema +"/"+ saapumisasema);
    xmlhttp.send();
}
//haedatat();
function haedataAika() {
    $("#lista").empty();
    var alkuaika = new Date($("#alkuaika").val());
    console.dir(alkuaika);
    console.log(alkuaika.toISOString());
    var loppuaika = new Date($("#loppuaika").val());
    console.dir(loppuaika);
    var startfilter = "startDate=" + alkuaika.toISOString();
    var endfilter = "endDate=" + loppuaika.toISOString();
    var url = baseurl + loppuurl + lahtoasema + saapumisasema + "?" + startfilter + "&" + endfilter;
    console.log(url);
    xmlhttp.open('get', url);
    xmlhttp.send(null);
}

function getSaapumisaika(timetablerows, asema) {

    var sr = timetablerows.find(tr => tr.stationShortCode === asema);
    return sr.scheduledTime;
}



// Tietojen tallennus lomakkeelle
function store() {
    var name = document.getElementById('name');
    var pw = document.getElementById('pw');

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
        alert('ERROR');
    } else {
        alert('You are logged in.');
    }
}


function valinta_lähtö() {
    var Valinta_lähtö = document.getElementById("lähtövalinta").value;
    localStorage.setItem("valinta", Valinta_lähtö);

}

/* Funktio käyttäjänAsetus, joka suoritetaan heti määrittelyn jälkeen. Tämän avulla palautetaan käyttäjän edellinen valinta oletuksena.
*  Määritellään muuttuja edellinenValinta, joka saa arvon localstoragesta
*  "lähtövalinta"-elementin arvoksi asetetaan edellinenValinta-muuttujan arvo. */

function käyttäjänAsetus_lähtö() {

    var edellinenValinta = localStorage.getItem("valinta");

    document.getElementById("lähtövalinta").value = edellinenValinta;

}
käyttäjänAsetus_lähtö();





/*Määränpääaseman tallennus: */

function valinta_määränpää() {
    var Valinta_määränpää = document.getElementById("kohdevalinta").value;
    localStorage.setItem("valinta2", Valinta_määränpää);

}

function käyttäjänAsetus_kohde() {

    var edellinenValinta = localStorage.getItem("valinta2");

    document.getElementById("kohdevalinta").value = edellinenValinta;

}
käyttäjänAsetus_kohde();

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
                document.getElementById("asemien_nimet").innerHTML += "<option value='" + taul_asemat[i].stationShortCode + "'>" + taul_asemat[i].stationName + "</option>";
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