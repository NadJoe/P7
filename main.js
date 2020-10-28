let map, infoWindow, geocoder;
let resto = new Array();
let restaurants = new Array();
let resultat;
let userChoice;
let getResultat;

function initMap() {
  let pos = {};

  map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: 48.85337496845287,
      lng: 2.4389928241215797,
    },
    zoom: 13,
  });

  // Try HTML5 geolocation.

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        pos = {
          //lat: position.coords.latitude,
          //lng: position.coords.longitude,
          lat: 48.85,
          lng: 2.5667,
        };

        // Information que contiendra l'infobulle sur le marker
          let infos = new google.maps.InfoWindow({
          content: "<h2>Position Actuelle</h2>",
        });

        let marker = new google.maps.Marker({
          position: pos,
          map: map,
          icon:
            "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
        });
        // Quand l'utilisateur clique sur le marker, l'info apparait.
        marker.addListener("click", function () {
          infos.open(map, marker);
        });

        map.setCenter(pos);

        // Lorsque nous changeons la vue de la map et donc le centre, je recherche les restaurant autour du centre
        google.maps.event.addListener(map, "idle", function () {
          // Nettoyer la map pour permettre l'affichage des markers
          restaurants.forEach((elt) => {
            elt.marker.setMap(null);
          });
          // Reset l'affichage des restaurants dans la liste de gauche
          document.querySelector(".moment").innerHTML = "";
          // Récupérer lat & lng du centre de la map pour pouvoir recupérer les restaurants de la zone
          let newLat = map.getCenter().lat();
          let newLng = map.getCenter().lng();
          getFetch(newLat, newLng);
        });
      },
      function () {
        handleLocationError(true, infoWindow, map.getCenter());
        alert("ERROR");
      },
      { timeout: 10000 }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  // Appel à la fonction d'ajout restaurant au clic sur la map
  ajoutRestoAuClic();
}

let cleApi = "AIzaSyC06sSZBdXw9TReabbXsFZ5e6ItlYbCZSA";
function getFetch(lat, long) {
  let restaurantLocation = "location=" + lat + "," + long;

  const url =
    "https://maps.googleapis.com/maps/api/place/nearbysearch/json?" +
    restaurantLocation +
    "&radius=1500&type=restaurant&key=" +
    cleApi +
    "";
  fetch(url, { mode: "cors" })
    .then((response) => response.json())
    .then((result) => {

    // récupération de la reponse avec une variable connu de tous pour pouvoir l'exploiter
      getResultat = result;

//  Initialisation par défault du résultat du filtre pour afficher tous les restaurants au chargement de la page
      resultat = getResultat.results.filter(
        (nouvel) => nouvel.rating >= 1 && nouvel.rating < 5
      );
      setChange(resultat);

    });
}

// Appel à la fonction de gestion de filtre 
setGestionFiltre();


function setGestionFiltre(){

  let FilterChoice = document.getElementById("inputGroupSelect01");
  document.querySelector(".moment").innerHTML = "";

  //////////////////////////////////// GESTION D'OUTIL DE FILTRAGE///////////////////////////////////
  FilterChoice.addEventListener("change", (e) => {
    // Récupération de la valeur de la liste à tester
       userChoice = Number(e.target.value);

    // Récupérer le choix de l'utilisateur et afficher les restaurants concernés
      switch (userChoice) {
        case 0:
          restaurants.forEach((elt) => {
            elt.marker.setMap(null);
          });
          document.querySelector(".moment").innerHTML = "";
  
          resultat = getResultat.results.filter(
            (nouvel) => nouvel.rating >= userChoice && nouvel.rating <= userChoice+5
          );
          setChange(resultat);
          break;
        case 1:
          // Reset de la map
          restaurants.forEach((elt) => {
            elt.marker.setMap(null);
          });
          document.querySelector(".moment").innerHTML = "";

          resultat = getResultat.results.filter(
            (nouvel) => nouvel.rating >= 0 && nouvel.rating <= userChoice
          );
          setChange(resultat);
          break;
        case 2:
          // Reset de la map
        restaurants.forEach((elt) => {
          elt.marker.setMap(null);
        });
        document.querySelector(".moment").innerHTML = "";

        resultat = getResultat.results.filter(
          (nouvel) => nouvel.rating >= 1 && nouvel.rating <= userChoice
        );
        setChange(resultat);
          break;
        case 3:
          // Reset de la map
        restaurants.forEach((elt) => {
          elt.marker.setMap(null);
        });
        document.querySelector(".moment").innerHTML = "";

        resultat = getResultat.results.filter(
          (nouvel) => nouvel.rating >= 2 && nouvel.rating <= userChoice
        );
        setChange(resultat);
          break;
        case 4:
          // Reset de la map
          restaurants.forEach((elt) => {
            elt.marker.setMap(null);
          });
          document.querySelector(".moment").innerHTML = "";

          resultat = getResultat.results.filter(
            (nouvel) => nouvel.rating >= 3 && nouvel.rating <= userChoice
          );
          setChange(resultat);
          break;
        case 5:
          // Reset de la map
        restaurants.forEach((elt) => {
          elt.marker.setMap(null);
        });
        document.querySelector(".moment").innerHTML = "";

        resultat = getResultat.results.filter(
          (nouvel) => nouvel.rating >= 4 && nouvel.rating <= userChoice
        );
        setChange(resultat);
          break;
      
        default:
          break;
      }
    
    });

}

