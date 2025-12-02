//-----------VARIABLES GÉNÉRALES---------------

//Canvas
const oCanvasHTML = document.querySelector("canvas");
const oContexte = oCanvasHTML.getContext("2d");
const nLargeur = oCanvasHTML.width;
const nHauteur = oCanvasHTML.height;

//état jeu
let sEtatJeu = "intro"; //Intro, jeu, fin

//clic dans niveau
let clicJeu = null;
let choix1 = null;
let choix2 = null;

//var niveaux
let niv = 1;
let chances = 3;

//----------------------Images--------------------
//fonds
let oFond = {
  x: 0,
  y: 0,
  h: oCanvasHTML.height,
  l: oCanvasHTML.width,
  image: new Image(),
  introSrc: "assets/images/imageIntro.jpg",
  videSrc: "assets/images/fondVide.jpg",
  ecranNiveauSrc: "assets/images/ecranNiveau.png",
  ecranFinSrc: "assets/images/ecranFin.jpg",
};

//boutons
let oBoutonDebut = new Image();
oBoutonDebut.src = "assets/images/boutonDebuter.png";

let oBoutonAcceuil = new Image();
oBoutonAcceuil.src = "assets/images/boutonAcceuil.png";

let oBoutonAdd = new Image();
oBoutonAdd.src = "assets/images/boutonPlus.png";

let oBoutonSous = new Image();
oBoutonSous.src = "assets/images/boutonMoins.png";

let oBoutonMult = new Image();
oBoutonMult.src = "assets/images/boutonMult.png";

let oBoutonDiv = new Image();
oBoutonDiv.src = "assets/images/boutonDiv.png";

let oBoutonEgal = new Image();
oBoutonEgal.src = "assets/images/boutonEgal.png";

let oBoutonBackspace = new Image();
oBoutonBackspace.src = "assets/images/boutonBackSpace.png";

//Variables danimation
let minuterie = 0;
let aLargeurs = [0, 60, 60, 60, 55, 60, 60, 65, 60, 60, 20, 55, 55];
let posCurseur = 0;
let pointDepart = 165;
let largeurTotale = 670;

//-------------------------Sons--------------------
let sons = {
  bonneReponse: new Audio("assets/audio/bonneReponse.wav"),
  jeuBattu: new Audio("assets/audio/jeuTermine.wav"),
  mauvaiseReponse: new Audio("assets/audio/mauvaiseReponse.wav"),
  gameOver: new Audio("assets/audio/gameOver.wav"),
};

//----------------------FONCTIONS--------------------------------

//init
function init() {
  setInterval(boucleJeu, 1000 / 60);
  oCanvasHTML.addEventListener("click", onClicCanvas);
}

//reinit
function reinit() {
  oContexte.clearRect(0, 0, nLargeur, nHauteur);
  niv = 1;
  chances = 3;
  choix1 = null;
  choix2 = null;
  clicJeu = null;
  sEtatJeu = "intro";
}

//clic
function onClicCanvas(evenement) {
  //coord clic
  curseurX = evenement.offsetX;
  curseurY = evenement.offsetY;
  //entrer dans jeu
  if (sEtatJeu == "intro" && curseurX >= 650 && curseurX <= 900 && curseurY >= 450 && curseurY <= 600) {
    //le timeout utilisé ici sert a régler un problème qui enregistre le clic dans l'état intro comme un clic dans l'état jeu
    setTimeout(() => {
      sEtatJeu = "jeu";
    }, 10);
  }

  //retour à l'acceuil
  if (sEtatJeu != "intro") {
    if (curseurX >= 875 && curseurX <= 975 && curseurY >= 25 && curseurY <= 125) {
      reinit();
    }
  }

  //-------------------------------choix dans jeu------------------------
  if (sEtatJeu == "jeu") {
    if (curseurX >= 175 && curseurX <= 295 && curseurY >= 375 && curseurY <= 495) {
      clicJeu = "+";
    } else if (curseurX >= 325 && curseurX <= 445 && curseurY >= 375 && curseurY <= 495) {
      clicJeu = "-";
    } else if (curseurX >= 475 && curseurX <= 595 && curseurY >= 375 && curseurY <= 495) {
      clicJeu = "*";
    } else if (curseurX >= 620 && curseurX <= 740 && curseurY >= 375 && curseurY <= 495) {
      clicJeu = "/";
    } else if (curseurX >= 770 && curseurX <= 920 && curseurY >= 375 && curseurY <= 675) {
      clicJeu = "=";
    } else if (curseurX >= 475 && curseurX <= 920 && curseurY >= 555 && curseurY <= 675) {
      clicJeu = "backspace";
    } else {
      clicJeu = "";
    }

    if (choix1 == null && choix2 == null) {
      if (clicJeu == "=") {
        afficherErreur();
      } else if (clicJeu == "backspace") {
        afficherErreur();
      } else if (clicJeu != "") {
        choix1 = clicJeu;
      }
      //choix2
    } else if (choix1 != null && choix2 == null) {
      if (clicJeu == "=") {
        afficherErreur();
      } else if (clicJeu == "backspace") {
        choix1 = null;
      } else if (clicJeu != "") {
        choix2 = clicJeu;
      }
      //troisieme clic
    } else if (choix1 != null && choix2 != null) {
      if (clicJeu == "=") {
        //si les deux choix sont faits, on valide lorsqu'on clic sur =
        validerReponse();
      } else if (clicJeu == "backspace") {
        choix2 = null;
      } else if (clicJeu != "") {
        afficherErreur();
      }
    }
  }
}

