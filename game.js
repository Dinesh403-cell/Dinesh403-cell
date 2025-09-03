class SpaceShooterGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.player = {
            x: 0,
            y: 0,
            width: 30,
            height: 40,
            speed: 5,
            color: '#00ff00'
        };
        this.enemies = [];
        this.bullets = [];
        this.particles = [];
        this.score = 0;
        this.lives = 3;
        this.gameState = 'start'; // 'start', 'playing', 'gameOver'
        this.keys = {};
        this.lastEnemySpawn = 0;
        this.enemySpawnRate = 2000; // milliseconds
        this.lastTime = 0;
        this.stars = [];
        
        this.init();
        this.setupEventListeners();
    }
    
    init() {
        // Get canvas and context
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Initialize player position
        this.player.x = this.canvas.width / 2 - this.player.width / 2;
        this.player.y = this.canvas.height - this.player.height - 50;
        
        this.createStars();
    }
    
    createStars() {
        // Create background stars
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2,
                speed: Math.random() * 2 + 1,
                brightness: Math.random()
            });
        }
    }
    
    createEnemy() {
        const enemy = {
            x: Math.random() * (this.canvas.width - 40),
            y: -40,
            width: 40,
            height: 30,
            speed: 2 + Math.random() * 3,
            color: '#ff0000'
        };
        this.enemies.push(enemy);
    }
    
    createBullet() {
        const bullet = {
            x: this.player.x + this.player.width / 2 - 2,
            y: this.player.y,
            width: 4,
            height: 10,
            speed: 8,
            color: '#ffff00'
        };
        this.bullets.push(bullet);
    }
    
    createParticle(x, y, color = '#ffffff') {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1,
                decay: 0.02,
                color: color
            });
        }
    }
    
    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (event) => {
            this.keys[event.code] = true;
            
            if (event.code === 'Space' && this.gameState === 'playing') {
                this.createBullet();
                event.preventDefault();
            }
        });
        
        document.addEventListener('keyup', (event) => {
            this.keys[event.code] = false;
        });
        
        // UI buttons
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restartGame();
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.player.x = this.canvas.width / 2 - this.player.width / 2;
            this.player.y = this.canvas.height - this.player.height - 50;
        });
    }
    
    startGame() {
        this.gameState = 'playing';
        document.getElementById('startScreen').classList.add('hidden');
        this.lastTime = performance.now();
        this.animate();
    }
    
    restartGame() {
        // Reset game state
        this.score = 0;
        this.lives = 3;
        this.gameState = 'playing';
        this.enemySpawnRate = 2000;
        
        // Clear arrays
        this.enemies = [];
        this.bullets = [];
        this.particles = [];
        
        // Reset player position
        this.player.x = this.canvas.width / 2 - this.player.width / 2;
        this.player.y = this.canvas.height - this.player.height - 50;
        
        // Update UI
        this.updateUI();
        
        // Hide game over screen
        document.getElementById('gameOverScreen').classList.add('hidden');
        
        this.lastTime = performance.now();
        this.animate();
    }
    
    updatePlayer(deltaTime) {
        if (this.gameState !== 'playing') return;
        
        const speed = this.player.speed * (deltaTime / 16); // Normalize to ~60fps
        
        // Move left/right
        if (this.keys['ArrowLeft'] && this.player.x > 0) {
            this.player.x -= speed;
        }
        if (this.keys['ArrowRight'] && this.player.x < this.canvas.width - this.player.width) {
            this.player.x += speed;
        }
        
        // Move up/down (limited range)
        if (this.keys['ArrowUp'] && this.player.y > this.canvas.height * 0.5) {
            this.player.y -= speed;
        }
        if (this.keys['ArrowDown'] && this.player.y < this.canvas.height - this.player.height - 20) {
            this.player.y += speed;
        }
    }
    
    updateEnemies(deltaTime) {
        if (this.gameState !== 'playing') return;
        
        // Spawn enemies
        const now = performance.now();
        if (now - this.lastEnemySpawn > this.enemySpawnRate) {
            this.createEnemy();
            this.lastEnemySpawn = now;
            
            // Increase difficulty over time
            if (this.enemySpawnRate > 800) {
                this.enemySpawnRate -= 20;
            }
        }
        
        // Update enemy positions
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.y += enemy.speed * (deltaTime / 16);
            
            // Remove enemies that are off screen
            if (enemy.y > this.canvas.height) {
                this.enemies.splice(i, 1);
            }
            // Check collision with player
            else if (this.checkCollision(enemy, this.player)) {
                this.createParticle(enemy.x + enemy.width/2, enemy.y + enemy.height/2, '#ff0000');
                this.enemies.splice(i, 1);
                this.lives--;
                
                if (this.lives <= 0) {
                    this.gameOver();
                }
            }
        }
    }
    
    updateBullets(deltaTime) {
        if (this.gameState !== 'playing') return;
        
        // Update bullet positions
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.y -= bullet.speed * (deltaTime / 16);
            
            // Remove bullets that are off screen
            if (bullet.y < -bullet.height) {
                this.bullets.splice(i, 1);
                continue;
            }
            
            // Check collision with enemies
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];
                if (this.checkCollision(bullet, enemy)) {
                    // Create explosion particles
                    this.createParticle(enemy.x + enemy.width/2, enemy.y + enemy.height/2, '#ffff00');
                    
                    // Remove bullet and enemy
                    this.bullets.splice(i, 1);
                    this.enemies.splice(j, 1);
                    
                    // Increase score
                    this.score += 10;
                    break;
                }
            }
        }
    }
    
    updateParticles(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.x += particle.vx * (deltaTime / 16);
            particle.y += particle.vy * (deltaTime / 16);
            particle.life -= particle.decay;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    updateStars(deltaTime) {
        this.stars.forEach(star => {
            star.y += star.speed * (deltaTime / 16);
            if (star.y > this.canvas.height) {
                star.y = -5;
                star.x = Math.random() * this.canvas.width;
            }
        });
    }
    
    checkCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }
    
    updateUI() {
        document.getElementById('score').textContent = `Score: ${this.score}`;
        document.getElementById('lives').textContent = `Lives: ${this.lives}`;
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOverScreen').classList.remove('hidden');
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000011';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw stars
        this.stars.forEach(star => {
            this.ctx.globalAlpha = star.brightness;
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
        
        // Draw player (spaceship shape)
        this.ctx.fillStyle = this.player.color;
        this.ctx.beginPath();
        this.ctx.moveTo(this.player.x + this.player.width / 2, this.player.y);
        this.ctx.lineTo(this.player.x, this.player.y + this.player.height);
        this.ctx.lineTo(this.player.x + this.player.width, this.player.y + this.player.height);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Draw enemies
        this.enemies.forEach(enemy => {
            this.ctx.fillStyle = enemy.color;
            this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            
            // Add simple detail
            this.ctx.fillStyle = '#990000';
            this.ctx.fillRect(enemy.x + 5, enemy.y + 5, enemy.width - 10, enemy.height - 10);
        });
        
        // Draw bullets
        this.bullets.forEach(bullet => {
            this.ctx.fillStyle = bullet.color;
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            
            // Add glow effect
            this.ctx.shadowColor = bullet.color;
            this.ctx.shadowBlur = 10;
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            this.ctx.shadowBlur = 0;
        });
        
        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
    }
    
    animate(currentTime = 0) {
        if (this.gameState !== 'playing') return;
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.updatePlayer(deltaTime);
        this.updateEnemies(deltaTime);
        this.updateBullets(deltaTime);
        this.updateParticles(deltaTime);
        this.updateStars(deltaTime);
        this.updateUI();
        
        this.draw();
        
        requestAnimationFrame((time) => this.animate(time));
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    new SpaceShooterGame();
});