import Character from '../Character';

// Vampire - вампир
export default class Vampire extends Character {
  constructor(level) {
    super(level, 'vampire');
    this.attack = 25;
    this.defence = 25;

    this.allowableMove = 2;
    this.allowableAttack = 2;
  }
}
