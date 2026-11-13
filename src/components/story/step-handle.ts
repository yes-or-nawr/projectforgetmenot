/**
 * Steps that take several presses before the story moves on (letter, archive,
 * quiz) expose this. Each returns false when it has nothing left to do in that
 * direction, so the player moves to the next or previous step instead.
 */
export type StepHandle = {
  next: () => boolean;
  prev: () => boolean;
};
