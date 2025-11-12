class FlappyBirdGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.bird = {
            x: 100,
            y: 0,
            width: 34,
            height: 24,
            velocity: 0,
            gravity: 0.5,
            jumpStrength: -9,
            rotation: 0
        };
        this.pipes = [];
        this.score = 0;
        this.gameState = 'start'; // 'start', 'playing', 'gameOver'
        this.pipeGap = 150;
        this.pipeWidth = 60;
        this.pipeSpeed = 2;
        this.frameCount = 0;
        this.pipeFrequency = 90; // frames between pipes
        
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
        
        // Initialize bird position
        this.bird.y = this.canvas.height / 2;
    }
    
    createPipe() {
        const minHeight = 50;
        const maxHeight = this.canvas.height - this.pipeGap - minHeight - 100;
        const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
        
        const pipe = {
            x: this.canvas.width,
            topHeight: topHeight,
            bottomY: topHeight + this.pipeGap,
            width: this.pipeWidth,
            passed: false
        };
        this.pipes.push(pipe);
    }
    
    setupEventListeners() {
        // Keyboard events
        const jump = () => {
            if (this.gameState === 'playing') {
                this.bird.velocity = this.bird.jumpStrength;
            }
        };
        
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                jump();
                event.preventDefault();
            }
        });
        
        // Mouse/touch events for jumping
        this.canvas.addEventListener('click', jump);
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            jump();
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
        });
    }
    
    startGame() {
        this.gameState = 'playing';
        document.getElementById('startScreen').classList.add('hidden');
        this.animate();
    }
    
    restartGame() {
        // Reset game state
        this.score = 0;
        this.gameState = 'playing';
        this.frameCount = 0;
        
        // Clear pipes
        this.pipes = [];
        
        // Reset bird
        this.bird.y = this.canvas.height / 2;
        this.bird.velocity = 0;
        this.bird.rotation = 0;
        
        // Update UI
        this.updateUI();
        
        // Hide game over screen
        document.getElementById('gameOverScreen').classList.add('hidden');
        
        this.animate();
    }
    
    updateBird() {
        if (this.gameState !== 'playing') return;
        
        // Apply gravity
        this.bird.velocity += this.bird.gravity;
        this.bird.y += this.bird.velocity;
        
        // Update rotation based on velocity
        this.bird.rotation = Math.min(Math.max(this.bird.velocity * 3, -30), 90);
        
        // Check ground collision
        if (this.bird.y + this.bird.height >= this.canvas.height - 50) {
            this.bird.y = this.canvas.height - 50 - this.bird.height;
            this.gameOver();
        }
        
        // Check ceiling collision
        if (this.bird.y <= 0) {
            this.bird.y = 0;
            this.bird.velocity = 0;
        }
    }
    
    updatePipes() {
        if (this.gameState !== 'playing') return;
        
        // Create new pipes
        this.frameCount++;
        if (this.frameCount % this.pipeFrequency === 0) {
            this.createPipe();
        }
        
        // Update pipe positions
        for (let i = this.pipes.length - 1; i >= 0; i--) {
            const pipe = this.pipes[i];
            pipe.x -= this.pipeSpeed;
            
            // Remove off-screen pipes
            if (pipe.x + pipe.width < 0) {
                this.pipes.splice(i, 1);
                continue;
            }
            
            // Check if bird passed the pipe
            if (!pipe.passed && pipe.x + pipe.width < this.bird.x) {
                pipe.passed = true;
                this.score++;
            }
            
            // Check collision with pipes
            if (this.checkPipeCollision(pipe)) {
                this.gameOver();
            }
        }
    }
    
    checkPipeCollision(pipe) {
        // Check if bird is horizontally aligned with pipe
        if (this.bird.x + this.bird.width > pipe.x && 
            this.bird.x < pipe.x + pipe.width) {
            
            // Check if bird hits top or bottom pipe
            if (this.bird.y < pipe.topHeight || 
                this.bird.y + this.bird.height > pipe.bottomY) {
                return true;
            }
        }
        return false;
    }
    
    updateUI() {
        document.getElementById('score').textContent = `Score: ${this.score}`;
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOverScreen').classList.remove('hidden');
    }
    
    drawBird() {
        this.ctx.save();
        
        // Move to bird position
        this.ctx.translate(this.bird.x + this.bird.width / 2, this.bird.y + this.bird.height / 2);
        
        // Rotate bird
        this.ctx.rotate(this.bird.rotation * Math.PI / 180);
        
        // Draw bird body (yellow circle)
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.bird.width / 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw bird outline
        this.ctx.strokeStyle = '#FFA500';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Draw wing
        this.ctx.fillStyle = '#FFA500';
        this.ctx.beginPath();
        this.ctx.ellipse(-5, 5, 8, 12, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw eye
        this.ctx.fillStyle = '#000000';
        this.ctx.beginPath();
        this.ctx.arc(8, -5, 3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw beak
        this.ctx.fillStyle = '#FF6347';
        this.ctx.beginPath();
        this.ctx.moveTo(12, 0);
        this.ctx.lineTo(18, -3);
        this.ctx.lineTo(18, 3);
        this.ctx.closePath();
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    drawPipes() {
        this.pipes.forEach(pipe => {
            // Draw top pipe
            this.ctx.fillStyle = '#228B22';
            this.ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
            
            // Draw top pipe cap
            this.ctx.fillStyle = '#32CD32';
            this.ctx.fillRect(pipe.x - 5, pipe.topHeight - 30, pipe.width + 10, 30);
            
            // Draw bottom pipe
            this.ctx.fillStyle = '#228B22';
            this.ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, this.canvas.height - pipe.bottomY);
            
            // Draw bottom pipe cap
            this.ctx.fillStyle = '#32CD32';
            this.ctx.fillRect(pipe.x - 5, pipe.bottomY, pipe.width + 10, 30);
            
            // Add pipe texture
            this.ctx.strokeStyle = '#1a6d1a';
            this.ctx.lineWidth = 2;
            for (let y = 20; y < pipe.topHeight; y += 20) {
                this.ctx.beginPath();
                this.ctx.moveTo(pipe.x, y);
                this.ctx.lineTo(pipe.x + pipe.width, y);
                this.ctx.stroke();
            }
            for (let y = pipe.bottomY + 30; y < this.canvas.height; y += 20) {
                this.ctx.beginPath();
                this.ctx.moveTo(pipe.x, y);
                this.ctx.lineTo(pipe.x + pipe.width, y);
                this.ctx.stroke();
            }
        });
    }
    
    drawBackground() {
        // Sky gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#4ec0ca');
        gradient.addColorStop(0.7, '#87ceeb');
        gradient.addColorStop(1, '#d4f1f4');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw clouds
        this.drawClouds();
        
        // Draw ground
        this.ctx.fillStyle = '#DEB887';
        this.ctx.fillRect(0, this.canvas.height - 50, this.canvas.width, 50);
        
        // Draw grass on ground
        this.ctx.fillStyle = '#90EE90';
        this.ctx.fillRect(0, this.canvas.height - 50, this.canvas.width, 10);
    }
    
    drawClouds() {
        // Simple cloud drawing
        const time = Date.now() * 0.0001;
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        
        // Cloud 1
        const cloud1X = (time * 20) % (this.canvas.width + 200) - 100;
        this.drawCloud(cloud1X, 80);
        
        // Cloud 2
        const cloud2X = (time * 15) % (this.canvas.width + 200) - 100;
        this.drawCloud(cloud2X, 150);
        
        // Cloud 3
        const cloud3X = (time * 10) % (this.canvas.width + 200) - 100;
        this.drawCloud(cloud3X, 220);
    }
    
    drawCloud(x, y) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, 20, 0, Math.PI * 2);
        this.ctx.arc(x + 25, y, 30, 0, Math.PI * 2);
        this.ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    draw() {
        // Draw background
        this.drawBackground();
        
        // Draw pipes
        this.drawPipes();
        
        // Draw bird
        this.drawBird();
    }
    
    animate() {
        if (this.gameState !== 'playing') return;
        
        this.updateBird();
        this.updatePipes();
        this.updateUI();
        
        this.draw();
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    new FlappyBirdGame();
});