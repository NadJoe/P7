
let map, infoWindow, geocoder, service;
//let markers = new Array();
let resto = new Array();
let restaurants = new Array();
let myComment = new Array();

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
             lat: position.coords.latitude,
             lng: position.coords.longitude
          };
 
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
            console.log(resto);
            restaurants.forEach(elt => {
               elt.marker.setMap(null);
            })
            document.querySelector('.moment').innerHTML = "";

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
         newResto.averageNote = document.getElementById("note").value;

         let monNouveauResto = new Restaurant(newResto.id, newResto);

         let imageNewResto = "location="+newResto.lat+","+newResto.long;
         let imageDuResto = 'https://maps.googleapis.com/maps/api/streetview?'+imageNewResto+'&size=300x300&key=AIzaSyC06sSZBdXw9TReabbXsFZ5e6ItlYbCZSA';

         monNouveauResto.streetImage = imageDuResto;

         restaurants.push(monNouveauResto);
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
      
      const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?"+restaurantLocation+"&radius=1500&type=restaurant&key="+cleApi+"";
      fetch(url ,{mode: 'cors'})
      .then(response=>response.json())
      .then(result=>{
         //console.log(result.results);

         result.results.forEach(restaurant => {
            
            var restoLocation = "location="+resto.lat+","+resto.long;
            let image = 'https://maps.googleapis.com/maps/api/streetview?'+restoLocation+'&size=300x300&key='+cleApi+'';
            const nouvelUrl = "https://maps.googleapis.com/maps/api/place/details/json?place_id="+restaurant.place_id+"&fields=name,rating,formatted_phone_number,reviews&key=AIzaSyC06sSZBdXw9TReabbXsFZ5e6ItlYbCZSA"
            
                  resto.id = restaurant.place_id;
                  resto.restaurantName = restaurant.name;
                  resto.address = restaurant.vicinity;
                  resto.lat = restaurant.geometry.location.lat;
                  resto.long = restaurant.geometry.location.lng;
                  resto.averageNote = restaurant.rating;
                 // console.log(restaurant.name);
                 
            fetch(nouvelUrl)
            .then(response => response.json()).then(function (response){
               for (let index = 0; index < 10; index++) {
                  console.log(response.result.reviews[index].text);
                  
                  resto.comment = response.result.reviews[index].text;
                  document.querySelector(".nouveau").innerHTML += resto.comment;

                  myComment.push(resto.comment);
                  console.log(resto);
                  
               }
            });
            
            let restoObject = new Restaurant(resto.id, resto);
            restoObject.streetImage = image;
            restoObject.setMarker(map);
            restoObject.displayContent();

            restaurants.push(restoObject);
           
            let ecritureComment = document.getElementsByClassName("writeComment");
            restoObject.writeComment(ecritureComment);
            
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