# Phase 2

- Moveable player
  - touch
- Player shooting

## Touch input

### Touch state

- (Singleton)
- Keeps track of touch state during each frame
- Listen to window/container events
- Store state based on events

### Touch joystick

- Touch joystick component
  - Position on screen
  - Radius
  - Action command

---

- Touch joystick system
  - Read from touch state
  - Emit action command from touch state

---

- Render touch joystick
  - ...

## Commands

### Types of command

- Move
- Shoot
