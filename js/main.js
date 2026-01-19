let btntabFourn = document.getElementById("tabFourn");
let btntabClients = document.getElementById("tabClients");

btntabClients.addEventListener("click", function() {
  window.location.href = "pags/ajouterClient/ajouterClient.html";
});

btntabFourn.addEventListener("click", function() {
  window.location.href = "pags/ajouterFournisser/ajouterFournisser.html";
});