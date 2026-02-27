const canvas = document.getElementById('starsCanvas');
        const ctx = canvas.getContext('2d');
        
        // Define o tamanho do canvas para o tamanho da janela
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Configurações das estrelas
        const starCount = Math.floor(canvas.width * canvas.height / 1000);
        const stars = [];
        const shootingStars = [];
        
        // Classe para estrelas normais
        class Star {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5;
                this.blinkSpeed = Math.random() * 0.05;
                this.blinkFactor = Math.random();
                this.increase = true;
                this.color = `hsl(50, 100%, ${70 + Math.random() * 30}%)`;
            }
            
            update() {
                // Efeito de piscar
                if (this.increase) {
                    this.blinkFactor += this.blinkSpeed;
                    if (this.blinkFactor >= 1) this.increase = false;
                } else {
                    this.blinkFactor -= this.blinkSpeed;
                    if (this.blinkFactor <= 0.3) this.increase = true;
                }
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * this.blinkFactor, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }
        
        // Classe para estrelas cadentes
        class ShootingStar {
            constructor() {
                this.reset();
                this.speed = 5 + Math.random() * 10;
            }
            
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height / 3;
                this.size = 0.5 + Math.random() * 1.5;
                this.angle = Math.PI / 4 + (Math.random() * Math.PI / 4);
                this.length = 0;
                this.maxLength = 5 + Math.random() * 100;
                this.active = false;
                this.delay = Math.random() * 2000;
                setTimeout(() => {
                    this.active = true;
                }, this.delay);
            }
            
            update() {
                if (!this.active) return;
                
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed;
                this.length += this.speed;
                
                if (this.length >= this.maxLength || 
                    this.x < 0 || this.x > canvas.width || 
                    this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }
            
            draw() {
                if (!this.active) return;
                
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(
                    this.x - Math.cos(this.angle) * this.length / 2,
                    this.y - Math.sin(this.angle) * this.length / 2
                );
                ctx.lineWidth = this.size / 2;
                ctx.strokeStyle = `rgba(255, 255, 255, ${1 - this.length / this.maxLength})`;
                ctx.stroke();
            }
        }
        
        // Inicialização
        function init() {
            // Criar estrelas normais
            for (let i = 0; i < starCount; i++) {
                stars.push(new Star());
            }
            
            // Criar estrelas cadentes
            for (let i = 0; i < 3; i++) {
                shootingStars.push(new ShootingStar());
            }
            
            // Animação
            animate();
        }
        
        // Loop de animação
        function animate() {
            ctx.fillStyle = '#0d121c';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Atualizar e desenhar estrelas
            stars.forEach(star => {
                star.update();
                star.draw();
            });
            
            // Atualizar e desenhar estrelas cadentes
            shootingStars.forEach(star => {
                star.update();
                star.draw();
            });
            
            requestAnimationFrame(animate);
        }
        
        // Redimensionar canvas quando a janela for redimensionada
        window.addEventListener('resize', function() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
        
        // Iniciar
        init();