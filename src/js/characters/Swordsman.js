import Character from '../Character';

// Swordsman - Мечник
export default class Swordsman extends Character {
  constructor(level) {
    super(level, 'swordsman');
    this.attack = 40;
    this.defence = 10;

    this.allowableMove = 4;
    this.allowableAttack = 1;
  }
}
