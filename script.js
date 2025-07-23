// Configurable constants
const staticCarWidth = 40;
const staticCarHeight = 95;
const carHeightCorrectness = 70;
const transitionTime = 200; // milliseconds
let screenHeight = window.innerHeight;
var sections = []
var navLinks = []


function getScrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop;
}

function getCarPositionFromTarget(targetRect, offsetY = 0) {
    const scrollTop = getScrollTop();
    const top = scrollTop + targetRect.top + offsetY;
    const left = targetRect.left - staticCarWidth / 2;
    return { top, left };
}

function updateCarPosition() {
    const car = document.getElementById("car");
    const target1 = document.getElementById("introduction-vertical-dotted-line");
    const target2 = document.getElementById("introduction-horizontal-dotted-line");
    const target3 = document.getElementById("subsections-vertical-dotted-line");
    if (!car || !target1 || !target2 || !target3) return;

    const carRect = car.getBoundingClientRect();
    const horizontalPathRect = target2.getBoundingClientRect();

    const carTopTarget = getScrollTop() + screenHeight * 0.2;
    const currentCarTop = carRect.top + getScrollTop();

    const steps = [];

    if (carTopTarget + carHeightCorrectness < horizontalPathRect.top + getScrollTop()) {
        if (currentCarTop + carHeightCorrectness > horizontalPathRect.bottom + getScrollTop()) {
            steps.push(...moveRightToLeft());
        }
        const { left } = getCarPositionFromTarget(target1.getBoundingClientRect());
        steps.push([car, "top", `${carTopTarget}px`]);
        steps.push([car, "left", `${left}px`]);
    } else {
        if (currentCarTop + carHeightCorrectness < horizontalPathRect.bottom + getScrollTop()) {
            steps.push(...moveLeftToRight());
        }
        const { left } = getCarPositionFromTarget(target3.getBoundingClientRect());
        steps.push([car, "top", `${carTopTarget}px`]);
        steps.push([car, "left", `${left}px`]);
    }

    transitionSteps(steps);
}

function scrollTrigger() {
    updateCarPosition();
}

function moveRightToLeft() {
    const car = document.getElementById("car");
    const target = document.getElementById("introduction-horizontal-dotted-line");
    if (!car || !target) return [];

    const rect = target.getBoundingClientRect();
    const scrollTop = getScrollTop();
    const top = scrollTop + rect.top - staticCarHeight / 2;
    const left = rect.left - staticCarWidth / 2;

    return [
        [car, "top", `${top}px`],
        [car, "transform", "rotate(90deg)"],
        [car, "left", `${left}px`],
        [car, "transform", "rotate(0deg)"]
    ];
}

function moveLeftToRight() {
    const car = document.getElementById("car");
    const target = document.getElementById("introduction-horizontal-dotted-line");
    if (!car || !target) return [];

    const rect = target.getBoundingClientRect();
    const scrollTop = getScrollTop();
    const top = scrollTop + rect.top - staticCarHeight / 2;
    const left = rect.right - staticCarWidth / 2;

    return [
        [car, "top", `${top}px`],
        [car, "transform", "rotate(90deg)"],
        [car, "left", `${left}px`],
        [car, "transform", "rotate(0deg)"]
    ];
}

function transitionSteps(steps) {
    if (!steps?.length) return;
    let i = 0;
    const interval = setInterval(() => {
        if (i >= steps.length) {
            clearInterval(interval);
            return;
        }
        const [el, prop, val] = steps[i];
        el.style[prop] = val;
        i++;
    }, transitionTime);
}

function debounce(fn, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
}

function updateClock() {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = now.getFullYear();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const date = `${day}\\${month}\\${year}`;
    const time = `${hours}:${minutes}`;

    document.getElementById("clock").innerHTML = `${date}<span style="padding:0 1rem"></span>${time}`;
}



window.addEventListener("DOMContentLoaded", () => {

    sections = document.querySelectorAll("section");
    navLinks = document.querySelectorAll(".tabs a");

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            // Remove active from all
            navLinks.forEach(l => l.classList.remove("active"));
            // Add to clicked one
            link.classList.add("active");
        });
    });

    setInterval(updateClock, 1000);

    const car = document.getElementById("car");
    const target = document.getElementById("introduction-vertical-dotted-line");
    screenHeight = window.innerHeight;

    if (car && target) {
        const targetRect = target.getBoundingClientRect();
        car.style.position = "absolute";
        const offsetY = screenHeight * 0.2;
        const top = Math.max(targetRect.top, offsetY);
        const left = targetRect.left - staticCarWidth / 2;

        car.style.top = `${top}px`;
        car.style.left = `${left}px`;

        setTimeout(() => {
            car.style.transition = `top ${transitionTime / 1000}s ease, left ${transitionTime / 1000}s ease, transform ${transitionTime / 1000}s ease`;
        }, 300);
    }
});

window.onbeforeunload = () => {
    window.scrollTo(0, 0);
};

window.addEventListener("scroll", debounce(scrollTrigger, 30));
window.addEventListener("resize", debounce(updateCarPosition, 30));
