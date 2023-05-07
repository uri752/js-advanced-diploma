export default class GameState {
  static from(object) {
    // TODO: create object
    return null;
  }

  constructor(
    theme,
    scorePlayer1,
    scorePlayer2,
    positionedCharacterArray,
    selectedIndex,
    selectedCharacter,
    counterCharacterPlayer1,
    counterCharacterPlayer2,
  ) {
    this.theme = theme;
    this.scorePlayer1 = scorePlayer1;
    this.scorePlayer2 = scorePlayer2;
    this.positionedCharacterArray = positionedCharacterArray;

    this.selectedIndex = selectedIndex;
    this.selectedCharacter = selectedCharacter;

    this.counterCharacterPlayer1 = counterCharacterPlayer1;
    this.counterCharacterPlayer2 = counterCharacterPlayer2;
  }
}
