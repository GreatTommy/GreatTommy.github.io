const width = 600;
const height = 500;
const pas = 5;
const pasInvader = 2;
const tailleVaisseau = 14;
const largeurTir = 5;
const hauteurTir = 5;
const largeurTirInvader = 6;
const hauteurTirInvader = 10;
const frontiere = 60;
const largeurMuraille = 70;
const hauteurMuraille = 30;

let tirs = [];
let tirsInvaders = [];
let invaders = [];
let murailles = [];
let imagesMuraille = [];

let decalage = 30;
let compteur = 0;
let compteur2 = 0;
let decalageInvader = 6;
let alterneur = -1;

function preload() {
  poup = loadSound('poup.mp3');
  tirSon = loadSound('tir.mp3');
  explose = loadSound('explose.mp3');
  crush = loadSound('crush.mp3');
  tue = loadSound('tue.mp3');
  invader1 = loadImage('invader1.png');
  invader2 = loadImage('invader2.png');
  casse0 = loadImage('casse0.png');
  casse1 = loadImage('casse1.png');
  casse2 = loadImage('casse2.png');
  casse3 = loadImage('casse3.png');
  coeur = loadImage('coeur.png');
  imagesMuraille.push(casse0);
  imagesMuraille.push(casse1);
  imagesMuraille.push(casse2);
  imagesMuraille.push(casse3);
}

function setup() {
  createCanvas(width, height);
  starship0 = new vaisseau;
  creerInvaders();
  construireMuraille();
}

function draw() {
  if (starship0.vies > 0 && !envahi()) {
    background(0, 0, 50);
    afficherVies();

    let actifs = 0
    for (let elt of invaders) {
      if (!elt.mort) {
        actifs++;
      }
    }
    decalage = round(map(actifs, 0, 40, 10, 30));

    let fps = frameRate();
    fill(255);
    stroke(0);
    text("FPS: " + fps.toFixed(2), 10, height - 10);

    for (let elt of murailles) {
      elt.afficher();
    }
    starship0.deplacer();
    starship0.afficher();
    purge();

    for (let elt of tirs) {
      elt.afficher();
      elt.deplacer();
    }
    if (tirs.length > 0) {
      let tempX = tirs[0].x;
      let tempY = tirs[0].y;
      for (let elt of murailles) {
        elt.verifHit(tempX, tempY, "humain");
      }
      for (let elt of invaders) {
        elt.verifHit(tempX, tempY);
      }
    }

    for (let elt of tirsInvaders) {
      elt.afficher();
      elt.deplacer();
    }
    if (tirsInvaders.length > 0) {
      let tempX = tirsInvaders[0].x;
      let tempY = tirsInvaders[0].y;
      for (let elt of murailles) {
        elt.verifHit(tempX, tempY, "invader");
      }
      starship0.verifHit(tempX, tempY);
    }

    for (let elt of invaders) {
      elt.afficher();
    }
    deplacerInvaders();
    if (tirsInvaders.length < 1) {
      tirerInvaders();
    }
  } else {
    background(0, 0, 50);
    textSize(60);
    fill(255, 255, 255);
    text('GAME OVER', 117, height / 2);
  }
}

function afficherVies() {
  let marge = 38;
  for (let i = 0; i < starship0.vies; i++) {
    image(coeur, width - marge, 10);
    marge += 38;
  }
}

function construireMuraille() {
  let i = 400;
  let j = 64;
  let c = 0;

  while (j < width) {
    for (let c1 = i; c1 < hauteurMuraille + i; c1 += 16) {
      for (let c2 = j; c2 < largeurMuraille + j; c2 += 16) {
        let nouvBloc = new muraille(c2, c1);
        murailles.push(nouvBloc);
      }
    }
    j += 134;
  }
}



function deplacerInvaders() {
  if (compteur == 0) {
    for (let elt of invaders) {
      elt.deplacerX();
    }
    compteur++;
    alterneur *= -1;
    poup.play();
    if (compteur2 < 16) {
      compteur2++
    } else {
      compteur2 = 0;
      for (let elt of invaders) {
        elt.deplacerY();
      }
      decalageInvader *= -1;
    }
  } else if (compteur < decalage) {
    compteur++;
  }
  if (compteur == decalage) {
    compteur = 0;
  }
}

function keyPressed() {
  if (keyCode == 32) { //32 == ESPACE
    if (tirs.length < 1) {
      let nouvTir = new tir(starship0.x + tailleVaisseau / 2);
      tirSon.play();
      tirs.push(nouvTir);
    }
  }
}

