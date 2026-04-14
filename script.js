const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/* 🌌 ARRAYS */
let stars = [];
let hearts = [];
let shootingStars = [];
let particles = [];

/* ⭐ ESTRELLAS */
for (let i = 0; i < 300; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: Math.random() * 0.3,
        color: `hsl(${200 + Math.random() * 100}, 100%, 70%)`
    });
}

/* ❤️ CORAZONES */
for (let i = 0; i < 40; i++) {
    hearts.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 8 + 4,
        speed: Math.random() * 0.5,
        color: `hsl(${Math.random() * 360}, 100%, 70%)`,
        time: Math.random() * 100
    });
}

/* 🌠 FUGACES */
function createShootingStar() {
    shootingStars.push({
        x: Math.random() * canvas.width,
        y: 0,
        len: Math.random() * 120,
        speed: Math.random() * 10 + 5,
        life: 0
    });
}
setInterval(createShootingStar, 1200);

/* ❤️ CORAZÓN */
function drawHeart(x, y, baseSize, color, time) {
    let pulse = Math.sin(time * 0.1) * 2;
    let size = baseSize + pulse;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x - size, y - size, x - size, y + size, x, y + size);
    ctx.bezierCurveTo(x + size, y + size, x + size, y - size, x, y);
    ctx.fill();
}

/* 🎨 DIBUJO */
function draw() {

    const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width
    );

    gradient.addColorStop(0, "#0a0f2c");
    gradient.addColorStop(1, "#000");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    /* ⭐ ESTRELLAS */
    stars.forEach(s => {
        ctx.fillStyle = s.color;
        ctx.fillRect(s.x, s.y, s.size, s.size);

        s.y += s.speed;
        if (s.y > canvas.height) s.y = 0;
    });

    /* ❤️ CORAZONES */
    hearts.forEach(h => {
        h.time++;

        drawHeart(h.x, h.y, h.size, h.color, h.time);

        h.y += h.speed;
        if (h.y > canvas.height) h.y = 0;

        /* ✨ partículas */
        if (Math.random() < 0.1) {
            particles.push({
                x: h.x,
                y: h.y,
                vx: (Math.random() - 0.5),
                vy: (Math.random() - 0.5),
                life: 30,
                color: h.color
            });
        }
    });

    /* ✨ PARTICULAS */
    particles.forEach((p, i) => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 30;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        if (p.life <= 0) particles.splice(i, 1);
    });

    ctx.globalAlpha = 1;

    /* 🌠 FUGACES */
    shootingStars.forEach((s, i) => {
        ctx.strokeStyle = "white";

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.len, s.y + s.len);
        ctx.stroke();

        s.x -= s.speed;
        s.y += s.speed;
        s.life++;

        if (s.life > 30) shootingStars.splice(i, 1);
    });
}

function animate() {
    draw();
    requestAnimationFrame(animate);
}
animate();

/* 🔄 RESIZE */
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

/* 🖼️ FOTOS (IMPORTANTE: .foto) */
const fotos = document.querySelectorAll('.foto');

let objs = [];

fotos.forEach(f => {
    objs.push({
        el: f,
        x: Math.random() * (window.innerWidth - 80),
        y: Math.random() * (window.innerHeight - 80),
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        size: 80
    });
});

/* 💥 COLISION */
function resolverColision(a, b) {
    let dx = b.x - a.x;
    let dy = b.y - a.y;
    let dist = Math.sqrt(dx * dx + dy * dy);

    if (dist === 0) return;

    let overlap = (a.size - dist) / 2;
    let nx = dx / dist;
    let ny = dy / dist;

    a.x -= nx * overlap;
    a.y -= ny * overlap;
    b.x += nx * overlap;
    b.y += ny * overlap;

    let kx = a.vx - b.vx;
    let ky = a.vy - b.vy;
    let p = (kx * nx + ky * ny);

    a.vx -= p * nx;
    a.vy -= p * ny;
    b.vx += p * nx;
    b.vy += p * ny;
}

/* 🔄 MOVIMIENTO */
function mover() {

    objs.forEach(o => {
        o.x += o.vx;
        o.y += o.vy;

        if (o.x <= 0 || o.x >= window.innerWidth - o.size) o.vx *= -1;
        if (o.y <= 0 || o.y >= window.innerHeight - o.size) o.vy *= -1;
    });

    for (let i = 0; i < objs.length; i++) {
        for (let j = i + 1; j < objs.length; j++) {

            let a = objs[i];
            let b = objs[j];

            let dx = b.x - a.x;
            let dy = b.y - a.y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < a.size) {
                resolverColision(a, b);
            }
        }
    }

    objs.forEach(o => {
        o.el.style.left = o.x + "px";
        o.el.style.top = o.y + "px";
    });

    requestAnimationFrame(mover);
}

mover();

/* 🌈 NEÓN */
fotos.forEach(foto => {

    let hue = Math.random() * 360;

    function loop() {
        hue += 0.3;
        let color = `hsl(${hue}, 100%, 60%)`;

        foto.querySelector("img").style.boxShadow =
            `0 0 6px ${color}, 0 0 12px ${color}`;

        requestAnimationFrame(loop);
    }

    loop();
});

/* 🔍 LIGHTBOX */
const lightbox = document.getElementById('lightbox');
const imgGrande = document.getElementById('imgGrande');

document.querySelectorAll('.foto img').forEach(img => {
    img.addEventListener('click', () => {
        lightbox.style.display = "flex";
        imgGrande.src = img.src;
    });
});

lightbox.addEventListener('click', () => {
    lightbox.style.display = "none";
});