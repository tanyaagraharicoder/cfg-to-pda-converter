document.addEventListener("DOMContentLoaded", function () {
    document.body.classList.add("theme-1");
});

function changeTheme(themeNumber) {
    document.body.className = `theme-${themeNumber}`;
}
const svg = d3.select("#pdaCanvas");
const finalSvg = d3.select("#finalPDACanvas");
const questionSelect = document.getElementById("questionSelect");
const startButton = document.getElementById("startButton");
const processingMessage = document.getElementById("processingMessage");
const stepList = document.getElementById("stepList");
const customInputSection = document.getElementById("customInputSection");
const customDescription = document.getElementById("customDescription");
const customInput = document.getElementById("customInput");
const customSteps = document.getElementById("customSteps");
const addCustomQuestion = document.getElementById("addCustomQuestion");

// ✅ Define Multiple Default Questions
const questions = {
    q1: {
        description: "L = { aⁿbⁿ | n ≥ 1 }",
        input: "aabb",
        steps: [
            { from: "q0", to: "q0", input: "a", stack: "Push A", stackContent: ["A"] },
            { from: "q0", to: "q0", input: "a", stack: "Push A", stackContent: ["A", "A"] },
            { from: "q0", to: "q1", input: "b", stack: "Pop A", stackContent: ["A"] },
            { from: "q1", to: "q1", input: "b", stack: "Pop A", stackContent: [] },
            { from: "q1", to: "qf", input: "ε", stack: "Accept", stackContent: [] }
        ]
    },
    q2: {
        description: "L = { aⁿbⁿcⁿ | n ≥ 1 }",
        input: "aabbcc",
        steps: [
            { from: "q0", to: "q0", input: "a", stack: "Push A", stackContent: ["A"] },
            { from: "q0", to: "q0", input: "a", stack: "Push A", stackContent: ["A", "A"] },
            { from: "q0", to: "q1", input: "b", stack: "Pop A", stackContent: ["A"] },
            { from: "q1", to: "q1", input: "b", stack: "Pop A", stackContent: [] },
            { from: "q1", to: "q2", input: "c", stack: "Push C", stackContent: ["C"] },
            { from: "q2", to: "q2", input: "c", stack: "Push C", stackContent: ["C", "C"] },
            { from: "q2", to: "qf", input: "ε", stack: "Accept", stackContent: [] }
        ]
    }
};

// ✅ Show custom input section if "Custom Question" is selected
questionSelect.addEventListener("change", () => {
    if (questionSelect.value === "custom") {
        customInputSection.style.display = "block";
    } else {
        customInputSection.style.display = "none";
    }
});

// ✅ Allow users to add a custom question
addCustomQuestion.addEventListener("click", () => {
    const desc = customDescription.value.trim();
    const inputStr = customInput.value.trim();
    const rawSteps = customSteps.value.trim().split("\n");

    if (!desc || !inputStr || rawSteps.length === 0) {
        alert("Please provide all details for the custom question.");
        return;
    }

    const steps = rawSteps.map(line => {
        const [from, to, input, stack] = line.split(",");
        return { from, to, input, stack, stackContent: [] };
    });

    questions.custom = { description: desc, input: inputStr, steps };
    alert("Custom question added!");
});

// ✅ Start button event listener
startButton.addEventListener("click", function () {
    const selectedQuestion = questionSelect.value;
    if (selectedQuestion in questions) {
        drawPDA(selectedQuestion);
    } else {
        alert("Please select a valid question.");
    }
});

// ✅ Function to Draw PDA Transitions Step by Step
function drawPDA(question) {
    svg.selectAll("*").remove();
    stepList.innerHTML = "";
    processingMessage.style.display = "block";

    setTimeout(() => {
        processingMessage.style.display = "none";

        const steps = questions[question].steps;
        steps.forEach((step, index) => {
            setTimeout(() => {
                stepList.innerHTML += `<li><b>${step.from} → ${step.to}</b>: ${step.input} | ${step.stack} | Stack: [${step.stackContent.join(", ")}]</li>`;
                drawState(step.from, step.to, step.input, step.stack, step.stackContent);
            }, index * 2000);
        });

        setTimeout(() => {
            drawFinalPDA(question);
        }, steps.length * 2000 + 2000);

    }, 2000);
}

