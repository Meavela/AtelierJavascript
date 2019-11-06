# AtelierJavascript

## A savoir

* Jeu en ligne : https://meavela.github.io/AtelierJavascript/

## Comment jouer ?

* Pour bouger : flèches gauche/droite
* Pour tirer : barre d'espace

## Les éléments du jeu

### Les ennemis

* L'ennemi "normal"
* L'ennemi "bonus" (fait apparaître un bonus)
* L'ennemi "dangereux" (apparaît lorsqu'un ennemi "bonus" est tué)

### Les bonus

* Le bonus "speedshoot" : augmente la cadence de tir du vaisseau
* Le bonus "speedship" : augmente la vitesse de déplacement du vaisseau
* Le bonus "addshoot" : augmente de 1 le nombre de shoot à chaque tir (limite à 4 shoot par tir)

## Comment gagner ?

C'est un jeu "infini", le but est d'accumuler des points.

## Comment perdre ?

* Un ennemi "dangereux" touche le vaisseau grâce à un tir
* Lors d'une collision entre le vaisseau et un ennemi, quelque soit son type
* Lorsqu'un ennemi touche la bordure du bas

## Le score

### Comment gagner des points ?

* L'ennemi "normal" : 1 point
* L'ennemi "bonus" : 2 points
* L'ennemi "dangereux" : 3 points

### Affichage du score 

* Pendant la partie, le score est affiché en haut à gauche
* A la fin de chaque partie, le score est enregistré avec le nom du joueur et est affiché en dessous du jeu. Le classement est effectué en fonction de la personne qui a fait le plus de points. Il est ensuite possible de comparer son classement avec les autres joueurs