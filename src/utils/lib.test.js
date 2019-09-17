import * as lib from './lib';
import * as R from 'ramda';
import paper from './paperData';
test('字母表', () => {
  let alpha = lib.alphaRange;
  expect(R.head(alpha)).toBe('A');
  expect(R.last(alpha)).toBe('Z');
});

test('表单结构处理', () => {
  let paper = [
    {
      title: 'a',
      data: ` b
    c`,
    },
  ];
  expect(lib.handlePaper(paper)).toMatchObject([
    {
      title: 'a',
      data: ['b', 'c'],
    },
  ]);
  expect(
    lib.handlePaper([
      {
        title: 'a',
        data: ['b', 'c'],
        subTitle: ` b
    c`,
      },
    ]),
  ).toMatchObject([
    {
      title: 'a',
      data: ['b', 'c'],
      subTitle: ['b', 'c'],
    },
  ]);
});

test('答案转换', () => {
  expect(lib.parseAnswer(['0'], 0)).toBe(' ( A ) ');
  expect(lib.parseAnswer([['0', '1']], 0)).toBe(' ( A,B ) ');
  expect(lib.parseAnswer([['0', '1']], 1)).toBe(' (  ) ');
});

test('多选答案处理', () => {
  expect(lib.handleMultipleChange([['0', '1']], 0, 0)).toMatchObject([['1']]);
  expect(lib.handleMultipleChange([['0', '1']], 3, 0)).toMatchObject([['0', '1', '3']]);
  expect(lib.handleMultipleChange([['0', '1']], 3, 3)).toMatchObject([
    ['0', '1'],
    undefined,
    undefined,
    ['3'],
  ]);
  expect(lib.handleMultipleChange([['0', '1'], '1'], 3, 1)).toMatchObject([['0', '1'], '3']);
  expect(lib.handleMultipleChange([['0', '3']], 1, 0, false)).toMatchObject([['0', '3', '1']]);
  expect(lib.handleMultipleChange([['0', '1', '2']], 2, 0, false, 2, 2)).toMatchObject([
    ['0', '1'],
  ]);
});

test('ymd', () => {
  expect(lib.now()).toHaveLength(19);
  expect(lib.ymd()).toHaveLength(8);
});

test('数据转换', () => { 

test('store存储测试', () => {
  expect(lib.setStore({ a: 1 }, { payload: { b: 2 } })).toEqual({
    a: 1,
    b: 2,
  });
  expect(lib.setStore({ a: 1 }, { payload: { b: 2, c: 2 } })).toEqual({
    a: 1,
    b: 2,
    c: 2,
  });
  expect(lib.setStore({ a: 1 }, { payload: { a: 2 } })).toEqual({ a: 2 });

  expect(lib.setStore({ a: { b: 2 } }, { payload: { a: { b: 3, c: 2 } } })).toEqual({
    a: { b: 3, c: 2 },
  });

  // throw error报错
  // expect(lib.setStore({ a: 1 }, { b: 2 })).toThrow(/payload/);
  expect(lib.setStore({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
});
