function initPage() {
    const cursor = document.querySelector('.cursor');

    document.querySelectorAll('.reveal-text').forEach((element) => {
        const text = element.textContent;
        const words = text.split(/\s+/);

        element.innerHTML = '';

        words.forEach((word, index) => {
            const span = document.createElement('span');
            span.textContent = word;
            span.classList.add('hidden');
            element.appendChild(span);

            if (index < words.length - 1) {
                element.appendChild(document.createTextNode(' '));
            }
        });
    });

    document.querySelectorAll('.projekti .img').forEach((imgDiv) => {
        const hoverImage = imgDiv.dataset.hoverImage;
        if (hoverImage) {
            imgDiv.style.setProperty('--hover-image', `url('${hoverImage}')`);
        }
    });

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    const ease = 0.05;

    if (cursor) {
        document.addEventListener('mousemove', (event) => {
            targetX = event.clientX;
            targetY = event.clientY;
        });

        function animateCursor() {
            currentX += (targetX - currentX) * ease;
            currentY += (targetY - currentY) * ease;

            cursor.style.transform = `translate3d(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px), 0)`;

            requestAnimationFrame(animateCursor);
        }

        animateCursor();
    }

    const navMenu = document.querySelector('.navMenuCont');
    const nav = document.querySelector('nav');
    const body = document.querySelector('body');

    if (navMenu && nav && body) {
        navMenu.addEventListener('click', () => {
            nav.classList.toggle('menu-active');
            body.classList.toggle('menu-active');
        });
    }

    const hiddenElements = document.querySelectorAll('.hidden');
    const VIEWPORT_TWEAKS = {
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.5
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

    const projectImages = document.querySelectorAll('.projekti .img');
    const projectObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            entry.target.classList.toggle('is-visible', entry.isIntersecting);
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 180px 0px 180px'
    });

    projectImages.forEach((image) => projectObserver.observe(image));
}

function beninging() {
    const startFill = document.querySelector('.startFill');
    if (startFill) {
        startFill.remove();
    }
    const columns = document.querySelectorAll(".column");
    if(columns){
        columns.forEach((column) => {
            column.classList.add("animate");
        })
    }
}

function startPortfolio() {
    if (window.__portfolioStarted) return;
    window.__portfolioStarted = true;

    initPage();
    beninging();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startPortfolio);
} else {
    startPortfolio();
}

window.addEventListener('pagehide', () => {
    delete window.__portfolioStarted;
});

window.addEventListener('pageshow', (event) => {
    window.__portfolioStarted = false;
    if (event.persisted || document.readyState === 'complete') {
        startPortfolio();
    }
});

function changeSite(url) {
    const columns = document.querySelectorAll(".column");

    if (columns) {
        columns.forEach((column) => {
            column.classList.remove("animate");
            column.classList.add("animate2");
        });

        setTimeout(() => {
            window.location.href = url;
        }, 2000);
    }
}


