import { Injectable } from '@angular/core';

import { Coordinates } from '../shared/coordinates.model';
import { DirectionEnum } from '../shared/direction.enum';
import { randomIntFromInterval } from '../shared/utils';
import { SettingsService } from './settings.service';
import { Square } from '../world/square/square.model';
import { TankIndex, TANKS_INDEXES } from '../tank/tank-index.model';
import { TankMovement } from './tank-movement.model';
import { TanksCoordinates } from '../world/shared/tanks-coordinates.model';

@Injectable({
  providedIn: 'root'
})
export class TankMovementService {
  readonly directionControls: Record<TankIndex, DirectionEnum | undefined>;
  readonly directionSquares: Record<TankIndex, Array<Square>>;
  readonly prevDirectionControls: Record<TankIndex, DirectionEnum | undefined>;
  readonly movementDirections: Array<DirectionEnum>;
  playerTankIndex: TankIndex;
  readonly tanksCoordinates: TanksCoordinates;

  constructor(private settings: SettingsService) {
    this.playerTankIndex = randomIntFromInterval(0, 3) as TankIndex;
    this.directionControls = {
      0: undefined,
      1: undefined,
      2: undefined,
      3: undefined,
    };
    this.prevDirectionControls = {
      0: undefined,
      1: undefined,
      2: undefined,
      3: undefined,
    };
    this.directionSquares = {
      0: new Array<Square>(),
      1: new Array<Square>(),
      2: new Array<Square>(),
      3: new Array<Square>()
    };
    this.movementDirections = [
      DirectionEnum.Up,
      DirectionEnum.Right,
      DirectionEnum.Down,
      DirectionEnum.Left
    ];
    const initialCoordinates = {
      top: 0,
      right: settings.squareSize,
      bottom: settings.squareSize,
      left: 0
    };
    this.tanksCoordinates = {
      0: initialCoordinates,
      1: initialCoordinates,
      2: initialCoordinates,
      3: initialCoordinates
    };
  }

  get directionSquaresArray(): Array<Square> {
    let squares = new Array<Square>();

    for(const tankIndex of TANKS_INDEXES) {
      squares = squares.concat(this.directionSquares[tankIndex]);
    }

    return squares;
  }

  get tanksCoordinatesArray(): Array<Coordinates> {
    const coordinates = new Array<Coordinates>();

    for (const tankIndex of TANKS_INDEXES) {
      coordinates.push(this.tanksCoordinates[tankIndex]);
    }

    return coordinates;
  }

  getDirectionSquares(tankIndex: TankIndex): Array<Square> {
    return this.directionSquares[tankIndex];
  }

  getTankCoordinates(tankIndex: TankIndex): Coordinates {
    return this.tanksCoordinates[tankIndex];
  }

  initDirectionControls(playerTankIndex: TankIndex): void {
    for (const tankIndex of TANKS_INDEXES) {
      if (tankIndex === playerTankIndex) {
        continue;
      }

      const randomDirectionIndex = randomIntFromInterval(0, 3);
      this.directionControls[tankIndex] = this.movementDirections[randomDirectionIndex];
    }
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

  setDirectionSquares(tankIndex: TankIndex, directionSquares: Array<Square>): void {
    this.directionSquares[tankIndex] = directionSquares;
  }

  setTankCoordinates(tankIndex: TankIndex, coordinates: Coordinates): void {
    this.tanksCoordinates[tankIndex] = coordinates;
  }

  tankMovingHandler(tankIndex: TankIndex, movement: TankMovement): void {
    if (tankIndex === this.playerTankIndex || movement.canMove) {
      return;
    }

    const filteredDirections = this.movementDirections
      .filter((direction) => (
        direction !== movement.direction// && direction !== this.prevDirectionControls[tankIndex]
                                        // todo: разобраться, почему с условием выше работает нестабильно
      ))
    ;

    const randomDirectionIndex = randomIntFromInterval(0, 2);
    this.prevDirectionControls[tankIndex] = this.directionControls[tankIndex];
    this.directionControls[tankIndex] = filteredDirections[randomDirectionIndex];
  }
}
