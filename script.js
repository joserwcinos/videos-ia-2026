const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouseX = 0;
let mouseY = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = ['#ff006e','#8338ec','#3a86ff','#00f5a0','#00d9ff'][Math.floor(Math.random()*5)];
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 150) { this.x -= dx*0.005; this.y -= dy*0.005; }
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

function initParticles() {
    const count = Math.min(80, Math.floor((canvas.width*canvas.height)/15000));
    particles = [];
    for (let i = 0; i < count; i++) particles.push(new Particle());
}
initParticles();

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i+1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 120) {
                ctx.beginPath();
                ctx.strokeStyle = particles[i].color;
                ctx.globalAlpha = 0.1*(1-dist/120);
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animateParticles);
}
animateParticles();

document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });

const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
});

const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('active'));
});

const typingText = document.getElementById('typing-text');
const artists = ['Bad Bunny','Drake','Taylor Swift','Peso Pluma','Shakira','Feid','Karol G','Travis Scott','Rosalia','Daddy Yankee','Dua Lipa','The Weeknd','CUALQUIER ARTISTA!'];
let artistIndex = 0, charIndex = 0, isDeleting = false, typingSpeed = 100;

function typeWriter() {
    const current = artists[artistIndex];
    if (isDeleting) { typingText.textContent = current.substring(0, charIndex-1); charIndex--; typingSpeed = 50; }
    else { typingText.textContent = current.substring(0, charIndex+1); charIndex++; typingSpeed = 100; }
    if (!isDeleting && charIndex === current.length) { typingSpeed = 2000; isDeleting = true; }
    else if (isDeleting && charIndex === 0) { isDeleting = false; artistIndex = (artistIndex+1)%artists.length; typingSpeed = 300; }
    setTimeout(typeWriter, typingSpeed);
}
typeWriter();

function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 125;
        let current = 0;
        const update = () => {
            current += increment;
            if (current < target) { counter.textContent = Math.floor(current); requestAnimationFrame(update); }
            else counter.textContent = target;
        };
        update();
    });
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.2 });

document.querySelectorAll('.service-card,.gallery-item,.step,.contact-item,.cta-card,.pricing-card').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

setTimeout(animateCounters, 1000);

document.querySelectorAll('.card-3d').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = (y - rect.height/2) / 20;
        const rotateY = (rect.width/2 - x) / 20;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)'; });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const hero = document.querySelector('.hero-content');
    const cube = document.querySelector('.hero-3d-element');
    if (hero && scrolled < window.innerHeight) { hero.style.transform = `translateY(${scrolled*0.3}px)`; hero.style.opacity = 1-(scrolled/window.innerHeight); }
    if (cube && scrolled < window.innerHeight) cube.style.transform = `translateY(${scrolled*0.15}px)`;
});
