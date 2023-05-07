import { calcTileType } from '../utils';

test('test tile type top-left', () => {
  const index = 0;
  const boardSize = 8;
  const tileType = calcTileType(index, boardSize);
  const tileTypeExpect = 'top-left';
  expect(tileType).toBe(tileTypeExpect);
});

test('test calc tile type left', () => {
  const index = 8;
  const boardSize = 8;
  const tileType = calcTileType(index, boardSize);
  const tileTypeExpect = 'left';
  expect(tileType).toBe(tileTypeExpect);
});
