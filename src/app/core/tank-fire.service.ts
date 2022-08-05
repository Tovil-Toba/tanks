import { Injectable } from '@angular/core';

import { Coordinates } from '../shared/coordinates.model';
import { DirectionEnum } from '../shared/direction.enum';
import { SettingsService } from './settings.service';
import { TankIndex } from '../tank/tank-index.model';
import { TankMovementService } from './tank-movement.service';
import { WorldService } from '../world/world.service';

@Injectable()
export class TankFireService {
  constructor(
    private settings: SettingsService,
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

    const isTargetInSight = (target: Coordinates): boolean => {
      const targetSize = getSize(target);

      switch(direction) {
        case DirectionEnum.Up:
          return target.bottom <= currentTank.top + targetSize/2 &&
            target.left >= currentTank.left - targetSize/2 &&
            target.right <= currentTank.right + targetSize/2
          ;
        case DirectionEnum.Right:
          return target.left >= currentTank.right - targetSize/2 &&
            target.top >= currentTank.top - targetSize/2 &&
            target.bottom <= currentTank.bottom + targetSize/2
          ;
        case DirectionEnum.Down:
          return target.top >= currentTank.bottom - targetSize/2 &&
            target.left >= currentTank.left - targetSize/2 &&
            target.right <= currentTank.right + targetSize/2
          ;
        case DirectionEnum.Left:
          return target.right <= currentTank.left + targetSize/2  &&
            target.top >= currentTank.top - targetSize/2 &&
            target.bottom <= currentTank.bottom + targetSize/2
          ;
        default:
          return  false;
      }
    };

    const targets: Array<Coordinates> = this.tankMovementService.tanksCoordinatesArray
      .filter((target, index) => (
        !this.worldService.isTankDestroyed(index as TankIndex) &&
        isTargetInSight(target))
      )
    ;

    const currentTankSize = getSize(currentTank);

    const isBlockInSight = (target: Coordinates, block: Coordinates): boolean => {
      const targetSize = getSize(target);

      switch(direction) {
        case DirectionEnum.Up:
          return target.bottom <= block.top + targetSize/2 &&
            block.bottom <= currentTank.top + currentTankSize/2 &&
            block.left >= currentTank.left - currentTankSize/2 &&
            block.right <= currentTank.right + currentTankSize/2
          ;
        case DirectionEnum.Right:
          return target.left >= block.right - targetSize/2 &&
            block.left >= currentTank.right - currentTankSize/2 &&
            block.top >= currentTank.top - currentTankSize/2 &&
            block.bottom <= currentTank.bottom + currentTankSize/2
          ;
        case DirectionEnum.Down:
          return target.top >= block.bottom - targetSize/2 &&
            block.top >= currentTank.bottom - currentTankSize/2 &&
            block.left >= currentTank.left - currentTankSize/2 &&
            block.right <= currentTank.right + currentTankSize/2
          ;
        case DirectionEnum.Left:
          return target.right <= block.left + targetSize/2 &&
            block.right <= currentTank.left + currentTankSize/2 &&
            block.top >= currentTank.top - currentTankSize/2 &&
            block.bottom <= currentTank.bottom + currentTankSize/2
          ;
        default:
          return  false;
      }
    };

    let isTargetInDirection = false;

    targets.forEach((target) => {
      const undestroyableBlocks: Array<Coordinates> = this.worldService.undestroyableBlocks
        .filter((square) => isBlockInSight(target, square))
      ;
      const destroyedTanks: Array<Coordinates> = this.settings.world.isFullyDestroyableTanks
        ? []
        : this.tankMovementService.tanksCoordinatesArray
          .filter((tank, index) => this.worldService.isTankDestroyed(index as TankIndex))
          .filter((destroyedTank) => isBlockInSight(target, destroyedTank))
        ;

      if (!undestroyableBlocks.length && !destroyedTanks.length) {
        isTargetInDirection = true;
      }
    });

    return isTargetInDirection;
  }
}
