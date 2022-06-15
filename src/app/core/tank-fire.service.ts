import { Injectable } from '@angular/core';

import { Coordinates } from '../shared/coordinates.model';
import { DirectionEnum } from '../shared/direction.enum';
import { TankIndex } from '../tank/tank-index.model';
import { TankMovementService } from './tank-movement.service';
import { WorldService } from '../world/world.service';

@Injectable()
export class TankFireService {
  constructor(
    private tankMovementService: TankMovementService,
    private worldService: WorldService
  ) { }

  checkTargets(tankIndex: TankIndex): Array<DirectionEnum> {
    const targetDirections = new Array<DirectionEnum>();

    const checkTargetsInDirection = (direction: DirectionEnum): boolean => (
      this.checkTargetsInDirection(direction, tankIndex)
    );

    // Цели сверху
    if (checkTargetsInDirection(DirectionEnum.Up)) {
      targetDirections.push(DirectionEnum.Up);
    }

    // Цели снизу
    if (checkTargetsInDirection(DirectionEnum.Down)) {
      targetDirections.push(DirectionEnum.Down);
    }

    // Цели слева
    if (checkTargetsInDirection(DirectionEnum.Left)) {
      targetDirections.push(DirectionEnum.Left);
    }

    // Цели справа
    if (checkTargetsInDirection(DirectionEnum.Right)) {
      targetDirections.push(DirectionEnum.Right);
    }

    return targetDirections;
  }

  checkTargetsInDirection(direction: DirectionEnum, tankIndex: TankIndex): boolean {
    const currentTank: Coordinates = this.tankMovementService.tanksCoordinates[tankIndex];

    const getSize = (coordinates: Coordinates): number => coordinates.right - coordinates.left;

    const compareCoordinates = (target: Coordinates, tankOrBlock: Coordinates): boolean => {
      const targetSize = getSize(target);

      switch(direction) {
        case DirectionEnum.Up:
          return target.bottom <= tankOrBlock.top + targetSize/2 &&
            target.left >= tankOrBlock.left - targetSize/2 &&
            target.right <= tankOrBlock.right + targetSize/2
          ;
        case DirectionEnum.Right:
          return target.left >= tankOrBlock.right - targetSize/2 &&
            target.top >= tankOrBlock.top - targetSize/2 &&
            target.bottom <= tankOrBlock.bottom + targetSize/2
          ;
        case DirectionEnum.Down:
          return target.top >= tankOrBlock.bottom - targetSize/2 &&
            target.left >= tankOrBlock.left - targetSize/2 &&
            target.right <= tankOrBlock.right + targetSize/2
          ;
        case DirectionEnum.Left:
          return target.right <= tankOrBlock.left + targetSize/2  &&
            target.top >= tankOrBlock.top - targetSize/2 &&
            target.bottom <= tankOrBlock.bottom + targetSize/2
          ;
        default:
          return  false;
      }
    };

    const targets: Array<Coordinates> = this.tankMovementService.tanksCoordinatesArray
      .filter((target, index) => (
        !this.worldService.isTankDestroyed(index as TankIndex) &&
        compareCoordinates(target, currentTank))
      )
    ;

    let isTargetInDirection = false;

    targets.forEach((target) => {
      const undestroyableBlocks: Array<Coordinates> = this.worldService.undestroyableBlocks
        .filter((square) => compareCoordinates(target, square));

      if (!undestroyableBlocks.length) {
        isTargetInDirection = true;
      }
    });

    return isTargetInDirection;
  }
}
