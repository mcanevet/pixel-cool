# Pixel Cool - Game Specification

## Project Overview
- **Project name**: Pixel Cool
- **Type**: Web-based puzzle game
- **Core functionality**: Swap pixels to recreate a mosaic pattern
- **Target users**: Casual gamers looking for a relaxing puzzle experience

## UI/UX Specification

### Layout Structure
- **Header**: Game title + current level indicator
- **Main area**: 
  - Left side: Target mosaic (reference image)
  - Right side: Player's puzzle (interactive grid)
- **Footer**: Progress indicator (% correct) + level controls

### Visual Design
- **Color palette**: 
  - Background: `#1a1a2e` (dark blue)
  - Container: `#16213e` (darker blue)
  - Accent: `#e94560` (coral pink)
  - Text: `#eaeaea` (light gray)
  - Success: `#4ecca3` (mint green)
- **Typography**: 
  - Font: "JetBrains Mono", monospace (for pixel feel)
  - Title: 32px bold
  - Body: 16px
- **Grid styling**: 1px gap between pixels, hover highlight on selection
- **Animations**: 
  - Pixel swap: 200ms ease transition
  - Selection: scale(1.1) + border highlight

### Components
- **Mosaic Grid**: Square grid of colored pixels
- **Pixel**: Clickable square, shows selection state
- **Progress Bar**: Shows percentage of correct pixels
- **Level Selector**: Buttons to choose difficulty
- **Win Modal**: Congratulations message when puzzle completed

## Functionality Specification

### Core Features
1. **Level System**:
   - Easy: 8x8 grid (64 pixels)
   - Medium: 12x12 grid (144 pixels)
   - Hard: 16x16 grid (256 pixels)
   
2. **Color Generation**:
   - 16 distinct colors for all levels
   - Generate random mosaic using all 16 colors

3. **Puzzle Creation**:
   - Shuffle the mosaic colors randomly for player grid
   - Ensure shuffle is valid (solvable without moving target)

4. **Interaction**:
   - Click first pixel → highlight as selected
   - Click second pixel → swap colors + deselect
   - Click same pixel → deselect
   - Real-time progress update after each swap

5. **Progress Tracking**:
   - Calculate % of pixels matching target
   - Update display after each swap

6. **Win Condition**:
   - When 100% match, show win modal
   - Button to proceed to next level or replay

### Edge Cases
- Same pixel clicked twice → deselect
- Click outside grid → ignore
- Win at level 3 (hard) → show "completed" message

## Acceptance Criteria
- [ ] Three difficulty levels work correctly
- [ ] Pixels swap smoothly with animation
- [ ] Progress % updates accurately
- [ ] Win modal appears at 100%
- [ ] Responsive on different screen sizes
- [ ] All 16 colors are visually distinct