// ✅ Function to Draw Each State & Transition
function drawState(from, to, input, stack, stackContent) {
    svg.selectAll("*").remove();

    // Draw Current State
    svg.append("circle")
        .attr("cx", 400)
        .attr("cy", 200)
        .attr("r", 50)
        .attr("class", to === "qf" ? "final-state" : "state");

    svg.append("text")
        .attr("x", 400)
        .attr("y", 205)
        .attr("text-anchor", "middle")
        .attr("class", "label")
        .text(to);

    // Stack Visualization
    let stackX = 600, stackY = 200;
    stackContent.forEach((item, index) => {
        svg.append("rect")
            .attr("x", stackX)
            .attr("y", stackY - (index * 30))
            .attr("width", 40)
            .attr("height", 30)
            .attr("class", "stack-box");

        svg.append("text")
            .attr("x", stackX + 20)
            .attr("y", stackY - (index * 30) + 20)
            .attr("text-anchor", "middle")
            .attr("class", "label")
            .text(item);
    });

    // Transition Arrow
    svg.append("line")
        .attr("x1", 450)
        .attr("y1", 200)
        .attr("x2", 550)
        .attr("y2", 200)
        .attr("class", "transition");

    svg.append("text")
        .attr("x", 500)
        .attr("y", 190)
        .attr("text-anchor", "middle")
        .attr("class", "label")
        .text(`${input} / ${stack}`);
}

// ✅ Function to Draw Final PDA Diagram
function drawFinalPDA(question) {
    finalSvg.selectAll("*").remove();

    const steps = questions[question].steps;
    const states = ["q0", "q1", "q2", "qf"];
    const statePositions = { q0: 100, q1: 300, q2: 500, qf: 700 };

    // Draw All States
    states.forEach((state) => {
        finalSvg.append("circle")
            .attr("cx", statePositions[state])
            .attr("cy", 200)
            .attr("r", 50)
            .attr("class", state === "qf" ? "final-state" : "state");

        finalSvg.append("text")
            .attr("x", statePositions[state])
            .attr("y", 205)
            .attr("text-anchor", "middle")
            .attr("class", "label")
            .text(state);
    });

    // Draw Transitions with Labels
    steps.forEach((step) => {
        finalSvg.append("line")
            .attr("x1", statePositions[step.from] + 50)
            .attr("y1", 200)
            .attr("x2", statePositions[step.to] - 50)
            .attr("y2", 200)
            .attr("class", "transition");

        finalSvg.append("text")
            .attr("x", (statePositions[step.from] + statePositions[step.to]) / 2)
            .attr("y", 180)
            .attr("text-anchor", "middle")
            .attr("class", "label")
            .text(`${step.input} / ${step.stack}`);
    });
}

function changeTheme(themeNumber) {
    document.body.className = "";
    document.body.classList.add(`theme-${themeNumber}`);
}
// Knowledge Hub Content
function loadKnowledge() {
    document.getElementById("knowledgeContent").innerHTML = `
        <h3>What is Context-Free Grammar (CFG)?</h3>
        <p>A Context-Free Grammar (CFG) is a set of rules that describe the syntax of a language. It is widely used in compilers, programming languages, and natural language processing (NLP).</p>
        <h2> Components of a CFG:</h2>
        <p> Non-terminals (Variables): Symbols that can be replaced (e.g., S, A, B).
Terminals: Actual symbols of the language (e.g., a, b, 0, 1).
Production Rules: Rules that describe how symbols can be transformed (e.g., S → AB or A → a).
Start Symbol: The rule from where parsing begins (usually denoted as S).</p>
        

        <h3>What is a PDA?</h3>
        <p>A Pushdown Automaton (PDA) is a type of computational model that extends a Finite State Machine (FSM) by adding an extra memory component called a stack. This additional memory allows it to recognize context-free languages (CFLs), which finite automata alone cannot handle.

It is widely used in parsers, programming languages, compilers, and artificial intelligence.</p>
<h3>Why Do We Need Pushdown Automata (PDA)?</h3>
        <p>CFGs alone cannot be implemented using finite state machines (FSMs) because they require memory to handle recursion and nested structures.

This is where Pushdown Automata (PDA) comes in! 🎯

A PDA is an FSM with an extra memory stack, allowing it to recognize languages like palindromes, nested structures, and balanced parentheses.</p>


    `;
}

