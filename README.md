# AtelierJavascript

## A savoir

* Jeu en ligne : https://meavela.github.io/AtelierJavascript/

## Comment jouer ?

* Pour bouger : flèches gauche/droite
* Pour tirer : barre d'espace

## Les éléments du jeu

### Les ennemies

* L'ennemie "normal" : rapporte 1 point quand est tué
* L'ennemie "bonus" : rapporte 2 points quand est tué et fait apparaître un bonus
*  L'ennemie "dangereux" : rapporte 3 points quand est tué, essaye de tuer et apparaît lorsqu'un ennemie "bonus" est tué

### Les bonus

* Le bonus "speedshoot" : augmente la cadence de tir du vaisseau
* Le bonus "speedship" : augmente la vitesse de déplacement du vaisseau
* Le bonus "addshoot" : augmente de 1 le nombre de shoot à chaque tir (limite à 4 shoot par tir)

## Comment gagner ?

C'est un jeu "infini", le but est d'accumuler des points.

## Comment perdre ?

* Un ennemie "dangereux" touche le vaisseau grâce à un tir
* Lors d'une collision entre le vaisseau et un ennemie, quelque soit son type
* Lorsqu'un ennemie touche la bordure du bas

## Le score

* Pendant la partie, le score est affiché en haut à gauche
* A la fin de chaque partie, le score est enregistré avec le nom du joueur et est affiché en dessous du jeu. Le classement est effectué en fonction de la personne qui a fait le plus de points. Il est ensuite possible de comparer son classement avec les autres joueurs