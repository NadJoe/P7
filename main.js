
let map, infoWindow, geocoder, service;
let markers = new Array();
let resto = new Array();

 // marqueur1.setMap(null);


// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
/*function initMap() {
   // Create the map.
   let pyrmont = { lat: 48.848579, lng: 2.55261 };
   const map = new google.maps.Map(document.getElementById("map"), {
     center: pyrmont,
     zoom: 17,
   });

   // Lorsque nous changeons la vue de la map et donc le centre, je recherche les restaurant autour du centre 
   google.maps.event.addListener(map, 'idle', function() {
             
      let newLat = map.getCenter().lat();
      let newLng = map.getCenter().lng();

      pyrmont = { lat: newLat, lng: newLng};
      console.log(pyrmont);
      
  });

   // Create the places service.
   let service = new google.maps.places.PlacesService(map); 
 
   
   // Perform a nearby search.
   service.nearbySearch(
     { location: pyrmont, radius: 1500, type: "restaurant" },
     (results, status) => {
       if (status !== "OK") return;
       resto == results;
       //resto.push(results);
       createMarkers(results, map);
     }
   );
 }
 console.log(resto);
 
 function createMarkers(places, map) {
   const bounds = new google.maps.LatLngBounds();
   const placesList = document.getElementById("selection");
 
   for (let i = 0, place; (place = places[i]); i++) {
     
     new google.maps.Marker({
       map,
       title: place.name,
       position: place.geometry.location,
     });
     let  li = document.createElement("li");
     li.textContent = place.name;
     placesList.appendChild(li);
     bounds.extend(place.geometry.location);
   }
   map.fitBounds(bounds);
 }

*/


 function initMap() {
   let pos={};

   
   map = new google.maps.Map(document.getElementById('map'), {
      center: {
         lat: 48.85337496845287,
         lng: 2.4389928241215797
      },
      zoom: 13

   });

   

    // Try HTML5 geolocation.
    
    if (navigator.geolocation){
       navigator.geolocation.getCurrentPosition(function (position) {
           pos = {
              //lat : map.getCenter().lat(),
              //lng : map.getCenter().lng()
             lat: position.coords.latitude,
             lng: position.coords.longitude
          };

          console.log(pos.lat , pos.lng);

          

      // Dès que j'ai la geolocalisation, je fetch pour rechercher les restaurants de cette zone
          //getFetch(pos.lat, pos.lng); //////////////////////////////////////////////////////////
 
          let infos = new google.maps.InfoWindow({ // Information que contiendra l'infobulle sur le marker
             content: '<h2>Position Actuelle</h2>',
          });
 
          let marker = new google.maps.Marker({
             position: pos,
             map: map,
             icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
          });
 
          marker.addListener('click', function () { // Quand l'utilisateur clique sur le marker, l'info apparait.
             infos.open(map, marker);
          })
 
         
          map.setCenter(pos);

// Lorsque nous changeons la vue de la map et donc le centre, je recherche les restaurant autour du centre 
          google.maps.event.addListener(map, 'idle', function() {
             
             let newLat = map.getCenter().lat();
             let newLng = map.getCenter().lng();
             getFetch(newLat, newLng);
         });
 
       }, function () {
          handleLocationError(true, infoWindow, map.getCenter());
          alert("ERROR");
       },{timeout:10000});
       
    } else { 
       // Browser doesn't support Geolocation
       handleLocationError(false, infoWindow, map.getCenter());
    }

   
/*********************************************************************************************************/
/*********************************************************************************************************/
// ajouter un marker à n'importe quel endroit lors d'un clic sur la carte
      map.addListener('click', function(e){
         let geocoder = new google.maps.Geocoder();
         let newResto = {};
         $('#blocFormNewRestaurant').modal('show'); 
         let clickPosition = e.latLng;

      geocoder.geocode( { location : clickPosition }, function(results, status) {
        if (status == 'OK') {
          newResto.address = results[0].formatted_address; // recuperation de l'addresse du clic sur la map
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });
    

      $("#formNewRestaurant").submit(function(nad){
         
         $('#blocFormNewRestaurant').modal('hide'); // fermer le formulaire dès qu'il est envoyé
         nad.preventDefault();
         
         let latNewResto = clickPosition.lat();
         let longNewResto = clickPosition.lng();
         let newRestaurantName = document.getElementById("nom").value;
         //let newAddressRestaurant = results[0].formatted_address;

         console.log(newRestaurantName);

         newResto.id = 0;
         newResto.restaurantName = newRestaurantName;
         newResto.lat = latNewResto;
         newResto.long = longNewResto;
         newResto.averageNote = document.getElementById("note").value;;

         let monNouveauResto = new Restaurant(newResto.id, newResto);

         let imageNewResto = "location="+newResto.lat+","+newResto.long;
         let imageDuResto = 'https://maps.googleapis.com/maps/api/streetview?'+imageNewResto+'&size=300x300&key=AIzaSyC06sSZBdXw9TReabbXsFZ5e6ItlYbCZSA';

         monNouveauResto.streetImage = imageDuResto;

         monNouveauResto.setMarker(map);
         monNouveauResto.displayContent();

          // Ajout de commentaire
         let yesResto = document.getElementsByClassName("writeComment");
         monNouveauResto.writeComment(yesResto);

         Collapse("list-group-item");
         Collapse("comStyle");
         Collapse("writeComment");

      }); 

   });


} 


   let cleApi = 'AIzaSyC06sSZBdXw9TReabbXsFZ5e6ItlYbCZSA';
   function getFetch(lat, long) {
            
      var restaurantLocation = "location="+lat+","+long;
      //console.log(restaurantLocation);

      const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?"+restaurantLocation+"&radius=1500&type=restaurant&key="+cleApi+"";
      fetch(url ,{mode: 'cors'})
      .then(response=>response.json())
      .then(result=>{
         console.log(result.results);

         result.results.forEach(restaurant => {
            
            resto.id = restaurant.place_id;
            resto.restaurantName = restaurant.name;
            resto.address = restaurant.vicinity;
            resto.lat = restaurant.geometry.location.lat;
            resto.long = restaurant.geometry.location.lng;
            resto.averageNote = restaurant.rating;
            console.log(restaurant.name);

            let restoObject = new Restaurant(resto.id, resto);

            var restoLocation = "location="+resto.lat+","+resto.long;
            let image = 'https://maps.googleapis.com/maps/api/streetview?'+restoLocation+'&size=300x300&key='+cleApi+'';

            restoObject.streetImage = image;

            restoObject.setMarker(map);
            restoObject.displayContent();



            let ecritureComment = document.getElementsByClassName("writeComment");
            restoObject.writeComment(ecritureComment);

           /*const request = {
               placeId: "ChIJfx6u-90h-kcRNrZEII3r1jA",
               fields: ["name", "formatted_address", "place_id", "geometry"],
             };


            const service = new google.maps.places.PlacesService(map);
               service.getDetails(request, (place, status) =>{
                  if(status === google.maps.places.PlacesServiceStatus.OK){
                     console.log('result.results');
                  }
               })*/
         })
         // Appel de la fonction qui permet l'effet collapse sur les trois éléments voulu
         Collapse("list-group-item");
         Collapse("comStyle");
         Collapse("writeComment");

      })
      
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