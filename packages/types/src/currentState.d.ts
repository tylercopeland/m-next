type CurrentStateKey = 'REGULAR' | 'HIDDEN' | 'DISABLED' | 'READONLY';
// enum saved to mongo
declare const CurrentState: Readonly<Record<CurrentStateKey, 0 | 1 | 2 | 3>>;

export type CurrentStateValue = (typeof CurrentState)[keyof typeof CurrentState];
export default CurrentState;
