// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
let map, infoWindow;

function initMap() {
   map = new google.maps.Map(document.getElementById('map'), {
      center: {
         lat: 48.847982,
         lng: 2.550109
      },
      zoom: 13
   });


   // Try HTML5 geolocation.
   
   if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
         let pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
         };

         // Information que contiendra l'infobulle sur le marker
         let infos = new google.maps.InfoWindow({
            content: '<h2>Position Actuelle</h2>',
         });

         let marker = new google.maps.Marker({
            position: pos,
            map: map,
            icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
         });

         // Quand l'utilisateur clique sur le marker, l'info apparait.
         marker.addListener('click', function () {
            infos.open(map, marker);
         })


         map.setCenter(pos);

         /*let service = new google.maps.places.PlacesService(map);
         service.nearbySearch({
            location : pos,
            radius: 5500,
            type : ['restaurant']
         }, callback);

         function callback(results, status){
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    createMarker(results[i]);
                }
            }
        }


        function createMarker(place) {
         var placeLoc = place.geometry.location;
         var marker = new google.maps.Marker({
             map : map,
             position : place.geometry.location
         });

         google.maps.event.addListener(marker, 'click', function() {
             infowindow.setContent(place.name);
             infowindow.open(map, this);
         });
     }*/


      }, function () {
         //handleLocationError(true, infoWindow, map.getCenter());
         alert("ERROR");
      },{timeout:10000});
      
   } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
   }

/*********************************************************************************************************/
/*********************************************************************************************************/

   // Ajout des markers pour chaque restaurant avec la boucle forEach
   lesRestos.forEach(function (resto, index) {
      // Donner a la fonction addMarker les données des restos en paramètres
      let restaurant = new Restaurant(index, resto);

      restaurant.setMarker(map);
      restaurant.displayContent();

      let yes = document.getElementsByClassName("writeComment");
      restaurant.writeComment(yes);

   });


/*********************************************************************************************************/
/*********************************************************************************************************/


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

// Appel de la fonction qui permet l'effet collapse sur les trois éléments voulu
Collapse("list-group-item");
Collapse("comStyle");
Collapse("writeComment");

}
