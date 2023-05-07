import PositionedCharacter from './PositionedCharacter';

import Bowman from './characters/Bowman';
import Daemon from './characters/Daemon';
import Magician from './characters/Magician';
import Swordsman from './characters/Swordsman';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';

import GamePlay from './GamePlay';
import { getMessage } from './utils';

import { generateTeam, getRandomInt } from './generators';
import cursors from './cursors';
import GameState from './GameState';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.gamePlay.gameCtrl = this;
    this.stateService = stateService;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService

    // признак окончания игры - прошли все уровни/темы
    /* if (this.gamePlay.currentTheme === this.gamePlay.themesArray.length) {
      this.gamePlay.gameOver = true;
      return;
    } */

    this.gamePlay.currentTheme += 1;
    if (this.gamePlay.currentTheme >= this.gamePlay.themesArray.length) {
      this.gamePlay.currentTheme = 0;
    }

    // Повышение уровня персонажа - не понятно условие задачи, что должно произойти с персонажами
    // если он остался один, то ему повышаем уровень, а двух других создаем новых?
    // Пока генерирую новые команды

    this.gamePlay.drawUi(this.gamePlay.themesArray[this.gamePlay.currentTheme]);
    this.gamePlay.counterCharacterPlayer1 = 3;
    this.gamePlay.counterCharacterPlayer2 = 3;
    this.gamePlay.roundGameOver = false;
    this.gamePlay.gameOver = false;

    const positionedCharacterArray = [];

    // команда 1
    // доступные классы игрока
    const playerTypes1 = [Bowman, Swordsman, Magician];
    // массив из 3 случайных персонажей playerTypes с уровнем 1, 2 или 3
    const team1 = generateTeam(playerTypes1, 3, 3);
    const indexArray1 = [];
    for (let i = 0; i < team1.length; i += 1) {
      const character = team1[i];
      let index = getRandomInt(16);

      // на случай совпадения случайного числа
      while (indexArray1.includes(index)) {
        index = getRandomInt(16);
      }
      indexArray1.push(index);
      const row = index % 8;
      const column = Math.floor(index / 8);
      // let position = 8 * (i+1) -1;
      // учесть случай, если совпадет ячейка - два персонажа в одну клетку?
      const position = 8 * row + column;
      const positionedCharacter = new PositionedCharacter(character, position);
      positionedCharacterArray.push(positionedCharacter);
    }

    // команда 2
    // доступные классы игрока
    const playerTypes2 = [Vampire, Undead, Daemon];
    // массив из 3 случайных персонажей playerTypes с уровнем 1, 2 или 3
    const team2 = generateTeam(playerTypes2, 3, 3);
    const indexArray2 = [];
    for (let i = 0; i < team2.length; i += 1) {
      const character = team2[i];
      // let row = getRandomInt(8);
      // let column = getRandomInt(2)
      let index = getRandomInt(16);
      // на случай совпадения случайного числа
      while (indexArray2.includes(index)) {
        index = getRandomInt(16);
      }
      indexArray2.push(index);
      const row = index % 8;
      const column = Math.floor(index / 8);
      // let position = 8 * (i+1) -1;
      // учесть случай, если совпадет ячейка - два персонажа в одну клетку?
      const position = 8 * row + (6 + column);

      const positionedCharacter = new PositionedCharacter(character, position);
      positionedCharacterArray.push(positionedCharacter);
    }

    // обнулить обработчики, если были ранее
    this.gamePlay.cellClickListeners = [];
    this.gamePlay.cellEnterListeners = [];
    this.gamePlay.cellLeaveListeners = [];
    this.gamePlay.newGameListeners = [];
    this.gamePlay.saveGameListeners = [];
    this.gamePlay.loadGameListeners = [];

    this.gamePlay.positionedCharacterArray = positionedCharacterArray;
    this.gamePlay.redrawPositions(positionedCharacterArray);

    this.gamePlay.addCellEnterListener(this.onCellEnter);
    this.gamePlay.addCellLeaveListener(this.onCellLeave);
    this.gamePlay.addCellClickListener(this.onCellClick);

    this.gamePlay.addNewGameListener(this.init);
    this.gamePlay.addSaveGameListener(this.saveGame);
    this.gamePlay.addLoadGameListener(this.loadGame);
  }

  saveGame() {
    const theme = this.gamePlay.currentTheme;
    const { scorePlayer1 } = this.gamePlay;
    const { scorePlayer2 } = this.gamePlay;
    const { positionedCharacterArray } = this.gamePlay;

    const { selectedIndex } = this.gamePlay;
    const { selectedCharacter } = this.gamePlay;

    const { counterCharacterPlayer1 } = this.gamePlay;
    const { counterCharacterPlayer2 } = this.gamePlay;

    const gameState = new GameState(
      theme,
      scorePlayer1,
      scorePlayer2,
      positionedCharacterArray,
      selectedIndex,
      selectedCharacter,
      counterCharacterPlayer1,
      counterCharacterPlayer2,
    );
    this.stateService.save(gameState);
  }

  loadGame() {
    const gameState = this.stateService.load();
    // console.log(gameState);
    this.gamePlay.currentTheme = gameState.theme;
    this.gamePlay.scorePlayer1 = gameState.scorePlayer1;
    this.gamePlay.scorePlayer2 = gameState.scorePlayer2;

    this.gamePlay.drawUi(this.gamePlay.themesArray[this.gamePlay.currentTheme]);
    this.gamePlay.counterCharacterPlayer1 = gameState.counterCharacterPlayer1;
    this.gamePlay.counterCharacterPlayer2 = gameState.counterCharacterPlayer2;
    this.gamePlay.roundGameOver = false;
    this.gamePlay.gameOver = false;

    this.gamePlay.selectedIndex = gameState.selectedIndex;
    this.gamePlay.selectedCharacter = gameState.selectedCharacter;
    if (this.gamePlay.selectedIndex > -1) {
      this.gamePlay.selectCell(this.gamePlay.selectedIndex);
    }

    this.gamePlay.positionedCharacterArray = gameState.positionedCharacterArray;
    this.gamePlay.redrawPositions(this.gamePlay.positionedCharacterArray);
  }

  onCellClick(index) {
    // TODO: react to click
    const { gamePlay } = this;
    if (gamePlay.gameOver === true) {
      return;
    }

    let isAttack = false;

    if (gamePlay.selectedCharacter) {
      const { allowableMove } = gamePlay.selectedCharacter;
      const { allowableAttack } = gamePlay.selectedCharacter;
      const rowI = index % 8;
      const columnI = Math.floor(index / 8);

      const rowSI = gamePlay.selectedIndex % 8;
      const columnSI = Math.floor(gamePlay.selectedIndex / 8);
      const countCells = Math.max(Math.abs(rowI - rowSI), Math.abs(columnI - columnSI));

      if (index !== gamePlay.selectedIndex) {
        let curPositionedCharacter = gamePlay.positionedCharacterArray.find(
          (positionedCharacter) => positionedCharacter.position === index,
        );
        const curIndexPositionedCharacter = gamePlay.positionedCharacterArray.findIndex(
          (positionedCharacter) => positionedCharacter.position === index,
        );
        if (curPositionedCharacter === undefined) {
          // ХОД ИГРОКА
          if (rowI === rowSI
              || columnI === columnSI
              || Math.abs(rowI - rowSI) === Math.abs(columnI - columnSI)) {
            if (countCells <= allowableMove) {
              // если ячейка свободная, занимаем её
              curPositionedCharacter = gamePlay.positionedCharacterArray.find(
                (positionedCharacter) => positionedCharacter.position === gamePlay.selectedIndex,
              );
              curPositionedCharacter.position = index;
              gamePlay.selectedIndexGreen = -1;

              gamePlay.deselectCell(gamePlay.selectedIndex);
              gamePlay.selectedIndex = index;
              gamePlay.selectCell(gamePlay.selectedIndex);

              gamePlay.redrawPositions(gamePlay.positionedCharacterArray);
              this.appMove();
            }
          }
        } else if (!['bowman', 'swordsman', 'magician'].includes(curPositionedCharacter.character.type)) {
          // АТАКА
          if (countCells <= allowableAttack) {
            // если есть возможность атаковать, то атакуем
            const damage = Math.max(
              gamePlay.selectedCharacter.attack - curPositionedCharacter.character.defence,
              gamePlay.selectedCharacter.attack * 0.1,
            ); // damage - урон
            curPositionedCharacter.character.health -= damage;
            if (curPositionedCharacter.character.health < 0) {
              curPositionedCharacter.character.health = 0;
            }
            // если здоровье персонажа = 0,
            // то удалить-убрать из массива позиционированных персонажей
            if (curPositionedCharacter.character.health === 0) {
              gamePlay.positionedCharacterArray.splice(curIndexPositionedCharacter, 1);

              gamePlay.counterCharacterPlayer2 -= 1;
              // окончание раунда - начать игру заново, повысить уровень пероснажей, сменить карту
              if (gamePlay.counterCharacterPlayer2 === 0) {
                gamePlay.roundGameOver = true;
                gamePlay.scorePlayer1 += 1; // раунд выиграл человек, увеличиваем его балл/оценку
                return;
              }
            }

            isAttack = true;
            // const promise = gamePlay.showDamage(index, damage);
            const promise = gamePlay.showDamage(index, damage);
            promise.then(() => {
              gamePlay.redrawPositions(gamePlay.positionedCharacterArray);
              this.appMove();
            });
          }
        }
      }
    }

    // выделение персонажа
    gamePlay.positionedCharacterArray.forEach((element) => {
      if (element.position === index) {
        const { character } = element;

        if (['bowman', 'swordsman', 'magician'].includes(character.type)) {
          if (gamePlay.selectedIndex >= 0) {
            gamePlay.deselectCell(gamePlay.selectedIndex);
          }
          gamePlay.selectCell(index);
          gamePlay.selectedIndex = index;
          gamePlay.selectedCharacter = character;
        } else if (!isAttack) {
          GamePlay.showError('Это не персонаж игрока (т.е. не Bowman, Swordsman или Magician).');
        }
      }
    });
  }

  appMove() {
    const { gamePlay } = this;
    // ===== Cделать ответные действия компьютера =====

    let curPositionedCharacterApp;
    let targetPositionedCharacter;
    gamePlay.positionedCharacterArray.forEach((element) => {
      const { character } = element;
      if (['bowman', 'swordsman', 'magician'].includes(character.type)) {
        // instanceof  | character instanceof Swordsman | character instanceof Magician) {
        if (targetPositionedCharacter === undefined) {
          targetPositionedCharacter = element;
        }
      } else if (curPositionedCharacterApp === undefined) {
        curPositionedCharacterApp = element;
      }
    });

    const indexApp = curPositionedCharacterApp.position;
    const allowableMoveApp = curPositionedCharacterApp.character.allowableMove;
    const allowableAttackApp = curPositionedCharacterApp.character.allowableAttack;

    const columnApp = indexApp % 8;
    const rowApp = Math.floor(indexApp / 8);
    const columnTarget = targetPositionedCharacter.position % 8;
    const rowTarget = Math.floor(targetPositionedCharacter.position / 8);

    const deltaRow = Math.abs(rowApp - rowTarget);
    const signRow = (rowApp > rowTarget) ? -1 : 1;
    const deltaColumn = Math.abs(columnApp - columnTarget);
    const signColumn = (columnApp > columnTarget) ? -1 : 1;

    // проверить возможность атаки
    const countCells = Math.max(Math.abs(rowApp - rowTarget), Math.abs(columnApp - columnTarget));
    // debugger;
    if (countCells > allowableAttackApp) {
      // ХОД КОМПЬЮТЕРА
      // передать ход человеку
      // gamePlay.isAppMove = false;

      let indexAppNew = indexApp;

      if (deltaRow === 0) {
        if (deltaColumn > 0) {
          const curMove = Math.min(deltaColumn, allowableMoveApp);
          // если новое положение совпало с другим персонажем, то сместить на -1
          let columnAppNew = columnApp + signColumn * curMove;
          indexAppNew = 8 * rowApp + columnAppNew;
          gamePlay.positionedCharacterArray.forEach((element) => {
            if (indexAppNew === element.position) {
              columnAppNew = columnApp + signColumn * (curMove - 1);
              indexAppNew = 8 * rowApp + columnAppNew;
            }
          });
        }
      } else {
        const curMove = Math.min(deltaRow, allowableMoveApp);
        // если новое положение совпало с другим персонажем, то сместить на -1
        let rowAppNew = rowApp + signRow * curMove;
        indexAppNew = 8 * rowAppNew + columnApp;
        gamePlay.positionedCharacterArray.forEach((element) => {
          if (indexAppNew === element.position) {
            rowAppNew = rowApp + signRow * (curMove - 1);
            indexAppNew = 8 * rowAppNew + columnApp;
          }
        });
      }

      // indexAppNew = 8 * rowApp + columnApp;

      // проверить, что на новом индексе нет персонажей

      curPositionedCharacterApp.position = indexAppNew;
      gamePlay.redrawPositions(gamePlay.positionedCharacterArray);
    } else {
      // АТАКА КОМПЬЮТЕРА НА КОМАНДУ ИГРОКА-ЧЕЛОВЕКА

      // передать ход человеку
      // gamePlay.isAppMove = false;

      const damageTarget = Math.max(
        curPositionedCharacterApp.character.attack - targetPositionedCharacter.character.defence,
        curPositionedCharacterApp.character.attack * 0.1,
      ); // damage - урон
      targetPositionedCharacter.character.health -= damageTarget;
      if (targetPositionedCharacter.character.health < 0) {
        targetPositionedCharacter.character.health = 0;
      }
      // needRedraw = true;
      // const promise = gamePlay.showDamage(index, damage);
      const promise2 = gamePlay.showDamage(targetPositionedCharacter.position, damageTarget);
      promise2.then(() => {
        gamePlay.redrawPositions(gamePlay.positionedCharacterArray);
      });

      // если здоровье персонажа = 0, то удалить-убрать из массива позиционированных персонажей
      if (targetPositionedCharacter.character.health === 0) {
        const targetIndexPositionedCharacter = gamePlay.positionedCharacterArray.findIndex(
          (pCharacter) => pCharacter.position === targetPositionedCharacter.position,
        );
        // если удаляется выделенный персонаж, то убрать выделение
        if (targetPositionedCharacter.character === gamePlay.selectedCharacter) {
          gamePlay.deselectCell(targetPositionedCharacter.position);
          gamePlay.selectedCharacter = null;
          gamePlay.selectedIndex = -1;
        }
        gamePlay.positionedCharacterArray.splice(targetIndexPositionedCharacter, 1);

        gamePlay.counterCharacterPlayer1 -= 1;
        // окончание раунда и игры, так как выиграл компьютер
        if (gamePlay.counterCharacterPlayer1 === 0) {
          gamePlay.roundGameOver = true;
          gamePlay.gameOver = true;
          gamePlay.scorePlayer2 += 1; // раунд выиграл компьютер, увеличиваем его балл/оценку
        }
      }
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    // debugger;
    const { gamePlay } = this;
    if (gamePlay.gameOver === true) {
      return;
    }

    // Если раунд завершен, то начать заново
    // После перехода на новый уровень смените тему игры (prairie -> desert -> arctic -> mountain)
    if (gamePlay.roundGameOver) {
      gamePlay.gameCtrl.init();
      gamePlay.roundGameOver = false;
    }

    if (gamePlay.isAppMove) {
      return;
    }

    gamePlay.setCursor(cursors.auto);
    if (gamePlay.selectedIndexGreen >= 0) {
      gamePlay.deselectCell(gamePlay.selectedIndexGreen);
      gamePlay.selectedIndexGreen = -1;
    }
    if (gamePlay.selectedIndexRed >= 0) {
      gamePlay.deselectCell(gamePlay.selectedIndexRed);
      gamePlay.selectedIndexRed = -1;
    }

    if (gamePlay.selectedCharacter) {
      const { allowableMove } = gamePlay.selectedCharacter;
      const rowI = index % 8;
      const columnI = Math.floor(index / 8);

      const rowSI = gamePlay.selectedIndex % 8;
      const columnSI = Math.floor(gamePlay.selectedIndex / 8);

      if (index !== gamePlay.selectedIndex) {
        const countCells = Math.max(Math.abs(rowI - rowSI), Math.abs(columnI - columnSI));
        if (rowI === rowSI
          || columnI === columnSI
          || Math.abs(rowI - rowSI) === Math.abs(columnI - columnSI)) {
          if (countCells <= allowableMove) {
            gamePlay.selectCell(index, 'green');
            gamePlay.selectedIndexGreen = index;
          }
        }

        gamePlay.positionedCharacterArray.forEach((element) => {
          if (element.position === index) {
            const { character } = element;// new Vampire(2);
            const message = getMessage(character);
            gamePlay.showCellTooltip(message, index);

            // установка курсора
            if (['bowman', 'swordsman', 'magician'].includes(character.type)) {
              gamePlay.setCursor(cursors.pointer);
              // gamePlay.selectCell(index, 'green');
            } else if (countCells <= gamePlay.selectedCharacter.allowableAttack) {
              gamePlay.setCursor(cursors.crosshair);
              gamePlay.selectCell(index, 'red');
              gamePlay.selectedIndexRed = index;
            } else {
              // console.log('cursors.notallowed');
              gamePlay.setCursor(cursors.notallowed);
            }
          }
        });
      }
    }
  }

  onCellLeave(index) {
    // debugger;
    if (this) {
      this.gamePlay.hideCellTooltip(index);
    }
  }
}