//----------------------------------------BOUCLE JEU----------------------------------------------------
function boucleJeu() {
  if (sEtatJeu == "intro") {
    afficherIntro();
  } else if (sEtatJeu == "jeu") {
    afficherNiveau();
    demarrerJeu();
  } else if (sEtatJeu == "fin") {
    afficherFin();
  }
}

//----------------------------------FONCTIONS VALIDATION---------------------------------------

function validerReponse() {
  //niveau 1
  if (niv == 1) {
    if (choix1 == "+" && choix2 == "-") {
      bonneReponse();
    } else {
      mauvaiseReponse();
    }
    //niveau 2
  } else if (niv == 2) {
    if (choix1 == "-" && choix2 == "+") {
      bonneReponse();
    } else {
      mauvaiseReponse();
    }
    //niveau 3
  } else if (niv == 3) {
    if (choix1 == "*" && choix2 == "+") {
      bonneReponse();
    } else {
      mauvaiseReponse();
    }
    //niveau 3
  } else if (niv == 4) {
    if (choix1 == "*" && choix2 == "*") {
      bonneReponse();
    } else {
      mauvaiseReponse();
    }
  } else if (niv == 5) {
    if ((choix1 == "+" && choix2 == "/") || (choix1 == "+" && choix2 == "-")) {
      bonneReponse();
    } else {
      mauvaiseReponse();
    }
  } else if (niv == 6) {
    if (choix1 == "/" && choix2 == "*") {
      bonneReponse();
    } else {
      mauvaiseReponse();
    }
  } else if (niv == 7) {
    if ((choix1 == "/" && choix2 == "/") || (choix1 == "/" && choix2 == "-")) {
      bonneReponse();
    } else {
      mauvaiseReponse();
    }
  } else if (niv == 8) {
    if (choix1 == "*" && choix2 == "/") {
      bonneReponse();
    } else {
      mauvaiseReponse();
    }
  } else if (niv == 9) {
    if ((choix1 == "+" && choix2 == "*") || (choix1 == "+" && choix2 == "+")) {
      bonneReponse();
    } else {
      mauvaiseReponse();
    }
  } else if (niv == 10) {
    if (choix1 == "*" && choix2 == "*") {
      sEtatJeu = "fin";
    } else {
      mauvaiseReponse();
    }
  }
}

function bonneReponse() {
  choix1 = null;
  choix2 = null;
  sons.bonneReponse.play();
  niv++;
}

function mauvaiseReponse() {
  if (chances > 0) {
    choix1 = null;
    choix2 = null;
    sons.mauvaiseReponse.play();
    chances--;
  } else if (chances <= 0) {
    afficherGameOver();
    reinit();
  }
}
//-----------------------------------FONCTIONS DESSIN--------------------------------------

