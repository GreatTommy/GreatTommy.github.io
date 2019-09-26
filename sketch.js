//https://fr.wikipedia.org/wiki/Algorithme_de_Prim
/*L'algorithme7 consiste à faire croître un arbre depuis un sommet. On commence avec un seul
sommet puis à chaque étape, on ajoute une arête de poids minimum ayant exactement une extrémité
dans l'arbre en cours de construction. En effet, si ses deux extrémités appartenaient déjà à
l'arbre, l'ajout de cette arête créerait un deuxième chemin entre les deux sommets dans l'arbre
en cours de construction et le résultat contiendrait un cycle.*/

let pointsNonRelies = [];
let pointsRelies = [];

function setup() {
  createCanvas(600, 600);
}

function draw() {
  background(200);
  if (pointsNonRelies.length > 0) {
    relier();
  }
  for (let elt of pointsRelies) {
    elt.afficher();
    elt.afficherLien();
  }
}

function mousePressed() {
  reset();
  pt = new Point(mouseX, mouseY);
  pointsNonRelies.push(pt);
}

function relier() {
  if (pointsRelies.length == 0) {
    let n = floor(random(0, pointsRelies.length));
    pointsRelies.push(pointsNonRelies[n]);
    pointsNonRelies.splice(n, 1);
  }
  let min = height;
  let indiceI = -1;
  let indiceJ = -1;
  let distance;
  for (let i = 0; i < pointsRelies.length; i++) {
    for (let j = 0; j < pointsNonRelies.length; j++) {
      distance = dist(pointsRelies[i].x, pointsRelies[i].y, pointsNonRelies[j].x, pointsNonRelies[j].y);
      if (distance < min) {
        min = distance;
        indiceI = i;
        indiceJ = j;
      }
    }
  }
  if (indiceI != -1 && indiceJ != -1) {
    pointsNonRelies[indiceJ].indiceVoisin = indiceI;
    pointsRelies.push(pointsNonRelies[indiceJ]);
    pointsNonRelies.splice(indiceJ, 1);
  }
}

function reset() {
  pointsNonRelies = pointsRelies;
  pointsRelies = [];
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.indiceVoisin = 0;
  }
  afficher() {
    stroke(0);
    strokeWeight(2);
    circle(this.x, this.y, 15);
  }
  afficherLien() {
    stroke(255, 0, 0);
    strokeWeight(3);
    line(this.x, this.y, pointsRelies[this.indiceVoisin].x, pointsRelies[this.indiceVoisin].y);
  }
}
