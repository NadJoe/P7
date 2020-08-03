class restaurant {

   constructor(id, objetRestoJson) {
      if (objetRestoJson) {
         this.restaurantNom = objetRestoJson.restaurantName;
         this.addresseResto = objetRestoJson.address;
         this.avis = objetRestoJson.ratings;
      } else {
         // Initialiser le tratings a vide.
         this.avis = [];
      }
      // Identifiant unique permettant de manipuler le DOM sidebar à partir de l'objet
      this.id = "restaurant_" + id;
      // Indice du li dans la liste ul : déroulant du li via Materialize
      this.indice = id;
      // Initialisation de la moyenne 
      this.MoyenneNote = this.MoyNote;

   }
}


let lesRestos = [{
      "restaurantName": "Bronco",
      "address": "39 Rue des Petites Écuries, 75010 Paris",
      "lat": 48.8737815,
      "long": 2.3501649,
      "ratings": [{
            "stars": 4,
            "comment": "Un excellent restaurant, j'y reviendrai ! Par contre il vaut mieux aimer la viande."
         },
         {
            "stars": 5,
            "comment": "Tout simplement mon restaurant préféré !"
         }
      ]
   },
   {
      "restaurantName": "Babalou",
      "address": "4 Rue Lamarck, 75018 Paris",
      "lat": 48.8865035,
      "long": 2.3442197,
      "ratings": [{
            "stars": 5,
            "comment": "Une minuscule pizzeria délicieuse cachée juste à côté du Sacré choeur !"
         },
         {
            "stars": 3,
            "comment": "J'ai trouvé ça correct, sans plus"
         }
      ]
   },
   {
      "restaurantName": "maxily",
      "address": "4 Rue maubeuge, 75009 Paris",
      "lat": 48.8865035,
      "long": 2.6742197,
      "ratings": [{
            "stars": 5,
            "comment": "Un moment fantastique et inoubliable"
         },
         {
            "stars": 3,
            "comment": "L'equipe est trop sympa et serviable"
         }
      ]
   },
   {
      "restaurantName": "Venus Moment",
      "address": "4 rue vaugirard, 75006 Paris",
      "lat": 48.7865035,
      "long": 2.1442197,
      "ratings": [{
            "stars": 5,
            "comment": "Une minuscule pizzeria délicieuse cachée juste à côté du Sacré choeur !"
         },
         {
            "stars": 3,
            "comment": "J'ai trouvé ça correct, sans plus"
         }
      ]
   },
   {
      "restaurantName": "Resto Paris",
      "address": "4 rue vauxaul, 75006 Paris",
      "lat": 48.2865035,
      "long": 2.3442197,
      "ratings": [{
            "stars": 2,
            "comment": "Une minuscule pizzeria délicieuse cachée juste à côté du Sacré choeur !"
         },
         {
            "stars": 3,
            "comment": "J'ai trouvé ça correct, sans plus"
         }
      ]
   },
   {
      "restaurantName": "African food",
      "address": "2 rue parot, 75006 Paris",
      "lat": 48.1887035,
      "long": 2.3402197,
      "ratings": [{
            "stars": 5,
            "comment": "Un restaurant atypique et très agréable"
         },
         {
            "stars": 5,
            "comment": "Je recommande à tout le monde"
         }
      ]
   },
   {
      "restaurantName": "Aactuel",
      "address": "2 rue parot, 75006 Paris",
      "lat": 46.227638,
      "long": 2.213749,
      "ratings": [{
            "stars": 5,
            "comment": "Un restaurant atypique et très agréable"
         },
         {
            "stars": 5,
            "comment": "Je recommande à tout le monde"
         }
      ]
   }
]






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
      note.textContent = resto.ratings; 
      addresse.appendChild(note);
      document.querySelector('.moment').appendChild(addresse);

   });


   // Gestion de la partie collapse pour chaque restaurant
   let coll = document.getElementsByClassName("list-group-item");

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


   // Gestion de la partie collapse pour chaque restaurant
   let collcom = document.getElementsByClassName("comStyle");

   for (let i = 0; i < collcom.length; i++) {
      collcom[i].addEventListener("click", function () {
         //alert("yeeees");
         this.classList.toggle("active");
         let comStyle= this.nextElementSibling;
         if (comStyle.style.display === "block") {
            comStyle.style.display = "none";
         } else {
            comStyle.style.display = "block";
         }
      });
   }

}
