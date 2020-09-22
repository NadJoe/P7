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
   let pos={};
   if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
          pos = {
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

      }, function () {
         //handleLocationError(true, infoWindow, map.getCenter());
         alert("ERROR");
      },{timeout:10000});
      
   } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
   }

   // ajouter un marker à n'importe quel endroit lors d'un clic sur la carte
   map.addListener('click', function(e){
      
      let clickPosition = e.latLng;
      console.log(clickPosition);

  /* // geocoder pour trouver l'addresse du clic sur la carte
      const geocoder = new google.maps.Geocoder();
      function getAddressGeocode(geocoder, map){
         const latLngResto = {
            lat : latNewResto,
            lng : longNewResto
         };

         geocoder.geocode({location: latLngResto}, (results, statut) => {
            if(statut === "OK"){
               console.log(results[0].formatted_address);
               if(results[0]){
                  //map.setZoom(11);
               }
            }
         });
      }*/

      //getAddressGeocode(geocoder,map);

      let newResto = {};
      let latNewResto = clickPosition.lat();
      let longNewResto = clickPosition.lng();
      let newRestaurantName = 'nouveau resto';
      let newAddressRestaurant = "nouvelle adresse";

      newResto.id = 0;
      newResto.restaurantName = newRestaurantName;
      newResto.address = newAddressRestaurant;
      newResto.lat = latNewResto;
      newResto.long = longNewResto;
      newResto.averageNote = 2;
      //console.log('Details du nouveau restaurant');
      console.log('Latitude : '+ latNewResto + ' ' + 'Longitude : ' + longNewResto);


      let monNouveauResto = new Restaurant(newResto.id, newResto);
      monNouveauResto.setMarker(map);
      monNouveauResto.displayContent();

      // Ajout de commentaire
      let yesResto = document.getElementsByClassName("writeComment");
      monNouveauResto.writeComment(yesResto);

      console.log(newResto);

      Collapse("list-group-item");
      Collapse("comStyle");
      Collapse("writeComment");
   });

   

/*********************************************************************************************************/
/*********************************************************************************************************/

   // Ajout des markers pour chaque restaurant avec la boucle forEach
  /* lesRestos.forEach(function (resto, index) {
      // Donner a la fonction addMarker les données des restos en paramètres
      let restaurant = new Restaurant(index, resto);

      restaurant.setMarker(map);
      restaurant.displayContent();

      let yes = document.getElementsByClassName("writeComment");
      restaurant.writeComment(yes);

   });*/


/*********************************************************************************************************/
/*********************************************************************************************************/


function placeMarkerToMap(latLng, map) {
   var marker = new google.maps.Marker({
      position: latLng,
      map: map
   })
   
   map.panTo(latLng);
}

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

   const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+pos.lat+","+pos.lng+"&radius=1500&type=restaurant&keyword=cruise&key=AIzaSyC06sSZBdXw9TReabbXsFZ5e6ItlYbCZSA";
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

         restoObject.setMarker(map);
         restoObject.displayContent();

         let yes = document.getElementsByClassName("writeComment");
         restoObject.writeComment(yes);

         
      })

      // Appel de la fonction qui permet l'effet collapse sur les trois éléments voulu
      Collapse("list-group-item");
      Collapse("comStyle");
      Collapse("writeComment");
   })

}
