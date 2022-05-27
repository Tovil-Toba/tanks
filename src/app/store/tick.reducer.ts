import { createReducer, on } from '@ngrx/store';

import { increment } from './tick.actions';

export const initialState = 0;

export const tickReducer = createReducer(
  initialState,
  on(increment, (tick): number => tick + 1)
);
