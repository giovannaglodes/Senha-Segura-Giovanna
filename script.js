```
const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");

menuButton.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
    });
});

const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

const strengthText = document.getElementById("strengthText");
const strengthBar = document.getElementById("strengthBar");
const scoreElement = document.getElementById("score");

const lengthCheck = document.getElementById("lengthCheck");
const longCheck = document.getElementById("longCheck");
const lowerCheck = document.getElementById("lowerCheck");
const upperCheck = document.getElementById("upperCheck");
const numberCheck = document.getElementById("numberCheck");
const symbolCheck = document.getElementById("symbolCheck");
const sequenceCheck = document.getElementById("sequenceCheck");

togglePassword.addEventListener("click", () => {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.textContent = "🙈";
    } else {
        passwordInput.type = "password";
        togglePassword.textContent = "👁️";
    }
});

function hasSequence(password) {
    const sequences = [
        "123", "234", "345", "456", "567",
        "678", "789", "890",
        "abc", "bcd", "cde", "def",
        "efg", "fgh", "ghi", "ijk",
        "qwe", "asd", "zxc"
    ];

    const lowerPassword = password.toLowerCase();

    return sequences.some(sequence =>
        lowerPassword.includes(sequence)
    );
}

function hasTooManyRepeatedCharacters(password) {
    if (password.length < 3) {
        return false;
    }

    for (let i = 0; i < password.length - 2; i++) {
        if (
            password[i] === password[i + 1] &&
            password[i] === password[i + 2]
        ) {
            return true;
        }
    }

    return false;
}

function calculateEntropy(password) {
    let pool = 0;

    if (/[a-z]/.test(password)) {
        pool += 26;
    }

    if (/[A-Z]/.test(password)) {
        pool += 26;
    }

    if (/[0-9]/.test(password)) {
        pool += 10;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
        pool += 32;
    }

    if (pool === 0) {
        return 0;
    }

    return password.length * Math.log2(pool);
}

function updateRequirement(element, valid) {
    if (valid) {
        element.classList.add("valid");
        element.classList.remove("invalid");
        element.querySelector("span").textContent = "✓";
    } else {
        element.classList.remove("valid");
        element.classList.add("invalid");
        element.querySelector("span").textContent = "○";
    }
}

function analyzePassword(password) {
    if (!password) {
        strengthText.textContent = "Nenhuma";
        strengthBar.style.width = "0%";
        strengthBar.style.background = "#ef4444";
        scoreElement.textContent = "0";

        updateRequirement(lengthCheck, false);
        updateRequirement(longCheck, false);
        updateRequirement(lowerCheck, false);
        updateRequirement(upperCheck, false);
        updateRequirement(numberCheck, false);
        updateRequirement(symbolCheck, false);
        updateRequirement(sequenceCheck, false);

        return;
    }

    const hasLength = password.length >= 8;
    const isLong = password.length >= 12;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);
    const noSequence = !hasSequence(password);
    const repeated = hasTooManyRepeatedCharacters(password);

    updateRequirement(lengthCheck, hasLength);
    updateRequirement(longCheck, isLong);
    updateRequirement(lowerCheck, hasLower);
    updateRequirement(upperCheck, hasUpper);
    updateRequirement(numberCheck, hasNumber);
    updateRequirement(symbolCheck, hasSymbol);
    updateRequirement(
        sequenceCheck,
        noSequence && !repeated
    );

    let score = 0;

    if (password.length >= 8) {
        score += 20;
    }

    if (password.length >= 12) {
        score += 15;
    }

    if (password.length >= 16) {
        score += 10;
    }

    if (hasLower) {
        score += 10;
    }

    if (hasUpper) {
        score += 10;
    }

    if (hasNumber) {
        score += 10;
    }

    if (hasSymbol) {
        score += 15;
    }

    const entropy = calculateEntropy(password);

    if (entropy >= 40) {
        score += 5;
    }

    if (entropy >= 60) {
        score += 5;
    }

    if (hasSequence(password)) {
        score -= 15;
    }

    if (repeated) {
        score -= 10;
    }

    score = Math.max(
        0,
        Math.min(100, score)
    );

    let text;
    let color;

    if (score < 25) {
        text = "Muito fraca";
        color = "#ef4444";
    } else if (score < 45) {
        text = "Fraca";
        color = "#ff8a00";
    } else if (score < 65) {
        text = "Média";
        color = "#f5b700";
    } else if (score < 85) {
        text = "Forte";
        color = "#16c784";
    } else {
        text = "Muito forte";
        color = "#00a878";
    }

    strengthText.textContent = text;
    strengthText.style.color = color;
    strengthBar.style.width = `${score}%`;
    strengthBar.style.background = color;
    scoreElement.textContent = score;
}

passwordInput.addEventListener("input", () => {
    analyzePassword(passwordInput.value);
});

const cards = document.querySelectorAll(
    ".security-card, .math-card, .tech-card"
);

const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform =
                    "translateY(0)";
            }
        });
    },
    {
        threshold: 0.15
    }
);

cards.forEach(card => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition =
        "opacity 0.6s ease, transform 0.6s ease";

    observer.observe(card);
});
```
