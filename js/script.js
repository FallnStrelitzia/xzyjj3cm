// js/script.js
document.addEventListener('DOMContentLoaded', () => {
    // 检查当前页面是否是quiz.html
    if (document.getElementById('quiz-container')) {
        setupQuiz();
    }
    // 检查当前页面是否有每日圣言模块
    if (document.getElementById('daily-quote')) {
        setupDailyQuote();
    }
});

// --- 每日圣言逻辑 ---
const quotes = [
    "这打野会不会玩？",
    "我F键坏了，真的按不出来。",
    "这英雄有问题，绝对是版本陷阱。",
    "对面那谁谁谁，是不是开挂了？",
    "我手机没电了，下次我来。",
    "不是我的问题，是这个世界有问题。",
    "稳住，我们能赢...（然后默默点下投降）",
    "我的我的...（指着别人的屏幕）"
];

function setupDailyQuote() {
    const quoteElement = document.getElementById('daily-quote');
    const newQuoteBtn = document.getElementById('new-quote-btn');

    if (quoteElement && newQuoteBtn) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        quoteElement.textContent = `“${quotes[randomIndex]}”`;

        newQuoteBtn.addEventListener('click', () => {
            const newRandomIndex = Math.floor(Math.random() * quotes.length);
            quoteElement.textContent = `“${quotes[newRandomIndex]}”`;
        });
    }
}

// --- 徐学考试逻辑 ---
const quizData = [
    {
        question: "1. 徐老师的核心物理尺寸经权威认证为：",
        options: ["A. 30cm (梦里)", "B. 3cm (现实)", "C. 0.3cm (谦虚)", "D. 无法测量 (量子态)"],
        answer: "B. 3cm (现实)"
    },
    {
        question: "2. 当游戏陷入逆风时，徐老师最可能说的话是：",
        options: ["A. 兄弟们稳住，我能C！", "B. 这打野会不会玩？", "C. 这英雄有问题，版本陷阱。", "D. B和C都是"],
        answer: "D. B和C都是"
    },
    {
        question: "3. 在饭局结束，服务员拿着账单走来时，徐老师最可能进入什么状态？",
        options: ["A. 豪迈地掏出钱包", "B. 手机突然没电", "C. 突然开始接一个重要电话", "D. B和C的叠加态"],
        answer: "D. B和C的叠加态"
    },
    {
        question: "4. “徐学”的中心思想是：",
        options: ["A. 舍己为人，无私奉献", "B. 宇宙的尽头是3cm", "C. 错的不是我，是这个世界", "D. B和C的哲学统一"],
        answer: "D. B和C的哲学统一"
    }
];

let currentQuestionIndex = 0;
let score = 0;
const quizContainer = document.getElementById('quiz-container');
const resultContainer = document.getElementById('quiz-result');

function setupQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    quizContainer.style.display = 'block';
    resultContainer.style.display = 'none';
    showQuestion();
}

function showQuestion() {
    const questionData = quizData[currentQuestionIndex];
    quizContainer.innerHTML = `
        <h3>${questionData.question}</h3>
        <ul class="quiz-options">
            ${questionData.options.map(option => `<li>${option}</li>`).join('')}
        </ul>
    `;
    
    const options = quizContainer.querySelectorAll('.quiz-options li');
    options.forEach(option => {
        option.addEventListener('click', selectAnswer);
    });
}

function selectAnswer(e) {
    const selectedOption = e.target;
    const answer = quizData[currentQuestionIndex].answer;

    if (selectedOption.textContent === answer) {
        score++;
        selectedOption.style.borderColor = 'var(--text-color)';
        selectedOption.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
    } else {
        selectedOption.style.borderColor = 'var(--warning-color)';
        selectedOption.style.backgroundColor = 'rgba(255, 60, 60, 0.2)';
    }

    const allOptions = quizContainer.querySelectorAll('.quiz-options li');
    allOptions.forEach(opt => opt.style.pointerEvents = 'none');

    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            showQuestion();
        } else {
            showResult();
        }
    }, 1000);
}

function showResult() {
    quizContainer.style.display = 'none';
    resultContainer.style.display = 'block';

    let resultText = '';
    let title = '';

    if (score === quizData.length) {
        title = "徐学大师";
        resultText = `你获得了 ${score}/${quizData.length} 分！恐怖如斯！你对徐老师的理解已臻化境，建议直接加入本馆成为荣誉馆长！`;
    } else if (score >= quizData.length / 2) {
        title = "徐学学者";
        resultText = `你获得了 ${score}/${quizData.length} 分。不错，你已经掌握了徐学的精髓，是徐老师的知音。`;
    } else {
        title = "徐学门外汉";
        resultText = `你只获得了 ${score}/${quizData.length} 分。看来你对徐老师的伟大还知之甚少，建议在馆内多加学习，提高思想觉悟。`;
    }

    resultContainer.innerHTML = `
        <h2>考试结束 - 你的称号: ${title}</h2>
        <p>${resultText}</p>
        <button class="btn restart-btn">再考一次</button>
    `;

    document.querySelector('.restart-btn').addEventListener('click', setupQuiz);
}
