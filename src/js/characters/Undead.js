import Character from '../Character';

// Undead - зомби, восставший из мертвых
export default class Undead extends Character {
  constructor(level) {
    super(level, 'undead');
    this.attack = 40;
    this.defence = 10;

    this.allowableMove = 1;
    this.allowableAttack = 4;
  }
}
