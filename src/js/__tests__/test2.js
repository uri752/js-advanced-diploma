import Character from '../Character';
import Daemon from '../characters/Daemon';
import Undead from '../characters/Undead';
import Vampire from '../characters/Vampire';
import { characterGenerator, generateTeam } from '../generators';

// 1. Напишите тесты на то, что исключение выбрасывается при создании
// объекта класса Character и не выбрасывается при создании объектов унаследованных классов
test('test for Character', () => {
  function newCharacter() {
    new Character();
  }

  const resultExpect = new Error('Запрещено создавать персонажа базового класса');
  expect(newCharacter).toThrow(resultExpect);
});

test('test for Vampire', () => {
  function newCharacter() {
    new Vampire(1);
  }

  const resultExpect = new Error('Запрещено создавать персонажа базового класса');
  expect(newCharacter).not.toThrow(resultExpect);
});

// 2. Проверьте, правильные ли характеристики содержат создаваемые персонажи 1-ого уровня
test('test property of Vampire level 1', () => {
  const result = new Vampire(1);

  const resultExpect = {
    level: 1,
    attack: 25,
    defence: 25,
    health: 50,
    type: 'vampire',
    allowableAttack: 2,
    allowableMove: 2
  };
  expect(result).toEqual(resultExpect);
});

// 3. Проверьте, выдаёт ли генератор characterGenerator
// бесконечно новые персонажи из списка (учёт аргумента allowedTypes)
test('test characterGenerator', () => {
  const maxIndex = 100;
  const arrayCharacters = [];
  const allowedTypes = [Vampire, Undead, Daemon];
  for (let i = 0; i < maxIndex; i += 1) {
    const newCharacter = characterGenerator(allowedTypes, 3);
    arrayCharacters.push(newCharacter);
  }

  expect(arrayCharacters.length).toBe(maxIndex);
});

// 4. Проверьте, в нужном ли количестве и диапазоне уровней
// (учёт аргумента maxLevel) создаются персонажи при вызове generateTeam
test('test generateTeam maxLevel', () => {
  const maxLevel = 3;
  const team = generateTeam([Vampire, Daemon, Undead], 3, 5);
  const max = team.reduce((acc, cur) => (acc.level > cur.level ? acc : cur));
  expect(max.level).toBeLessThanOrEqual(maxLevel);
});
