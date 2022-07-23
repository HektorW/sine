# Project goals

- Work with an ECS
- Create something playable
  - Procedural stages
- Flexible architecture
- Playfull

## Focus

- Quickest way forward
  - Always MVP for playability and fun
- Stay on current goal
- No musts

## Game goals

- Permadeath
- Stages
  - Infinite
- Permanent upgrades
- Multiple attacks
  - Ranged attacks
- Medium paced controls
  - Aim
  - Positioning
  - Not timing
- Mobile first
  - Keyboard for development and testing mainly

## Phase 1 - Boiler [DONE]

- Website up
- ApeECS
- Vite
- Pixi
- Moveable player
  - Keyboard

### Review - (Phase 1)

- Need somewhere to set up a scene
- Need a pattern to access globals
  - Input singletons
  - Frame time
  - Renderer
- KeyboardInputSystem doesn't seem like a correct way to do it
  - Would be nice to have inputs emit actions
    - Actions would be acted upon in a move/action system
- Not sure if connection between sprite components and pixi is proper

## Phase 2 - Player [DONE]

[Phase 2](./phase2.md)

- Moveable player
  - touch
- Player shooting

### Review - (Phase 2)

- Moved scene setup to later phase
- Command architecture is nice to work with but unsure of performance
- Sprite system hase unclear responsibility
  - Need to streamline handling of transforms and sprites
- TypeScript pattern for ECS is coming along
- Connection between pixi, world, game and systems need a structure
- Need layers in pixi
  - Bullets appear in front of touch joysticks
- Not sure how to manage different kind of weapons and attacks

## Phase 3 - Enemies [DONE]

- Enemy moving toward player
- Player health
- Enemy health
- Collisions

### Review - (Phase 3)

- Bullets need to be cleared when out of bounds
- Entity creation needs structure
- Not sure what's a good way of defining behaviour on collisions
  - Want to have it customizable depending on both colliding objects
- Not sure if damange should be calculated on impact rather than bullet creation
  - Would make sense to take possible resistance into account on hit

## Phase 4 - Device

- Viewport dimensions
- Full screen in mobile
- Touch controls tweaking
  - touch controls UI

## Phase 5 - Feedback

- Sounds
- Particles

## Phase 6 - Gameplay

- Scene management
- Camera
- Enemy AI
- Levels
- Different attacks
- Mana / resources

## Phase 7 - Style

- Color scheme
- Graphics style

## Tech

- Vite
- ApeECS
- Pixi
- (Howler) - sound
- (Matter) - physics / math