// Quiz Section
let quizQuestions = [
    { question: "What does CFG stand for?", options: ["Control Flow Graph", "Context-Free Grammar", "Coded Function Graph"], answer: 1 },
    { question: "What is a PDA used for?", options: ["Data Encryption", "Recognizing CFGs", "Sorting Arrays"], answer: 1 },
];

function startQuiz() {
    let quizHTML = "";
    quizQuestions.forEach((q, i) => {
        quizHTML += `<p>${q.question}</p>`;
        q.options.forEach((option, j) => {
            quizHTML += `<input type="radio" name="q${i}" value="${j}"> ${option} <br>`;
        });
    });
    quizHTML += `<button onclick="submitQuiz()">Submit</button>`;
    document.getElementById("quizContainer").innerHTML = quizHTML;
}

function submitQuiz() {
    let score = 0;
    quizQuestions.forEach((q, i) => {
            let selected = document.querySelector(`input[name="q${i}"]:checked`);
            if (selected && parseInt(selected.value) === q.answer) {
                score++;
            }
        });
    document.getElementById("scoreBoard").innerHTML = `Your Score: ${score} / ${questions.length}`;
}
// ✅ Function to Draw PDA Transitions Step by Step & Update Transition Table
function drawPDA(question) {
    svg.selectAll("*").remove();
    stepList.innerHTML = "";
    processingMessage.style.display = "block";

    // ✅ Clear previous table rows before adding new transitions
    let tableBody = document.querySelector("#transitionTable tbody");
    tableBody.innerHTML = "";

    setTimeout(() => {
        processingMessage.style.display = "none";

        const steps = questions[question].steps;
        steps.forEach((step, index) => {
            setTimeout(() => {
                stepList.innerHTML += `<li><b>${step.from} → ${step.to}</b>: ${step.input} | ${step.stack} | Stack: [${step.stackContent.join(", ")}]</li>`;
                drawState(step.from, step.to, step.input, step.stack, step.stackContent);

                // ✅ Add transition details to the table
                updateTransitionTable(index + 1, step.from, step.input, step.stackContent.join(", "), step.stack, step.stackContent.join(", "), step.to);
            }, index * 2000);
        });

        setTimeout(() => {
            drawFinalPDA(question);
        }, steps.length * 2000 + 2000);

    }, 2000);
}

// ✅ Function to Update Transition Table
function updateTransitionTable(step, currentState, input, stackBefore, action, stackAfter, nextState) {
    let tableBody = document.querySelector("#transitionTable tbody");

    let newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>${step}</td>
        <td>${currentState}</td>
        <td>${input === "ε" ? "ε (Lambda)" : input}</td>
        <td>${stackBefore || "∅"}</td>
        <td>${action}</td>
        <td>${stackAfter || "∅"}</td>
        <td>${nextState}</td>
    `;

    tableBody.appendChild(newRow);
}
function scrollToBottom() {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    });
}

// Call this inside drawPDA() after each step is added:
setTimeout(() => {
    stepList.innerHTML += `<li><b>${step.from} → ${step.to}</b>: ${step.input} | ${step.stack} | Stack: [${step.stackContent.join(", ")}]</li>`;
    drawState(step.from, step.to, step.input, step.stack, step.stackContent);
    scrollToBottom();  // Automatically scrolls to the latest step
}, index * 2000);







