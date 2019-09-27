//https://fr.wikipedia.org/wiki/Algorithme_de_Prim
/*L'algorithme consiste à faire croître un arbre depuis un sommet. On commence avec un seul
sommet puis à chaque étape, on ajoute une arête de poids minimum ayant exactement une extrémité
dans l'arbre en cours de construction. En effet, si ses deux extrémités appartenaient déjà à
l'arbre, l'ajout de cette arête créerait un deuxième chemin entre les deux sommets dans l'arbre
en cours de construction et le résultat contiendrait un cycle.*/

let pointsNonRelies = [];
let pointsRelies = [];

function setup() {
  createCanvas(600, 600);
  reset();
}

function draw() {
  if (pointsNonRelies.length > 0) {
    relier();
  }
  for (let elt of pointsRelies) {
    stroke(0);
    strokeWeight(2);
    circle(elt.x, elt.y, 15);
  }
}

function mousePressed() {
  reset();
  pt = createVector(mouseX, mouseY);
  pointsNonRelies.push(pt);
}

function relier() {
  if (pointsRelies.length == 0) {
    let n = floor(random(0, pointsRelies.length));
    pointsRelies.push(pointsNonRelies[n]);
    pointsNonRelies.splice(n, 1);
  }
  while (pointsNonRelies.length > 0) {
    let min = height;
    let indiceI;
    let indiceJ;
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
    stroke(255, 0, 0);
    strokeWeight(3);
    line(pointsRelies[indiceI].x, pointsRelies[indiceI].y, pointsNonRelies[indiceJ].x, pointsNonRelies[indiceJ].y);
    pointsRelies.push(pointsNonRelies[indiceJ]);
    pointsNonRelies.splice(indiceJ, 1);
  }
}

function reset() {
  background(200);
  pointsNonRelies = pointsRelies;
  pointsRelies = [];
}