//Ecran titre
function afficherIntro() {
  minuterie++;
  if (minuterie % 15 == 0 && posCurseur < aLargeurs.length) {
    let largeur = aLargeurs[posCurseur];

    largeurTotale -= largeur;
    pointDepart += largeur;
    posCurseur++;
  }
  oFond.image.src = oFond.introSrc;
  oContexte.clearRect(0, 0, nLargeur, nHauteur);
  oContexte.drawImage(oFond.image, 0, 0, oFond.l, oFond.h);
  oContexte.drawImage(oBoutonDebut, 650, 450, 250, 150);

  //----------ANIMATION

  oContexte.fillStyle = "rgb(234, 236, 206)";
  oContexte.fillRect(pointDepart, 125, largeurTotale, 100);
}

function afficherNiveau() {
  oFond.image.src = oFond.ecranNiveauSrc;
  oContexte.clearRect(0, 0, nLargeur, nHauteur);
  oContexte.drawImage(oFond.image, 0, 0, nLargeur, nHauteur);
  oContexte.drawImage(oBoutonAcceuil, 875, 25, 100, 100);
  //afficher boutons
  oContexte.drawImage(oBoutonAdd, 175, 375, 120, 120);
  oContexte.drawImage(oBoutonSous, 325, 375, 120, 120);
  oContexte.drawImage(oBoutonMult, 475, 375, 120, 120);
  oContexte.drawImage(oBoutonDiv, 620, 375, 120, 120);
  oContexte.drawImage(oBoutonEgal, 800, 375, 120, 300);
  oContexte.drawImage(oBoutonBackspace, 475, 555, 265, 120);
  oContexte.font = "70px 'Digital-italic";
  oContexte.fillStyle = "white";
  oContexte.textAlign = "left";
  oContexte.fillText(`Niveau: ${niv}`, 100, 125);
  oContexte.fillText(`Chances: ${chances}`, 595, 125);
}

//afficher l'ecran de jeu, les questions et les choix
function demarrerJeu() {
  oContexte.font = "150px 'Digital'";
  oContexte.fillStyle = "black";
  oContexte.textAlign = "left";
  //dessine les equations
  if (niv == 1) {
    oContexte.fillText("8 _ 4 _ 5 = 7", 100, 275);
  } else if (niv == 2) {
    oContexte.fillText("7 _ 3 _ 6 = 10", 100, 275);
  } else if (niv == 3) {
    oContexte.fillText("2 _ 6 _ 3 = 15", 100, 275);
  } else if (niv == 4) {
    oContexte.fillText("3 _ 3 _ 2 = 18", 100, 275);
  } else if (niv == 5) {
    oContexte.fillText("6 _ 4 _ 2 = 8", 100, 275);
  } else if (niv == 6) {
    oContexte.fillText("9 _ 3 _ 2 = 6", 100, 275);
  } else if (niv == 7) {
    oContexte.fillText("12 _ 3 _ 2 = 2", 100, 275);
  } else if (niv == 8) {
    oContexte.fillText("6 _ 4 _ 7 = 8", 100, 275);
  } else if (niv == 9) {
    oContexte.fillText("5 _ 2 _ 2 = 9 ", 100, 275);
  } else if (niv == 10) {
    oContexte.fillText("3 _ 2 _ 4 = 24", 100, 275);
  }

  //dessine choix1 dans le premier champ vide
  if (choix1 == "+") {
    oContexte.fillText("+", 215, 265);
  } else if (choix1 == "-") {
    oContexte.fillText("-", 215, 265);
  } else if (choix1 == "*") {
    oContexte.fillText("*", 215, 265);
  } else if (choix1 == "/") {
    oContexte.fillText("/", 215, 265);
  }

  //dessine choix2 dans deuxieme champ vide
  if (choix2 == "+") {
    oContexte.fillText("+", 440, 265);
  } else if (choix2 == "-") {
    oContexte.fillText("-", 440, 265);
  } else if (choix2 == "*") {
    oContexte.fillText("*", 440, 265);
  } else if (choix2 == "/") {
    oContexte.fillText("/", 440, 265);
  }
}

function afficherFin() {
  sons.jeuBattu.play();
  oContexte.clearRect(0, 0, nLargeur, nHauteur);
  oFond.src = oFond.ecranFinSrc;
  oContexte.drawImage(oFond, 0, 0, nLargeur, nHauteur);
}

function afficherGameOver() {
  sons.gameOver.play();
  alert("game over");
  reinit();
}

function afficherErreur() {
  alert("erreur");
}
//Ecran Fin
function afficherFin() {}

window.addEventListener("load", init);
