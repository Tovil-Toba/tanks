import { map, Observable, take, timer } from 'rxjs';

import defaultSettings from '../core/default-settings';
import { DirectionEnum } from './direction.enum';

const INTERVAL = defaultSettings.interval;

export type rotateCallback = (direction: DirectionEnum, isRotating: boolean) => void;

export const rotate = (
  directions: Array<DirectionEnum>,
  callback: rotateCallback,
  interval: number = defaultSettings.interval
): void => {
  const directions$: Observable<DirectionEnum> = timer(0, interval)
    .pipe(
      take(directions.length),
      map((i) => directions[i])
    )
  ;

  const subscription = directions$.subscribe((direction) => {
    const isRotating = direction !== directions[directions.length - 1];
    callback(direction, isRotating);

    if (!isRotating) {
      subscription.unsubscribe();
    }
  });
};


// UP

export const downUp = (callback: rotateCallback, interval: number = INTERVAL): void => {
  const directions: Array<DirectionEnum> = [
    DirectionEnum.DownLeft,
    DirectionEnum.Left,
    DirectionEnum.UpLeft,
    DirectionEnum.Up
  ];

  rotate(directions, callback, interval);
};

export const leftUp = (callback: rotateCallback, interval: number = INTERVAL): void => {
  const directions: Array<DirectionEnum> = [
    DirectionEnum.UpLeft,
    DirectionEnum.Up
  ];

  rotate(directions, callback, interval);
};

export const rightUp = (callback: rotateCallback, interval: number = INTERVAL): void => {
  const directions: Array<DirectionEnum> = [
    DirectionEnum.UpRight,
    DirectionEnum.Up
  ];

  rotate(directions, callback, interval);
};


// LEFT

export const upLeft = (callback: rotateCallback, interval: number = INTERVAL): void => {
  const directions: Array<DirectionEnum> = [
    DirectionEnum.UpLeft,
    DirectionEnum.Left
  ];

  rotate(directions, callback, interval);
};

export const downLeft = (callback: rotateCallback, interval: number = INTERVAL): void => {
  const directions: Array<DirectionEnum> = [
    DirectionEnum.DownLeft,
    DirectionEnum.Left
  ];

  rotate(directions, callback, interval);
};

export const rightLeft = (callback: rotateCallback, interval: number = INTERVAL): void => {
  const directions: Array<DirectionEnum> = [
    DirectionEnum.DownRight,
    DirectionEnum.Down,
    DirectionEnum.DownLeft,
    DirectionEnum.Left
  ];

  rotate(directions, callback, interval);
};


// RIGHT

export const upRight = (callback: rotateCallback, interval: number = INTERVAL): void => {
  const directions: Array<DirectionEnum> = [
    DirectionEnum.UpRight,
    DirectionEnum.Right
  ];

  rotate(directions, callback, interval);
};

export const downRight = (callback: rotateCallback, interval: number = INTERVAL): void => {
  const directions: Array<DirectionEnum> = [
    DirectionEnum.DownRight,
    DirectionEnum.Right
  ];

  rotate(directions, callback, interval);
};

export const leftRight = (callback: rotateCallback, interval: number = INTERVAL): void => {
  const directions: Array<DirectionEnum> = [
    DirectionEnum.UpLeft,
    DirectionEnum.Up,
    DirectionEnum.UpRight,
    DirectionEnum.Right
  ];

  rotate(directions, callback, interval);
};


// DOWN

export const leftDown = (callback: rotateCallback, interval: number = INTERVAL): void => {
  const directions: Array<DirectionEnum> = [
    DirectionEnum.DownLeft,
    DirectionEnum.Down
  ];

  rotate(directions, callback, interval);
};

export const rightDown = (callback: rotateCallback, interval: number = INTERVAL): void => {
  const directions: Array<DirectionEnum> = [
    DirectionEnum.DownRight,
    DirectionEnum.Down
  ];

  rotate(directions, callback, interval);
};

export const upDown = (callback: rotateCallback, interval: number = INTERVAL): void => {
  const directions: Array<DirectionEnum> = [
    DirectionEnum.UpRight,
    DirectionEnum.Right,
    DirectionEnum.DownRight,
    DirectionEnum.Down
  ];

  rotate(directions, callback, interval);
};
