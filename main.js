// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
let map, infoWindow;

function initMap() {
   let pos={};

   
   map = new google.maps.Map(document.getElementById('map'), {
      center: {
         lat: 48.847982,
         lng: 2.550109
      },
      zoom: 13
   });


    // Try HTML5 geolocation.
    
    if (navigator.geolocation){
       navigator.geolocation.getCurrentPosition(function (position) {
           pos = {
             lat: position.coords.latitude,
             lng: position.coords.longitude
          };

      // Dès que j'ai la geolocalisation, je fetch pour rechercher les restaurants de cette zone
          getFetch(pos.lat, pos.lng); //////////////////////////////////////////////////////////
 
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
          //map.setCenter(results[0].geometry.location);
          //alert('OK');
          //console.log(results[0].formatted_address);
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
         newResto.averageNote = 2;

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

/*********************************************************************************************************/
/*********************************************************************************************************/

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

/*********************************************************************************************************/
/*********************************************************************************************************/

      let cleApi = 'AIzaSyC06sSZBdXw9TReabbXsFZ5e6ItlYbCZSA';

         function getFetch(lat, long) {
         
               var restaurantLocation = "location="+lat+","+long;
               console.log(restaurantLocation);
               const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?"+restaurantLocation+"&radius=1500&type=restaurant&keyword=cruise&key=AIzaSyC06sSZBdXw9TReabbXsFZ5e6ItlYbCZSA";
               fetch(url ,{mode: 'cors'})
               .then(response=>response.json())
               .then(result=>{
                  console.log(result.results);

                  result.results.forEach(restaurant => {
                     let resto = {};
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


                     let request = { 
                        placeId: "ChIJL4UVCSdu5kcRZP_k3fkFhoY"
                     };
                     let service = new google.maps.places.PlacesService(map);
                     service.getDetails(request, function(place, status) {
                        if(status == google.maps.places.PlacesServiceStatus.OK){
                           console.log(place.reviews);
                        }
                     });


                     
                     restoObject.setMarker(map);
                     restoObject.displayContent();

                     //console.log(pos.lat);

                     let yes = document.getElementsByClassName("writeComment");
                     restoObject.writeComment(yes);
                     
                  })



                  // Appel de la fonction qui permet l'effet collapse sur les trois éléments voulu
                  Collapse("list-group-item");
                  Collapse("comStyle");
                  Collapse("writeComment");
               })
         }


}
