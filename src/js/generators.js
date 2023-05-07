/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */

export function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here

  // генерируем случайный тип и уровень по входным параметрам
  const typeIndex = getRandomInt(allowedTypes.length);
  const level = getRandomInt(maxLevel) + 1; // level от 1 до 4

  // debugger;
  // вызываем создание экземпляра заданного класса заданного уровня
  const character = new allowedTypes[typeIndex](level);

  yield character;
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей.
 * Количество персонажей в команде - characterCount
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const team = [];
  for (let i = 0; i < characterCount; i += 1) {
    const character = characterGenerator(allowedTypes, maxLevel).next().value;
    team.push(character);
  }
  return team;
}
