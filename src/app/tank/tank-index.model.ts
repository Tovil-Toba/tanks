export const TANKS_INDEXES = [0, 1, 2, 3] as const;
type TanksIndexes = typeof TANKS_INDEXES; // readonly [0, 1, 2, 3]
export type TankIndex = TanksIndexes[number]; // 0 | 1 | 2 | 3
