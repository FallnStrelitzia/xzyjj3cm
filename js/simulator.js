// js/simulator.js
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('simulator-container')) {
        setupSimulator();
    }
});

// --- 危机应对模拟器逻辑 ---
const scenarios = [
    {
        scenario: "游戏中你使用亚索战绩0/8/0，此时队友打字:'?'",
        options: [
            { text: "打野一次没来过，怎么玩？", correct: true },
            { text: "对面中单太强了，我稳住发育。", correct: false },
            { text: "我的我的，这波我上头了。", correct: false },
            { text: "键盘有问题，E技能按不出来。", correct: true }
        ],
        explanation: "一个合格的徐学家，必须明白责任永远在队友和设备。'我的'这两个字，是思想觉悟不够高的表现。"
    },
    {
        scenario: "饭局结束，服务员拿着账单向你走来，你该怎么办？",
        options: [
            { text: "豪迈地挥手：‘我来！’", correct: false },
            { text: "拿起手机，假装接一个十万火急的电话，边走边说。", correct: true },
            { text: "低头系鞋带，直到有人买单为止。", correct: true },
            { text: "看着兄弟们，真诚地问：‘今天谁带钱包了？’", correct: false }
        ],
        explanation: "薛定谔的钱包定律指出，在观测前，钱包永远处于没钱/没带的叠加态。主动买单是宇宙的禁忌。打电话和系鞋带是两大经典规避手段。"
    },
    {
        scenario: "有人对3cm的伟大产生质疑，你如何回应？",
        options: [
            { text: "承认这是个玩笑，大家开心就好。", correct: false },
            { text: "引用《宇宙奇点尺》的考古发现，证明这是物理常数。", correct: true },
            { text: "反问对方：‘你连徐学都不懂，我们没有共同话题。’", correct: true },
            { text: "沉默，并用怜悯的眼神看着他。", correct: true }
        ],
        explanation: "3cm是信仰，不是科学，不容置疑。任何动摇军心的行为都应被视为异端。引用史实、划清界限、精神碾压都是标准操作。"
    }
];

let currentScenarioIndex = 0;
let correctChoices = 0;
const simulatorContainer = document.getElementById('simulator-container');
const resultContainer = document.getElementById('simulator-result');

function setupSimulator() {
    currentScenarioIndex = 0;
    correctChoices = 0;
    simulatorContainer.style.display = 'block';
    resultContainer.style.display = 'none';
    showScenario();
}

function showScenario() {
    const scenarioData = scenarios[currentScenarioIndex];
    simulatorContainer.innerHTML = `
        <h3>情境 ${currentScenarioIndex + 1}: ${scenarioData.scenario}</h3>
        <ul class="quiz-options">
            ${scenarioData.options.map(option => `<li>${option.text}</li>`).join('')}
        </ul>
    `;
    
    const options = simulatorContainer.querySelectorAll('.quiz-options li');
    options.forEach(option => {
        option.addEventListener('click', selectAnswer);
    });
}

function selectAnswer(e) {
    const selectedOptionEl = e.target;
    const selectedText = selectedOptionEl.textContent;
    const scenarioData = scenarios[currentScenarioIndex];
    const selectedOption = scenarioData.options.find(o => o.text === selectedText);

    if (selectedOption.correct) {
        correctChoices++;
        selectedOptionEl.style.borderColor = 'var(--text-color)';
        selectedOptionEl.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
    } else {
        selectedOptionEl.style.borderColor = 'var(--warning-color)';
        selectedOptionEl.style.backgroundColor = 'rgba(255, 60, 60, 0.2)';
    }

    const allOptions = simulatorContainer.querySelectorAll('.quiz-options li');
    allOptions.forEach(opt => opt.style.pointerEvents = 'none');
    
    // 显示解释
    const explanationEl = document.createElement('p');
    explanationEl.className = 'explanation';
    explanationEl.innerHTML = `<strong>//: 官方解读:</strong> ${scenarioData.explanation}`;
    simulatorContainer.appendChild(explanationEl);

    setTimeout(() => {
        currentScenarioIndex++;
        if (currentScenarioIndex < scenarios.length) {
            showScenario();
        } else {
            showResult();
        }
    }, 4000); // 延长等待时间以便阅读解读
}

function showResult() {
    simulatorContainer.style.display = 'none';
    resultContainer.style.display = 'block';

    let resultText = '';
    let title = '';

    if (correctChoices === scenarios.length) {
        title = "甩锅宗师";
        resultText = `你获得了 ${correctChoices}/${scenarios.length} 的高分！你的每一次选择都闪耀着智慧的光芒，徐老师的衣钵后继有人！`;
    } else if (correctChoices >= scenarios.length / 2) {
        title = "甩锅大师";
        resultText = `你获得了 ${correctChoices}/${scenarios.length} 分。你对“责任转移”的理解已经相当深刻，是时候在实战中检验你的理论了。`;
    } else {
        title = "责任的奴隶";
        resultText = `你只获得了 ${correctChoices}/${scenarios.length} 分。你的思想很危险，居然还残留着承担责任的念头。建议重修《徐学概论》。`;
    }

    resultContainer.innerHTML = `
        <h2>模拟结束 - 你的称号: ${title}</h2>
        <p>${resultText}</p>
        <button class="btn restart-btn">再来一次</button>
    `;

    document.querySelector('.restart-btn').addEventListener('click', setupSimulator);
}