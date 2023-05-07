import Character from '../Character';

// Bowman - лучник
export default class Bowman extends Character {
  constructor(level) {
    super(level, 'bowman');
    this.attack = 25;
    this.defence = 25;

    this.allowableMove = 2;
    this.allowableAttack = 2;
  }
}