function setChange(myResult) {
  myResult.forEach((restaurant) => {
    let restoLocation = "location=" + resto.lat + "," + resto.long;
    let image =
    "https://maps.googleapis.com/maps/api/streetview?" +
    restoLocation +
    "&size=300x300&key=AIzaSyC06sSZBdXw9TReabbXsFZ5e6ItlYbCZSA";
    const nouvelUrl =
      "https://maps.googleapis.com/maps/api/place/details/json?place_id=" +
      restaurant.place_id +
      "&fields=name,rating,formatted_phone_number,reviews&key=AIzaSyC06sSZBdXw9TReabbXsFZ5e6ItlYbCZSA";

    fetch(nouvelUrl)
      .then((response) => response.json())
      .then(function (response) {
        //let monTest = response.result.reviews;
        let myFirstComText = response.result.reviews[0].text;
        let myFirstComName = response.result.reviews[0].author_name;
        myFirstCom = { com: myFirstComText, auteur: myFirstComName };

        let mySecondeComText = response.result.reviews[1].text;
        let mySecondeComName = response.result.reviews[1].author_name;
        mySecondCom = { com: mySecondeComText, auteur: mySecondeComName };

        let myThirdComText = response.result.reviews[2].text;
        let myThirdComName = response.result.reviews[2].author_name;
        monThirdCom = { com: myThirdComText, auteur: myThirdComName };
        
        resto.push(monResto);
        let restoObject = new Restaurant(restaurant.place_id, monResto);
        restoObject.streetImage = image;
        restoObject.setMarker(map);
        restoObject.displayContent(myFirstCom, mySecondCom, monThirdCom);
        restaurants.push(restoObject);
        let ecritureComment = document.getElementsByClassName(
          "writeComment"
        );
        restoObject.writeComment(ecritureComment);

        // Appel de la fonction qui permet l'effet collapse sur les trois éléments voulu
        Collapse("list-group-item");
        Collapse("comStyle");
        Collapse("writeComment");
      });

    const monResto = {
      id: restaurant.place_id,
      restaurantName: restaurant.name,
      address: restaurant.vicinity,
      lat: restaurant.geometry.location.lat,
      long: restaurant.geometry.location.lng,
      averageNote: restaurant.rating,
    };
  });
}

function ajoutRestoAuClic(){
  // ajouter un marker à n'importe quel endroit lors d'un clic sur la carte
  map.addListener("click", function (e) {
    let geocoder = new google.maps.Geocoder();
    let newResto = {};
    $("#blocFormNewRestaurant").modal("show");
    let clickPosition = e.latLng;

    geocoder.geocode({ location: clickPosition }, function (results, status) {
      if (status == "OK") {
        newResto.address = results[0].formatted_address; // recuperation de l'addresse du clic sur la map
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });

    $("#formNewRestaurant").submit(function (e) {
      $("#blocFormNewRestaurant").modal("hide"); // fermer le formulaire dès qu'il est envoyé
      e.preventDefault();

      let latNewResto = clickPosition.lat();
      let longNewResto = clickPosition.lng();
      let newRestaurantName = document.getElementById("nom").value;

      console.log(newRestaurantName);
      newResto.id = 0;
      newResto.restaurantName = newRestaurantName;
      newResto.lat = latNewResto;
      newResto.long = longNewResto;
      newResto.averageNote = document.getElementById("note").value;

      let monNouveauResto = new Restaurant(newResto.id, newResto);

      let imageNewResto = "location=" + newResto.lat + "," + newResto.long;
      let imageDuResto =
        "https://maps.googleapis.com/maps/api/streetview?" +
        imageNewResto +
        "&size=300x300&key=AIzaSyC06sSZBdXw9TReabbXsFZ5e6ItlYbCZSA";

      monNouveauResto.streetImage = imageDuResto;

      restaurants.push(monNouveauResto);
      monNouveauResto.setMarker(map);
      monNouveauResto.displayNewResto();


      // Ajout de commentaire
      let yesResto = document.getElementsByClassName("writeComment");
      monNouveauResto.writeComment(yesResto);

      Collapse("list-group-item");
      Collapse("comStyle");
      Collapse("writeComment");
    });
  });

}

// FONCTION COLLAPSE AU CLIC SUR UN ÉLÉMENT
function Collapse(params) {
  let coll = document.getElementsByClassName(params);

  for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
      this.classList.toggle("active");
      let content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  }
}
