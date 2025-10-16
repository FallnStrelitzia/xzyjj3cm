// js/adventure.js
document.addEventListener('DOMContentLoaded', () => {
    const storyTextElement = document.getElementById('story-text');
    const optionsButtonsElement = document.getElementById('options-buttons');

    const story = {
        start: {
            text: "深夜，你在排位赛中遭遇连败。聊天框里，队友的质疑声此起彼伏：'打野在干嘛？' 此时，你作为战绩0/8/1的打野，应该如何应对？",
            options: [
                { text: "“下路叫我去我才去的，怪辅助。”", next: "blameSupport" },
                { text: "“这把我的，锅我背了。”", next: "takeBlame" },
                { text: "“键盘坏了，按不出技能。”", next: "blameKeyboard" }
            ]
        },
        blameSupport: {
            text: "你熟练地打出“辅助不给视野”，成功将火力转移。辅助开始和下路对喷，你趁机静静地刷野，保住了自己的KDA。你感觉自己又领悟了徐学的真谛。",
            options: [
                { text: "开启下一局", next: "start" }
            ]
        },
        takeBlame: {
            text: "你打出了“我的”，队友的怒火瞬间平息，但你的核心尺寸也因此永久-1cm。你输了游戏，也输了人生。",
            options: [
                { text: "重新开始", next: "start" }
            ]
        },
        blameKeyboard: {
            text: "你声称自己的'F'键失灵，导致关键团战没有闪现。这个理由过于经典，以至于队友一时间无法反驳。虽然游戏最终还是输了，但至少锅不在你身上。",
            options: [
                { text: "再来一次", next: "start" }
            ]
        }
    };

    function startGame() {
        showStoryNode("start");
    }

    function showStoryNode(nodeName) {
        const node = story[nodeName];
        storyTextElement.innerHTML = `<p>${node.text}</p>`;
        optionsButtonsElement.innerHTML = '';

        node.options.forEach(option => {
            const button = document.createElement('button');
            button.classList.add('btn');
            button.textContent = option.text;
            button.addEventListener('click', () => selectOption(option));
            optionsButtonsElement.appendChild(button);
        });
    }

    function selectOption(option) {
        showStoryNode(option.next);
    }

    startGame();
});