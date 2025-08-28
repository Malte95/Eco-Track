const button = document.getElementById("btn")


function handleCar() {
    console.log("Auto wurde ausgewählt.");
}

function handleWashingmachine() {
    console.log("Waschmaschine wurde ausgewählt");
}

function handleTV() {
    console.log("TV wurde ausgewählt");
}

document.getElementById("berechnen").addEventListener("click", function(){
    const selected = document.getElementById("mySelect").value;

    switch(selected) {
        case "Auto":
            handleCar();
            break;
        
        case "Waschmaschine":
            handleWashingmachine();
            break;
            
        case "TV":
            handleTV();
            break;
         
        default:
            console.log("Bitte eine gültige Auswahl treffen.")    
    }
});

