const width = 800;
const height = 500;

let immeubles = [];
let nuages = [];
let smiles = [];
let chances = [];

let progressionNuages;
let progressionImmeubles = 0;
let compteur = 0;
let couleur;
let score = 0;
let perdu = false;

let risitas;

function preload() {
  nuage = loadImage('nuage.png');
  imgRisitas = loadImage('risitas.png');
  imgChance = loadImage('pas_chance.png');
  imgSmile = loadImage('smile.png');
}

function setup() {
  createCanvas(width, height);
  progressionNuages = random(10, 90);
  couleur = [random(0, 155), random(0, 155), random(0, 155)];
  ellipseMode(CENTER);
  rectMode(CORNER);
  risitas = new Risitas;

}

function draw() {
  if (!perdu) {
    afficherPaysage();
    genererNuages();
    genererImmeubles();
    genererObjets();
    risitas.verifHit();
    for (let elt of immeubles) {
      elt.afficher();
    }
    for (let elt of nuages) {
      elt.afficher();
    }
    for (let elt of chances) {
      elt.afficher();
    }
    for (let elt of smiles) {
      elt.afficher();
    }
    risitas.bouger();
    risitas.afficher();
    deplacerPaysage();
    purge();
  }
}

function afficherPaysage() {
  background(70, 150, 200);
  noStroke();
  fill(150);
  rect(0, 400, width, 100); //route
}

function genererNuages() {
  while (progressionNuages < width + 150) {
    let y = random(50, 150);
    let nouvNuage = new Nuage(progressionNuages, y);
    nuages.push(nouvNuage);
    progressionNuages += random(100, 150);;
  }
}

function genererImmeubles() {
  while (progressionImmeubles < width + 100) {
    let largeur = random(50, 100);
    let hauteur = random(100, 200);
    let nouvImmeuble = new Immeuble(progressionImmeubles, largeur, hauteur);
    immeubles.push(nouvImmeuble);
    progressionImmeubles += largeur;
  }
}

function genererObjets() {
  if (compteur == 30) {
    if (random(1) < 0.3) {
      let nouvSmile = new Smile();
      smiles.push(nouvSmile);
    } else {
      let nouvChance = new Chance();
      chances.push(nouvChance);
    }
    compteur = 0;
  } else {
    compteur++;
  }
}

function deplacerPaysage() {
  progressionImmeubles -= 2;
  progressionNuages -= 1;
  for (let elt of immeubles) {
    elt.deplacer();
  }
  for (let elt of nuages) {
    elt.deplacer();
  }
  for (let elt of chances) {
    elt.deplacer();
  }
  for (let elt of smiles) {
    elt.deplacer();
  }
}

function purge() {
  let continuer = true;
  while (continuer) {
    if (immeubles[0].x < -100) {
      immeubles.shift();
    } else {
      continuer = false;
    }
  }
  continuer = true;
  while (continuer) {
    if (nuages[0].x < -60) {
      nuages.shift();
    } else {
      continuer = false;
    }
  }

  if (smiles.length > 0) {
    continuer = true;
    while (continuer) {
      if (smiles[0].x < -70) {
        smiles.shift();
      } else {
        continuer = false;
      }
    }
  }

  if (chances.length > 0) {
    continuer = true;
    while (continuer) {
      if (chances[0].x < -70) {
        chances.shift();
      } else {
        continuer = false;
      }
    }
  }
}



function mousePressed() {
  risitas.sauter();
}


class Immeuble {
  constructor(x, largeur, hauteur, couleur) {
    this.x = x;
    this.y = 400;
    this.largeur = largeur;
    this.hauteur = hauteur;
  }
  afficher() {
    fill(couleur[0], couleur[1], couleur[2]);
    stroke(0);
    rect(this.x, this.y, this.largeur, -this.hauteur);
  }
  deplacer() {
    this.x -= 2;
  }
}

class Nuage {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  afficher() {
    image(nuage, this.x, this.y);
  }
  deplacer() {
    this.x -= 1;
  }

}

class Risitas {
  constructor() {
    this.x = 50;
    this.y = height - 100;
    this.vy = 0;
    this.gravite = 1;
    this.image = imgRisitas;
  }
  afficher() {
    image(imgRisitas, this.x, this.y);
    noFill();
    rect(this.x, this.y + 20, 60, 40);
    ellipse(this.x + 30, this.y + 30, 60);
    ellipse(this.x + 30, this.y + 80, 40);
  }
  sauter() {
    this.vy = -15;
  }
  bouger() {
    if (this.vy != 0 || this.y != 50) {
      this.y += this.vy;
      this.vy += this.gravite;
      this.y = constrain(this.y, 0, height - 100);
    }
  }
  verifHit() {
    for (let i = 0; i < smiles.length; i++) {
      let hitSmile = smiles[i].hitbox();
      if (
      collideCircleCircle(this.x + 30, this.y + 30, 60, hitSmile[0], hitSmile[1], hitSmile[2]) ||
      collideCircleCircle(this.x + 30, this.y + 80, 40, hitSmile[0], hitSmile[1], hitSmile[2]) ||
      collideRectCircle(this.x, this.y + 20, 60, 40, hitSmile[0], hitSmile[1], hitSmile[2])
      ) {
        score++;
        smiles.splice(i, 1);
      }
    }
    for (let i = 0; i < chances.length; i++) {
      let hitChance = chances[i].hitbox();
      if (
      collideCircleCircle(this.x + 30, this.y + 30, 60, hitChance[0], hitChance[1], hitChance[2]) ||
      collideCircleCircle(this.x + 30, this.y + 80, 40, hitChance[0], hitChance[1], hitChance[2]) ||
      collideRectCircle(this.x, this.y + 20, 60, 40, hitChance[0], hitChance[1], hitChance[2])
      ) {
        perdu = true;
        chances.splice(i, 1);
      }
    }
  }
}

class Chance {
  constructor() {
    this.x = width;
    this.y = random(0, height - 70);
    this.image = imgChance;
  }
  afficher() {
    image(this.image, this.x, this.y);
    noFill();
    ellipse(this.x + 35, this.y + 35,70);
  }
  deplacer() {
    this.x += -5;
  }
  hitbox() {
    return [this.x + 35, this.y + 35,70];
  }
}

class Smile {
  constructor() {
    this.x = width;
    this.y = random(0, height - 70);
    this.image = imgSmile;
  }
  afficher() {
    image(this.image, this.x, this.y);
    noFill();
    ellipse(this.x + 35, this.y + 35,70);
  }
  deplacer() {
    this.x += -5;
  }
  hitbox() {
    return [this.x + 35, this.y + 35,70];
  }
}
