# Flappy Bird Game

A classic Flappy Bird-like game built with HTML5 Canvas and JavaScript. Guide the bird through pipes by making it jump at the right moments!

![Game Start Screen](https://github.com/user-attachments/assets/c9140af4-26d2-40c7-918f-ab1ffb056226)

## 🎮 Game Features

- **Simple Controls**: Click or press spacebar to make the bird jump
- **Dynamic Pipes**: Green pipes spawn continuously with random gaps
- **Gravity Physics**: Realistic bird falling with gravity simulation
- **Scoring System**: Earn 1 point for each pipe successfully passed
- **Collision Detection**: Game ends when bird hits pipes or ground
- **Animated Background**: Sky gradient with moving clouds
- **Responsive Design**: Game adapts to different screen sizes

![Game Over Screen](https://github.com/user-attachments/assets/14028237-c142-4b27-8a5f-400cfffd0693)

## 🚀 How to Play

1. Open `index.html` in your web browser
2. Click "Start Game" to begin
3. Click anywhere on the screen or press spacebar to make the bird jump
4. Navigate through the gaps between pipes
5. Avoid hitting pipes or the ground
6. Try to achieve the highest score possible!

## 🛠️ Technical Implementation

- **HTML5 Canvas**: 2D rendering with smooth animations  
- **JavaScript ES6**: Modern class-based game architecture
- **CSS3**: Sky gradient backgrounds and modern UI styling
- **Responsive Design**: Adapts to different screen sizes
- **Game Loop**: Smooth 60fps animation using requestAnimationFrame
- **Collision Detection**: Precise bounding box collision system

## 🎯 Game Mechanics

- **Bird Physics**: Gravity (0.5) and jump strength (-9) for realistic flight
- **Pipe Generation**: Pipes spawn every 90 frames with random gap positions
- **Pipe Movement**: Constant horizontal scrolling at 2 pixels per frame
- **Score Tracking**: Increments when bird passes through pipe gaps
- **Game States**: Start screen, active gameplay, and game over with restart option
- **Bird Rotation**: Visual feedback based on vertical velocity

## 🎨 Visual Features

- **Sky Background**: Beautiful blue gradient from sky blue to light cyan
- **Animated Clouds**: Three clouds moving at different speeds
- **Green Pipes**: Classic green pipes with caps and texture details
- **Yellow Bird**: Cute bird with wing, eye, beak, and rotation animation
- **Ground**: Brown ground with green grass at the top
- **Modern UI**: Glowing title with gradient text and smooth button animations

## 📂 Project Structure

```
├── index.html          # Main game page with UI structure
├── style.css          # Game styling and animations  
├── game.js           # Core game logic and mechanics
└── GAME_README.md    # This documentation file
```

## 🚀 Getting Started

1. Clone or download this repository
2. Open `index.html` in any modern web browser
3. No additional setup or dependencies required!

## 🎮 Controls

- **Mouse Click**: Make the bird jump
- **Spacebar**: Make the bird jump
- **Touch**: Make the bird jump (mobile support)

## 🏆 Features Implemented

- ✅ Bird character with gravity and jump mechanics
- ✅ Pipe generation with random gap positions
- ✅ Continuous pipe movement across the screen
- ✅ Collision detection (bird hits pipe or ground)
- ✅ Score tracking for each pipe passed
- ✅ Game states (start, playing, game over)
- ✅ Restart functionality after game over
- ✅ Responsive design for different screen sizes
- ✅ Animated background with clouds
- ✅ Bird rotation based on velocity
- ✅ Modern UI with gradient animations
- ✅ Touch support for mobile devices

Enjoy playing Flappy Bird! 🐦✨