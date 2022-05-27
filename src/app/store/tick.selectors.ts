import { createFeatureSelector } from '@ngrx/store';

export const selectTick = createFeatureSelector<number>('tick');
