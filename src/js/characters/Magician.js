import Character from '../Character';

// Magician - Маг, волшебник
export default class Magician extends Character {
  constructor(level) {
    super(level, 'magician');
    this.attack = 10;
    this.defence = 40;

    this.allowableMove = 1;
    this.allowableAttack = 4;
  }
}
