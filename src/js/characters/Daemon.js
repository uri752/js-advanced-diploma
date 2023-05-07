import Character from '../Character';

// Daemon - демон
export default class Daemon extends Character {
  constructor(level) {
    super(level, 'daemon');
    this.attack = 10;
    this.defence = 10;

    this.allowableMove = 4;
    this.allowableAttack = 1;
  }
}
