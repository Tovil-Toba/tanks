import { Injectable } from '@angular/core';

import { randomIntFromInterval } from '../shared/utils';
import { SettingsService } from '../core/settings.service';
import { Square } from './square/square.model';
import { SquareTypeEnum } from './square/square-type.enum';
import { TankIndex, TANKS_INDEXES } from '../tank/tank-index.model';
import { TanksCoordinates } from './shared/tanks-coordinates.model';

@Injectable({
  providedIn: 'root'
})
export class WorldService {
  directionSquares: Array<Square>;
  impactSquares?: Array<Square>;
  impactTanksIndexes: Array<TankIndex>;
  readonly squares: Array<Square>;
  readonly tanksCoordinates: TanksCoordinates;

  private readonly squareTypes: Array<SquareTypeEnum> = [
    // SquareTypeEnum.Barrel,
    SquareTypeEnum.Block,
    SquareTypeEnum.Block,
    // SquareTypeEnum.Cactus,
    SquareTypeEnum.Empty,
    SquareTypeEnum.Empty,
    SquareTypeEnum.Empty,
    SquareTypeEnum.Hedgehog,
    // SquareTypeEnum.Rock,
    // SquareTypeEnum.Stump,
    // SquareTypeEnum.Tree,
    // SquareTypeEnum.Well
  ];

  constructor(private settings: SettingsService) {
    this.directionSquares = new Array<Square>();
    this.impactTanksIndexes = new Array<TankIndex>();
    this.squares = new Array<Square>();
    const initialCoordinates = { top: 0, right: settings.squareSize, bottom: settings.squareSize, left: 0 };
    this.tanksCoordinates = {
      0: initialCoordinates,
      1: initialCoordinates,
      2: initialCoordinates,
      3: initialCoordinates
    };
  }

  getRandomType(): SquareTypeEnum {
    // const randomIndex = randomIntFromInterval(0, 7);
    const randomIndex = randomIntFromInterval(0, 5);

    return this.squareTypes[randomIndex];
  }

  initSquares(size: number): void {
    const squaresPerSide = this.settings.world.squaresPerSide;
    let rowIndex = 0;
    let colIndex = 0;

    // Схема
    // □□□...□□□
    // □□.....□□
    // □.......□
    // .........
    // ....n....
    // .........
    // □.......□
    // □□.....□□
    // □□□...□□□
    const n = squaresPerSide;
    const emptyCorners: number[] = [
      0, 1, 2, n - 3, n - 2, n - 1,
      n, n + 1, 2*n - 2, 2*n - 1,
      2*n, 3*n - 1,
      (n - 3)*n, (n - 3)*n + n - 1,
      (n - 2)*n, (n - 2)*n + 1, (n - 2)* n + n - 2, (n - 2)*n + n - 1,
      (n - 1)*n, (n - 1)*n + 1, (n - 1)* n + 2, (n - 1)*n + n - 3, (n - 1)*n + n - 2, (n - 1)*n + n - 1,
    ];

    if (this.settings.isDebugMode) {
      console.log('Empty corners', emptyCorners);
    }

    const squaresCount = Math.pow(squaresPerSide,2);

    for (let i = 0; i < squaresCount; i++) {
      if (i > 0 && i % squaresPerSide === 0) {
        rowIndex++;
        colIndex = 0;
      }

      let type: SquareTypeEnum = this.getRandomType();

      if (emptyCorners.includes(i)) { // чтобы в углах было пусто
        type = SquareTypeEnum.Empty;
      }

      this.squares.push({
        index: i,
        type,
        isDestroyable: type !== SquareTypeEnum.Hedgehog && type !== SquareTypeEnum.Empty,
        isPassable: type !== SquareTypeEnum.Hedgehog,
        top: size * rowIndex,
        left: size * colIndex,
        bottom: size * (rowIndex + 1),
        right: size * (colIndex + 1),
      });

      colIndex++;
    }

    if (this.settings.isDebugMode) {
      console.log('Squares', this.squares);
    }
  }

  recalculateSquareSizes(size: number): void {
    const squaresPerSide = this.settings.world.squaresPerSide;
    let rowIndex = 0;
    let colIndex = 0;

    this.squares.forEach((square, i) => {
      if (i > 0 && i % squaresPerSide === 0) {
        rowIndex++;
        colIndex = 0;
      }

      square.top = size * rowIndex;
      square.left = size * colIndex;
      square.bottom = size * (rowIndex + 1);
      square.right = size * (colIndex + 1);

      colIndex++;
    });
  }

  recalculateTanksCoordinates(currentWorldSize: number, previousWorldSize: number): void {
    if (currentWorldSize <= 0 || previousWorldSize <= 0) {
      return;
    }

    const multiplier = currentWorldSize / previousWorldSize;

    for (const tankIndex of TANKS_INDEXES) {
      this.tanksCoordinates[tankIndex].top *= multiplier;
      this.tanksCoordinates[tankIndex].right *= multiplier;
      this.tanksCoordinates[tankIndex].bottom *= multiplier;
      this.tanksCoordinates[tankIndex].left *= multiplier;
    }

    if (this.settings.isDebugMode) {
      console.log('Tanks coordinates', this.tanksCoordinates);
    }
  }
}
