import { Injectable } from '@angular/core';

import { Coordinates } from '../shared/coordinates.model';
import { DirectionEnum } from '../shared/direction.enum';
import { TankIndex } from '../tank/tank-index.model';
import { TankMovementService } from './tank-movement.service';
import { WorldService } from '../world/world.service';

@Injectable({
  providedIn: 'root'
})
export class TankFireService {

  constructor(
    private tankMovementService: TankMovementService,
    private worldService: WorldService
  ) { }

  checkTargets(tankIndex: TankIndex): Array<DirectionEnum> {
    const targetDirections = new Array<DirectionEnum>();
    const currentTank = this.tankMovementService.tanksCoordinates[tankIndex];
    const targets = this.tankMovementService.tanksCoordinatesArray;
    let isFreeWay = true;

    const getSize = (coordinates: Coordinates): number => coordinates.right - coordinates.left;


    // Цели сверху

    const topTargets = targets.filter((target) => {
      const targetSize = getSize(target);
      return target.bottom <= currentTank.top + targetSize/2 &&
        target.left >= currentTank.left - targetSize/2 &&
        target.right <= currentTank.right + targetSize/2
      ;
    });

    isFreeWay = true;

    topTargets.forEach((target) => {
      const undestroyableBlocks = this.worldService.undestroyableBlocks
        .filter((square) => {
          const targetSize = getSize(target);

          return target.bottom <= square.top + targetSize/2 &&
            target.left >= square.left - targetSize/2 &&
            target.right <= square.right + targetSize/2
          ;
        })
      ;

      if (undestroyableBlocks.length) {
        isFreeWay = false;
      }
    });

    if (isFreeWay && topTargets.length) {
      targetDirections.push(DirectionEnum.Up);
    }


    // Цели снизу

    const bottomTargets = targets.filter((target) => {
      const targetSize = getSize(target);
      return target.top >= currentTank.bottom - targetSize/2 &&
        target.left >= currentTank.left - targetSize/2 &&
        target.right <= currentTank.right + targetSize/2
      ;
    });

    isFreeWay = true;

    bottomTargets.forEach((target) => {
      const undestroyableBlocks = this.worldService.undestroyableBlocks
        .filter((square) => {
          const targetSize = getSize(target);
          return target.top >= square.bottom - targetSize/2 &&
            target.left >= square.left - targetSize/2 &&
            target.right <= square.right + targetSize/2
          ;
        })
      ;

      if (undestroyableBlocks.length) {
        isFreeWay = false;
      }
    });

    if (isFreeWay && bottomTargets.length) {
      targetDirections.push(DirectionEnum.Down);
    }


    // Цели слева

    const leftTargets = targets.filter((target) => {
      const targetSize = getSize(target);
      return target.right <= currentTank.left + targetSize/2  &&
        target.top >= currentTank.top - targetSize/2 &&
        target.bottom <= currentTank.bottom + targetSize/2
      ;
    });

    isFreeWay = true;

    leftTargets.forEach((target) => {
      const undestroyableBlocks = this.worldService.undestroyableBlocks
        .filter((square) => {
          const targetSize = getSize(target);
          return target.right <= square.left + targetSize/2  &&
            target.top >= square.top - targetSize/2 &&
            target.bottom <= square.bottom + targetSize/2
          ;
        })
      ;

      if (undestroyableBlocks.length) {
        isFreeWay = false;
      }
    });

    if (isFreeWay && leftTargets.length) {
      targetDirections.push(DirectionEnum.Left);
    }


    // Цели справа

    const rightTargets = targets.filter((target) => {
      const targetSize = getSize(target);
      return target.left >= currentTank.right - targetSize/2 &&
        target.top >= currentTank.top - targetSize/2 &&
        target.bottom <= currentTank.bottom + targetSize/2
      ;
    });

    isFreeWay = true;

    rightTargets.forEach((target) => {
      const undestroyableBlocks = this.worldService.undestroyableBlocks
        .filter((square) => {
          const targetSize = getSize(target);
          return target.left >= square.right - targetSize/2 &&
            target.top >= square.top - targetSize/2 &&
            target.bottom <= square.bottom + targetSize/2
          ;
        })
      ;

      if (undestroyableBlocks.length) {
        isFreeWay = false;
      }
    });

    if (isFreeWay && rightTargets.length) {
      targetDirections.push(DirectionEnum.Right);
    }

    return targetDirections;
  }
}
