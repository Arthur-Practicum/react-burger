import { describe, it, expect } from 'vitest';

import reducer, {
  addIngredient,
  removeIngredient,
  addBun,
  moveIngredient,
  clearConstructor,
  initialState,
} from './index';

import type { Ingredient } from '@/types/ingredient';

const makeSauce = (id = '1'): Ingredient => ({
  _id: id,
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'sauce.png',
  image_large: 'sauce_large.png',
  image_mobile: 'sauce_mobile.png',
  __v: 0,
});

const makeMain = (id = '2'): Ingredient => ({
  _id: id,
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'main.png',
  image_large: 'main_large.png',
  image_mobile: 'main_mobile.png',
  __v: 0,
});

const makeBun = (id = '3'): Ingredient => ({
  _id: id,
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'bun.png',
  image_large: 'bun_large.png',
  image_mobile: 'bun_mobile.png',
  __v: 0,
});

describe('burgerConstructorSlice', () => {
  it('returns the initial state', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('addIngredient', () => {
    it('adds ingredient to the list with a generated uniqueKey', () => {
      const state = reducer(undefined, addIngredient(makeSauce()));

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]._id).toBe('1');
      expect(state.ingredients[0].uniqueKey).toBeDefined();
      expect(typeof state.ingredients[0].uniqueKey).toBe('string');
    });

    it('generates unique keys for identical ingredients added twice', () => {
      const sauce = makeSauce();
      let state = reducer(undefined, addIngredient(sauce));
      state = reducer(state, addIngredient(sauce));

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0].uniqueKey).not.toBe(state.ingredients[1].uniqueKey);
    });
  });

  describe('removeIngredient', () => {
    it('removes ingredient by its uniqueKey', () => {
      let state = reducer(undefined, addIngredient(makeSauce()));
      const { uniqueKey } = state.ingredients[0];

      state = reducer(state, removeIngredient(uniqueKey!));

      expect(state.ingredients).toHaveLength(0);
    });

    it('removes only the target ingredient and keeps others', () => {
      let state = reducer(undefined, addIngredient(makeSauce()));
      state = reducer(state, addIngredient(makeMain()));
      const firstKey = state.ingredients[0].uniqueKey!;

      state = reducer(state, removeIngredient(firstKey));

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]._id).toBe('2');
    });

    it('does nothing when uniqueKey does not match any ingredient', () => {
      let state = reducer(undefined, addIngredient(makeSauce()));
      state = reducer(state, removeIngredient('non-existent-key'));

      expect(state.ingredients).toHaveLength(1);
    });
  });

  describe('addBun', () => {
    it('sets the bun', () => {
      const bun = makeBun();
      const state = reducer(undefined, addBun(bun));

      expect(state.bun).toEqual(bun);
    });

    it('replaces the existing bun with a new one', () => {
      let state = reducer(undefined, addBun(makeBun('3')));
      state = reducer(state, addBun(makeBun('99')));

      expect(state.bun?._id).toBe('99');
    });
  });

  describe('moveIngredient', () => {
    it('moves ingredient forward in the list', () => {
      let state = reducer(undefined, addIngredient(makeSauce()));
      state = reducer(state, addIngredient(makeMain()));

      state = reducer(state, moveIngredient({ fromIndex: 0, toIndex: 1 }));

      expect(state.ingredients[0]._id).toBe('2');
      expect(state.ingredients[1]._id).toBe('1');
    });

    it('moves ingredient backward in the list', () => {
      let state = reducer(undefined, addIngredient(makeSauce()));
      state = reducer(state, addIngredient(makeMain()));

      state = reducer(state, moveIngredient({ fromIndex: 1, toIndex: 0 }));

      expect(state.ingredients[0]._id).toBe('2');
      expect(state.ingredients[1]._id).toBe('1');
    });

    it('preserves all ingredients after move', () => {
      let state = reducer(undefined, addIngredient(makeSauce('a')));
      state = reducer(state, addIngredient(makeMain('b')));
      state = reducer(state, addIngredient(makeSauce('c')));

      state = reducer(state, moveIngredient({ fromIndex: 2, toIndex: 0 }));

      expect(state.ingredients).toHaveLength(3);
      expect(state.ingredients[0]._id).toBe('c');
      expect(state.ingredients[1]._id).toBe('a');
      expect(state.ingredients[2]._id).toBe('b');
    });
  });

  describe('clearConstructor', () => {
    it('resets ingredients and bun to initial values', () => {
      let state = reducer(undefined, addBun(makeBun()));
      state = reducer(state, addIngredient(makeSauce()));
      state = reducer(state, addIngredient(makeMain()));

      state = reducer(state, clearConstructor());

      expect(state.ingredients).toEqual([]);
      expect(state.bun).toBeNull();
    });
  });
});
