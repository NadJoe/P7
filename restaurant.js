class Restaurant {

    constructor(id, resto) {
        this.id = `restaurant_${id}`;
        this.restaurantName = resto.restaurantName;
        this.streetImage = resto.streetImage;
        this.address = resto.address;
        this.lat = resto.lat;
        this.long = resto.long;
        this.ratings = resto.ratings?resto.ratings:[];
        this.averageNote = resto.averageNote;
        this.marker = null;
        this.comment = null;

    }

    // Methods Calcul note moyenne
   getNoteMoyenne(rate){
        let total = 0;
        rate.forEach(elt=>{
           total+= elt.stars;
        });
        return total/rate.length;
     };

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
     displayContent(){

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
                                          <input placeholder=" Votre commentaire " id="votreCom"> 
                                          <input type="submit" value="Envoyer" >
                                       </form>`;
                                       params.target.parentNode.appendChild(writeInput);
                                       document.getElementById("formComment").addEventListener("submit", function (e) {
        
                                        //console.log(params.target);
        
                                          e.preventDefault();
                                          let laNote = document.getElementById("votreNote").value;
                                          let leCom = document.getElementById("votreCom").value;
                                          
                                          writeInput.parentNode.removeChild(writeInput);
        
                                          let nvCom = `,<br> <div> <p> Note : ${laNote} </p>  <p> Comment : ${leCom} </p> </div> <br>`
 
                                          params.target.parentNode.querySelector(".nouveau").innerHTML += nvCom;
        
                                       });
        
               }
               
            });
               
         }
    }


}




