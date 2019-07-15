const width = 600;
const height = 400;
const pas = 7;
const pasInvader = 2;
const tailleVaisseau = 20;
const largeurTir = 5;
const hauteurTir = 5;
const decalage = 30;
const frontiere = 60;
const largeurMuraille = 70;
const hauteurMuraille = 30;

let tirs = [];
let invaders = [];
let murailles = [];

let compteur = 0;
let compteur2 = 0;
let decalageInvader = 6;
let alterneur = -1;

function preload() {
  poup = loadSound('poup.mp3');
  invader1 = loadImage('invader1.png');
  invader2 = loadImage('invader2.png');
}

function setup() {
  createCanvas(width, height);
  starship0 = new vaisseau;
  creerInvaders();
  construireMuraille();
}

function draw() {
  background(0, 0, 50);

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
    for (let elt of invaders) {
      elt.verifHit(tempX, tempY);
    }
  }
  for (let elt of invaders) {
    elt.afficher();
  }
  deplacerInvaders();

}

function construireMuraille() {
  let i = 300;
  let j = 64;
  let c = 0;

  while (j < width) {
    for (let c1 = i; c1 < hauteurMuraille + i; c1 += 8) {
      for (let c2 = j; c2 < largeurMuraille + j; c2 += 8) {
        nouvBloc = new muraille(c2, c1);
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
    //poup.play();
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
      nouvTir = new tir(starship0.x + tailleVaisseau / 2);
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
}

function creerInvaders() {
  let xTemp = frontiere;
  let yTemp = 50;
  while (yTemp < 250) {
    while (xTemp < 444) {
      nouvInvader = new invader(xTemp, yTemp);
      invaders.push(nouvInvader);
      xTemp += 40;
    }
    yTemp += 50;
    xTemp = frontiere;
  }
}

class vaisseau {
  constructor() { //fonction constructrice
    this.x = width / 2
    this.taille = tailleVaisseau;
  }
  afficher() {
    let x = this.x;
    rect(x - this.taille / 2, height - this.taille, this.taille, this.taille);
  }
  deplacer() {
    if (keyIsDown(LEFT_ARROW) && starship0.x > 0 + this.taille) {
      starship0.x -= pas;
    } else if (keyIsDown(RIGHT_ARROW) && starship0.x < width - this.taille) {
      starship0.x += pas;
    }
  }
}

class tir {
  constructor(x) { //fonction constructrice
    this.x = x - tailleVaisseau / 2 - largeurTir / 2;
    this.y = height - tailleVaisseau - hauteurTir;
  }
  afficher() {
    rect(this.x, this.y, largeurTir, hauteurTir);
  }
  deplacer() {
    this.y -= 10;
  }
}

class invader {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.mort = false;
  }
  afficher() {
    if (!this.mort) {
      if (alterneur == -1) {
        image(invader1, this.x, this.y);
      }
      else {
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
        tirs.pop();
      }
    }
  }
}


class muraille {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.detruit = false;
  }
  afficher() {
    stroke(100);
    rect(this.x, this.y, 8, 8);
  }
}
