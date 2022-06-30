import { Tank } from '../tank/tank.model';

// Сделано так, вместо использования того же HullTypeEnum, потому что вариантов конфигурации может быть куда больше 8
export type TankNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type TanksRoster = Record<TankNumber, Tank>;
