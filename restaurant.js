class Restaurant {

    constructor(id, resto) {
        this.id = `restaurant_${id}`;
        this.restaurantName = resto.restaurantName;
        this.streetImage = resto.streetImage;
        this.address = resto.address;
        this.lat = resto.lat;
        this.long = resto.long;
        this.averageNote = resto.averageNote;
        this.marker = null;
        

    }

     // Initialisation du model de marker
     setMarker(map){
        let marker = new google.maps.Marker({
            position: {lat: this.lat, lng: this.long},
            map: map
        });

            // Information que contiendra l'infobulle sur le marker
        let infosMarker = new google.maps.InfoWindow({
            content: this.restaurantName
        });

            // Quand l'utilisateur clique sur le marker, l'info apparait.
        marker.addListener('click', function () {
            infosMarker.open(map, marker);
        })
        this.marker = marker;
     }
     

// Set informations
     displayContent(com, com2, com3){

        let content = `
                <div class="list-group-item"> ${this.restaurantName} </div>
                <div class="content">
                    <div>
                        <img src="${this.streetImage}" >
                    </div>
                    <div>${this.address}</div>
                    <div>${this.lat}</div>
                    <div>${this.long}</div>
                    <div class="comStyle"> Les commentaires </div>
                    <div class="nouveau">
                        <p> <strong>${com.auteur}</strong> : ${com.com} </p>
                        <p> <strong>${com2.auteur}</strong> : ${com2.com} </p>
                        <p> <strong>${com3.auteur}</strong> : ${com3.com} </p>
                    </div>
                    <p> Note moyenne : ${this.averageNote} </p>
                    <div class = "writeComment" > Ajouter un commentaire</div>
                </div>
            
            `
        document.querySelector('.moment').innerHTML += content;
    }

    displayNewResto(){

        let content = `
                <div class="list-group-item"> ${this.restaurantName} </div>
                <div class="content">
                    <div>
                        <img src="${this.streetImage}" >
                    </div>
                    <div>${this.address}</div>
                    <div>${this.lat}</div>
                    <div>${this.long}</div>
                    <div class="comStyle"> Les commentaires </div>
                    <div class="nouveau">
                        
                    </div>
                    <p> Note moyenne : ${this.averageNote} </p>
                    <div class = "writeComment" > Ajouter un commentaire</div>
                </div>
            
            `
        document.querySelector('.moment').innerHTML += content;

    }

// Add comment
    writeComment(commentPlace){

        for (let item of commentPlace) {
            item.addEventListener("click", function(params) {
               if(document.getElementById("formComment")===null){
        
                  let writeInput = document.createElement('div');
                  writeInput.innerHTML = `<br><form id="formComment"> 
                                          <input type="number" placeholder="Notez le restaurant" step="1" min="0" max="5" id="votreNote">
                                          <input placeholder=" Votre Nom " id="votreNom"> 
                                          <input placeholder=" Votre commentaire " id="votreCom"> 
                                          <input type="submit" value="Envoyer" >
                                       </form>`;
                                       params.target.parentNode.appendChild(writeInput);
                                       document.getElementById("formComment").addEventListener("submit", function (e) {
        
                                          e.preventDefault();
                                          let laNote = document.getElementById("votreNote").value;
                                          let leCom = document.getElementById("votreCom").value;
                                          let leNom = document.getElementById("votreNom").value;
                                          
                                          writeInput.parentNode.removeChild(writeInput);
        
                                          let nvCom = `<div> <p> <strong>${leNom}</strong> : ${leCom} </p> </div> <br>`
 
                                          params.target.parentNode.querySelector(".nouveau").innerHTML += nvCom;
        
                                       });
        
               }
               
            });
               
         }
    }


}




