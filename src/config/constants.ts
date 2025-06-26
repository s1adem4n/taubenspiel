const TRAJECTORY_POINTS = 20;
const TRAJECTORY_SPACING = 0.05; // Time spacing between points;

const PACKAGE_INTENSITY = 250; // Initial velocity intensity
const PACKAGE_OFFSET_DISTANCE = 35; // Distance from player to spawn package
const PACKAGE_RELATIVE_ANGLE = 70; // Angle offset for package spawn relative to player angle
const PACKAGE_SCORE = 200; // Score for delivering a package

const PLAYER_MAX_ANGLE = -60; // Maximum angle for player rotation

const GRAVITY = 400; // initial gravity force;

const TILE_SIZE = 16;
const HOUSE_SCALE = 0.75;
const HOUSE_GAP = 64;
const GROUND_HEIGHT = 16;

const BASE_SPEED = 60; // Base speed of the game

export default {
  TRAJECTORY_POINTS,
  TRAJECTORY_SPACING,
  PACKAGE_INTENSITY,
  PACKAGE_OFFSET_DISTANCE,
  PACKAGE_RELATIVE_ANGLE,
  PACKAGE_SCORE,
  GRAVITY,
  TILE_SIZE,
  HOUSE_SCALE,
  HOUSE_GAP,
  GROUND_HEIGHT,
  PLAYER_MAX_ANGLE,
  BASE_SPEED,
};
