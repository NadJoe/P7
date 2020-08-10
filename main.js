


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
         console.log(position);
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

   // Ajout des markers pour chaque restaurant avec la boucle forEach
   lesRestos.forEach(function (resto) {
      // Donner a la fonction addMarker les données des restos en paramètres
      addMarker({
         lat: resto.lat,
         lng: resto.long
      });
      // fonction qui gère l'ajout des markers    
      function addMarker(coords) {
         let markerRest = new google.maps.Marker({
            position: coords,
            map: map
         });

         // Information que contiendra l'infobulle sur le marker
         let infosMarker = new google.maps.InfoWindow({
            content: resto.restaurantName,
         });

         // Quand l'utilisateur clique sur le marker, l'info apparait.
         markerRest.addListener('click', function () {
            infosMarker.open(map, markerRest);
         })
      }


      // TEST D'AFFICHAGE DES INFORMATIONS
      let nom = document.createElement('div'); // creation d'une balise <li> qui va prendre les noms des restaurants
      nom.classList.add('list-group-item'); // Donner une classe à la balise pour que les styles css bootstrap s'appliquent
      nom.textContent = resto.restaurantName; // contenu textuel de notre balise
      document.querySelector('.moment').appendChild(nom);

      let getNoteMoyenne = ( rate )=>{
         let total = 0;
         rate.forEach(elt=>{
            total+= elt.stars;
         });
         return total/rate.length;
      } ;
      let noteMoyenne = getNoteMoyenne(resto.ratings);


      // GESTION D'AFFICHAGE DES ADRESSES
      let addresse = document.createElement('div'); // div qui stocke les addresses des restaurants
      addresse.classList.add('content'); // affectation d'une classe à la balise des addresses
      addresse.textContent = "Adresse : " + resto.address; // contenu textuel de la balise des addresses
      

      // GESTION D'AFFICHAGE DES COORDONÉES
      let latitude = document.createElement('div'); // div qui stocke les addresses des restaurants
      latitude.textContent = "Lat : " + resto.lat; // contenu textuel de la balise des addresses
      addresse.appendChild(latitude);
      document.querySelector('.moment').appendChild(addresse);


      let longitude = document.createElement('div'); // div qui stocke les addresses des restaurants
      longitude.textContent = "Long : " + resto.long; 
      addresse.appendChild(longitude);
      document.querySelector('.moment').appendChild(addresse);

      // GESTION DES COMMENTAIRES POUR L'AFFICHAGE
      let commentaires = document.createElement('div'); // creation d'une balise <li> qui va prendre les noms des restaurants
      commentaires.classList.add('comStyle'); // Donner une classe à la balise pour que les styles css bootstrap s'appliquent
      commentaires.textContent = " Les commentaires "; // contenu textuel de notre balise
      addresse.appendChild(commentaires);
      document.querySelector('.moment').appendChild(addresse);

      let note = document.createElement('div'); // div qui stocke les addresses des restaurants
      //note.textContent = resto.ratings; 
      note.innerHTML = resto.ratings.map(elt=>{
         return ` <div> <p> Note : ${elt.stars} </p>  <p> Comment : ${elt.comment} </p> </div> `
      });
      note.innerHTML+=`<p> Note moyenne : ${noteMoyenne} </p>`;
      addresse.appendChild(note);
      document.querySelector('.moment').appendChild(addresse);


      // GESTION DES COMMENTAIRES POUR L'ECRITURE
      let readComment = document.createElement('div'); // creation d'une balise <li> qui va prendre les noms des restaurants
      readComment.classList.add('writeComment'); // Donner une classe à la balise pour que les styles css bootstrap s'appliquent
      readComment.textContent = " Ajouter"; // contenu textuel de notre balise
      addresse.appendChild(readComment);
      document.querySelector('.moment').appendChild(addresse);

      
      let writeInput = document.createElement('input');
      addresse.appendChild(writeInput);
      document.querySelector('.moment').appendChild(addresse);

      /*let bac = document.getElementById("formulaire");
      console.log(bac.innerHTML);*/

      

   });
   
   /*document.getElementById("formulaire").addEventListener("submit", function(e) {
         e.preventDefault();
         alert("Votre avis est envoyé !");
      })*/
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
