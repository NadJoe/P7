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