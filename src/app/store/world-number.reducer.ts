import { createReducer, on } from '@ngrx/store';

import { increment } from './world-number.actions';

export const initialState = 0;

export const worldNumberReducer = createReducer(
  initialState,
  on(increment, (worldNumber): number => worldNumber + 1)
);
