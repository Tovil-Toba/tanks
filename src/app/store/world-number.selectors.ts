import { createFeatureSelector } from '@ngrx/store';

export const selectWorldNumber = createFeatureSelector<number>('worldNumber');