function purge() {
  let taille = tirs.length;
  for (let i = 0; i < taille; i++) {
    if (tirs[i].y < 0) {
      tirs.splice(i, 1);
      taille = tirs.length;
    }
  }

  taille = tirsInvaders.length;
  for (let i = 0; i < taille; i++) {
    if (tirsInvaders[i].y > height) {
      tirsInvaders.splice(i, 1);
      taille = tirsInvaders.length;
    }
  }
}

function creerInvaders() {
  let xTemp = frontiere;
  let yTemp = 50;
  let indice = 0;
  while (yTemp < 250) {
    while (xTemp < 444) {
      nouvInvader = new invader(xTemp, yTemp, indice);
      invaders.push(nouvInvader);
      xTemp += 40;
      indice++;
    }
    yTemp += 50;
    xTemp = frontiere;
  }
}

function tirerInvaders() {
  let liste = [];
  for (let elt of invaders) {
    if (elt.verifFront() && !elt.mort) {
      liste.push(elt);
    }
  }
  liste[floor(random(liste.length))].tirer();
}

function envahi() {
  let liste = [];
  for (let elt of invaders) {
    if (elt.verifFront() && !elt.mort) {
      if (elt.y > 380) {
        return true;
      }
    }
  }
  return false;
}

class vaisseau {
  constructor() { //fonction constructrice
    this.x = width / 2;
    this.y = height;
    this.taille = tailleVaisseau;
    this.vies = 3;
  }
  afficher() {
    let x = this.x;
    fill(255);
    noStroke();
    rect(x - this.taille / 2 - this.taille, height - this.taille, this.taille * 3, this.taille);
    rect(x - 5, height - this.taille - 10, 10, 10);
  }
  deplacer() {
    if (keyIsDown(LEFT_ARROW) && starship0.x > 0 + this.taille) {
      starship0.x -= pas;
    } else if (keyIsDown(RIGHT_ARROW) && starship0.x < width - this.taille) {
      starship0.x += pas;
    }
  }
  verifHit(x, y) {
    if (this.vies > 0) {
      if (this.x - 25 <= x && x <= this.x + 20 && this.y - 13 <= y && y <= this.y + 9) {
        this.vies--;
        explose.play();
        tirsInvaders.pop();
      }
    }
  }
}

class tir {
  constructor(x) { //fonction constructrice
    this.x = x - tailleVaisseau / 2 - largeurTir / 2;
    this.y = height - tailleVaisseau - hauteurTir;
  }
  afficher() {
    fill(255);
    rect(this.x, this.y, largeurTir, hauteurTir);
  }
  deplacer() {
    this.y -= 8;
  }
}

class tirInvader {
  constructor(x, y) { //fonction constructrice
    this.x = x + 6;
    this.y = y + 16;
  }
  afficher() {
    fill(255);
    rect(this.x, this.y, largeurTirInvader, hauteurTirInvader);
  }
  deplacer() {
    this.y += 3;
  }
}

class invader {
  constructor(x, y, indice) {
    this.x = x;
    this.y = y;
    this.indice = indice;
    this.mort = false;
  }
  afficher() {
    if (!this.mort) {
      if (alterneur == -1) {
        image(invader1, this.x, this.y);
      } else {
        image(invader2, this.x, this.y);
      }
    }
  }
  deplacerX() {
    this.x += decalageInvader;
  }
  deplacerY() {
    this.y += 20;
  }
  verifHit(x, y) {
    if (!this.mort) {
      if (this.x - 2 <= x && x <= this.x + 16 && this.y + 4 <= y && y <= this.y + 18) {
        this.mort = true;
        tue.play();
        tirs.pop();
      }
    }
  }
  verifFront() {
    let i = this.indice + 10;
    let front = true;
    while (invaders[i]) {
      if (invaders[i].mort == false) {
        front = false;
      }
      i += 10;
    }
    return front;
  }
  tirer() {
    let nouvTir = new tirInvader(this.x, this.y);
    tirsInvaders.push(nouvTir);
  }
}

class muraille {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.etat = 0;
  }
  afficher() {
    if (this.etat != 4) {
      image(imagesMuraille[this.etat], this.x, this.y, 16, 16);
    }
  }
  verifHit(x, y, type) {
    if (this.etat != 4) {
      if (this.x - 4 <= x && x <= this.x + 15 && this.y <= y && y <= this.y + 16) {
        this.etat++;
        crush.play();
        if (type == "humain") {
          tirs.pop();
        } else {
          tirsInvaders.pop();
        }

      }
    }
  }
}
