let map, infoWindow, geocoder;
let resto = new Array();
let restaurants = new Array();
let resultat;
let userChoice;

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

        let infos = new google.maps.InfoWindow({
          // Information que contiendra l'infobulle sur le marker
          content: "<h2>Position Actuelle</h2>",
        });

        let marker = new google.maps.Marker({
          position: pos,
          map: map,
          icon:
            "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
        });

        marker.addListener("click", function () {
          // Quand l'utilisateur clique sur le marker, l'info apparait.
          infos.open(map, marker);
        });

        map.setCenter(pos);

        // Lorsque nous changeons la vue de la map et donc le centre, je recherche les restaurant autour du centre
        google.maps.event.addListener(map, "idle", function () {
          restaurants.forEach((elt) => {
            elt.marker.setMap(null);
          });
          resto = [];
          document.querySelector(".moment").innerHTML = "";

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
      //let newAddressRestaurant = results[0].formatted_address;

      console.log(newRestaurantName);
      newResto.id = 0;
      newResto.restaurantName = newRestaurantName;
      newResto.lat = latNewResto;
      newResto.long = longNewResto;
      newResto.averageNote = document.getElementById("note").value;
      let auteurNom = document.getElementById("authorName").value;


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

let cleApi = "AIzaSyC06sSZBdXw9TReabbXsFZ5e6ItlYbCZSA";
function getFetch(lat, long) {
  var restaurantLocation = "location=" + lat + "," + long;

  const url =
    "https://maps.googleapis.com/maps/api/place/nearbysearch/json?" +
    restaurantLocation +
    "&radius=1500&type=restaurant&key=" +
    cleApi +
    "";
  fetch(url, { mode: "cors" })
    .then((response) => response.json())
    .then((result) => {

/******************************************************************************************************/
//  Récupération de l'event de la liste pour le choix des restaurants à afficher
      let FilterChoice = document.getElementById("inputGroupSelect01");

//  Initialisation par défault du résultat du filtre pour afficher tous les restaurants au chargement de la page
      resultat = resultat = result.results.filter(
        (nouvel) => nouvel.rating >= 1 && nouvel.rating < 5
      );
      setChange(resultat);
/******************************************************************************************************/



    //////////////////////////////////// GESTION D'OUTIL DE FILTRAGE///////////////////////////////////
    FilterChoice.addEventListener("change", (e) => {
      // Récupération de la valeur de la liste à tester
         userChoice = Number(e.target.value);

        //resultat = result.results;

        if (userChoice === 0) {
          // Reset de la map
          restaurants.forEach((elt) => {
            elt.marker.setMap(null);
          });
          document.querySelector(".moment").innerHTML = "";

          resultat = result.results.filter(
            (nouvel) => nouvel.rating >= 1 && nouvel.rating <= 5
          );
          setChange(resultat);
          console.log(userChoice);
          for (const el of resultat) {
            console.log(el.name);
          }
        } else if (userChoice === 1) {
          // Reset de la map
          restaurants.forEach((elt) => {
            elt.marker.setMap(null);
          });
          document.querySelector(".moment").innerHTML = "";

          resultat = result.results.filter(
            (nouvel) => nouvel.rating >= 0 && nouvel.rating <= 1
          );
          setChange(resultat);

        } else if (userChoice === 2) {
          // Reset de la map
          restaurants.forEach((elt) => {
            elt.marker.setMap(null);
          });
          document.querySelector(".moment").innerHTML = "";

          resultat = result.results.filter(
            (nouvel) => nouvel.rating >= 1 && nouvel.rating <= 2
          );
          setChange(resultat);

        } else if (userChoice === 3) {
          // Reset de la map
          restaurants.forEach((elt) => {
            elt.marker.setMap(null);
          });
          document.querySelector(".moment").innerHTML = "";

          resultat = result.results.filter(
            (nouvel) => nouvel.rating >= 2 && nouvel.rating <= 3
          );
          setChange(resultat);

        } else if (userChoice === 4) {

            // Reset de la map
              restaurants.forEach((elt) => {
                elt.marker.setMap(null);
              });
              document.querySelector(".moment").innerHTML = "";

              resultat = result.results.filter(
                (nouvel) => nouvel.rating >= 3 && nouvel.rating <= 4
              );
              setChange(resultat);
 
        } else if (userChoice === 5) {
          // Reset de la map
          restaurants.forEach((elt) => {
            elt.marker.setMap(null);
          });
          document.querySelector(".moment").innerHTML = "";

          resultat = result.results.filter(
            (nouvel) => nouvel.rating >= 4 && nouvel.rating <= 5
          );
          setChange(resultat);

        } else {
          resultat = result.results;
          console.log(resultat);
        }
      });



      
        switch (userChoice) {
          case 0:
            console.log('0');
            break;
          case 1:
            console.log('1');
            break;
          case 2:
            console.log('2');
            break;
          case 3:
            console.log('3');
            break;
          case 4:
            console.log('4');
            break;
          case 5:
            console.log('5');
            break;
          default:
        }


      function setChange(myResult) {
        myResult.forEach((restaurant) => {
          var restoLocation = "location=" + resto.lat + "," + resto.long;
          let image =
            "https://maps.googleapis.com/maps/api/streetview?" +
            restoLocation +
            "&size=300x300&key=" +
            cleApi +
            "";
          const nouvelUrl =
            "https://maps.googleapis.com/maps/api/place/details/json?place_id=" +
            restaurant.place_id +
            "&fields=name,rating,formatted_phone_number,reviews&key=AIzaSyC06sSZBdXw9TReabbXsFZ5e6ItlYbCZSA";

          fetch(nouvelUrl)
            .then((response) => response.json())
            .then(function (response) {
              let monTest = response.result.reviews;
              for (const iterator of monTest) {
                // console.log(iterator.text);
                let monCom = iterator.text;
                let monComNom = iterator.author_name;

                myFirstCom = { com: monCom, auteur: monComNom };

                //myCommentList.push(monComEntier);
              }

              let monCom = response.result.reviews[0].text;
              let monComNom = response.result.reviews[0].author_name;
              mySecondCom = { com: monCom, auteur: monComNom };

              
              resto.push(monResto);
              let restoObject = new Restaurant(restaurant.place_id, monResto);
              restoObject.streetImage = image;
              restoObject.setMarker(map);
              restoObject.displayContent(myFirstCom, mySecondCom);
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
