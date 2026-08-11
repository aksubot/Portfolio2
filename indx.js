const marqueeTracks = Array.from(document.querySelectorAll('.marquee-track'));
const BASE_SPEED = 70;
const HOVER_EASE = 0.015;
const RESUME_EASE = 0.03;

let lastFrameTime = 0;

function setupMarquee(track) {
    const marquee = track.closest('.marquee');
    const direction = Number(marquee.dataset.direction || 1);

    track.dataset.direction = String(direction);
    track.dataset.offset = '0';
    track.dataset.speed = String(BASE_SPEED);
}

function getStepWidth(track) {
    const firstChild = track.firstElementChild;
    if (!firstChild) {
        return 0;
    }

    const gap = Number.parseFloat(getComputedStyle(track).gap || '0');
    return firstChild.getBoundingClientRect().width + gap;
}

function recycleTrack(track, offset) {
    const direction = Number(track.dataset.direction || 1);
    const stepWidth = getStepWidth(track);

    if (!stepWidth) {
        return offset;
    }

    if (direction > 0 && offset >= stepWidth) {
        offset -= stepWidth;
        track.appendChild(track.firstElementChild);
    } else if (direction < 0 && offset <= -stepWidth) {
        offset += stepWidth;
        track.appendChild(track.firstElementChild);
    }

    track.dataset.offset = String(offset);
    return offset;
}

function animateMarquee(timestamp) {
    if (!lastFrameTime) {
        lastFrameTime = timestamp;
    }

    const delta = Math.min((timestamp - lastFrameTime) / 1000, 0.03);
    lastFrameTime = timestamp;

    marqueeTracks.forEach((track) => {
        const marquee = track.closest('.marquee');
        const direction = Number(track.dataset.direction || 1);
        const isPaused = marquee.classList.contains('paused');

        let speed = Number(track.dataset.speed || BASE_SPEED);
        const easing = isPaused ? HOVER_EASE : RESUME_EASE;
        const targetSpeed = isPaused ? 0 : BASE_SPEED;

        speed += (targetSpeed - speed) * easing;

        if (Math.abs(targetSpeed - speed) < 0.5) {
            speed = targetSpeed;
        }

        let offset = Number(track.dataset.offset || 0) + direction * speed * delta;
        offset = recycleTrack(track, offset);

        track.style.transform = `translate3d(${offset}px, 0, 0)`;
        track.dataset.speed = String(speed);
        track.dataset.offset = String(offset);
    });

    requestAnimationFrame(animateMarquee);
}

window.addEventListener('load', () => {
    marqueeTracks.forEach(setupMarquee);

    document.querySelectorAll('.marquee').forEach((marquee) => {
        marquee.addEventListener('mouseenter', () => {
            marquee.classList.add('paused');
        });

        marquee.addEventListener('mouseleave', () => {
            marquee.classList.remove('paused');
        });
    });

    requestAnimationFrame(animateMarquee);
});



const cursor = document.querySelector(".cursor");

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;
const ease = 0.05; // Pehmennys toimii yhä hiirtä liikuttaessa

document.addEventListener('mousemove', (e) => {
  targetX = e.clientX;
  targetY = e.clientY;
});

function animate() {
  currentX += (targetX - currentX) * ease;
  currentY += (targetY - currentY) * ease;

  // Liikutetaan painiketta suhteessa selainikkunan reunoihin
  cursor.style.transform = `translate3d(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px), 0)`;

  requestAnimationFrame(animate);
}

animate();

const navMenu = document.querySelector('.navMenuCont');
const nav = document.querySelector('nav');
const body = document.querySelector('body');


if (navMenu && nav) {
  navMenu.addEventListener('click', () => {
    nav.classList.toggle('menu-active');
    body.classList.toggle('menu-active');

  });
}

// 1. Haetaan elementit DOM-puusta
const hoverTargets = document.querySelectorAll('.projekti');
const workHeaderTitle = document.querySelector('.workH1');
const workHeaderParagraph = document.querySelector('.workHeader p');

const hoverTexts = [
  {
    title: 'Pyöröpuu Mehtätalo',
    description: 'Ensimmäinen projekti: brändätty, responsiivinen ja nopea sivusto, joka herättää luottamusta.'
  },
  {
    title: 'B&B Punainen Tupa',
    description: 'Toinen projekti: vahva visuaalinen ilme, selkeä ostopolku ja sujuva käyttökokemus.'
  }
];

const originalWorkTitle = workHeaderTitle?.textContent ?? '';
const originalWorkDesc = workHeaderParagraph?.textContent ?? '';
let textTransitionTimeout;

function setWorkHeaderText(title, description) {
  if (!workHeaderTitle || !workHeaderParagraph) return;

  workHeaderTitle.classList.add('fade-out');
  workHeaderParagraph.classList.add('fade-out');

  clearTimeout(textTransitionTimeout);
  textTransitionTimeout = setTimeout(() => {
    workHeaderTitle.textContent = title;
    workHeaderParagraph.textContent = description;
    workHeaderTitle.classList.remove('fade-out');
    workHeaderParagraph.classList.remove('fade-out');
  }, 150);
}

if (cursor) {
  hoverTargets.forEach((hoverTarget, index) => {
    hoverTarget.addEventListener('mouseenter', () => {
      cursor.classList.add('visible');

      const hoverText = hoverTexts[index];
      if (hoverText) {
        setWorkHeaderText(hoverText.title, hoverText.description);
      }
    });

    hoverTarget.addEventListener('mouseleave', () => {
      cursor.classList.remove('visible');
      setWorkHeaderText(originalWorkTitle, originalWorkDesc);
    });
  });
}

// 2. Toggle hidden elements when they enter the viewport
const hiddenElements = document.querySelectorAll('.hidden');

const VIEWPORT_TWEAKS = {
  rootMargin: '0px 0px -10% 0px', // start animation when element is 15% before the bottom of viewport
  threshold: .6 // at least 20% of the element must be visible
};

const hiddenObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('hidden');
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
}, VIEWPORT_TWEAKS);

hiddenElements.forEach((element) => hiddenObserver.observe(element));

