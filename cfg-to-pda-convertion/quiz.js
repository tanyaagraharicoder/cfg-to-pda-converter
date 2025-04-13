const quizData = [
    { question: "What is CFG used for?", options: ["Parsing", "Encryption", "Compression", "Networking"], answer: "Parsing" },
    { question: "What does PDA stand for?", options: ["Pushdown Automaton", "Power Data Algorithm", "Protocol Data Access", "None"], answer: "Pushdown Automaton" },
    { question: "What is the main component of a PDA?", options: ["Stack", "Queue", "Heap", "List"], answer: "Stack" },
    { question: "CFG is mainly used in?", options: ["Compilers", "Operating Systems", "AI Models", "Databases"], answer: "Compilers" },
    { question: "Which symbol is used for epsilon?", options: ["λ", "Σ", "∅", "ε"], answer: "ε" },
    // { question: "Which symbol is used for epsilon?", options: ["λ", "Σ", "∅", "ε"], answer: "ε" },
    { question: "What type of grammar is CFG?", options: ["Type-0", "Type-1", "Type-2", "Type-3"], answer: "Type-2" },
    { question: "What is a non-terminal symbol?", options: ["a", "S", "0", "1"], answer: "S" },
    { question: "Which of these is a PDA transition function?", options: ["δ(q, a, Z) = (p, XZ)", "q -> a", "S -> A", "L(q)"], answer: "δ(q, a, Z) = (p, XZ)" },
    { question: "How does a PDA process an input?", options: ["Stack operations", "Heap sorting", "Greedy algorithm", "None"], answer: "Stack operations" },
    { question: "What is a final state in PDA?", options: ["Accepting state", "Intermediate state", "Initial state", "None"], answer: "Accepting state" },
    { question: "Which machine is more powerful than PDA?", options: ["Turing Machine", "Finite Automata", "Stack Machine", "None"], answer: "Turing Machine" },
    { question: "What is a terminal symbol in CFG?", options: ["A", "B", "a", "S"], answer: "a" },
    { question: "Which component is unique to PDA?", options: ["Stack", "Tape", "Registers", "Memory"], answer: "Stack" },
    { question: "What is the main difference between DFA and PDA?", options: ["DFA has memory", "PDA uses a stack", "PDA has infinite states", "DFA is non-deterministic"], answer: "PDA uses a stack" },
    { question: "Which automaton is used for recognizing CFG?", options: ["DFA", "NFA", "PDA", "Turing Machine"], answer: "PDA" },
    { question: "Which grammar class does PDA recognize?", options: ["Regular", "Context-Free", "Context-Sensitive", "Unrestricted"], answer: "Context-Free" },
    { question: "What is an ambiguous grammar?", options: ["Generates multiple parse trees", "Has no start symbol", "Only one production", "Cannot generate a language"], answer: "Generates multiple parse trees" },
    { question: "What is a start symbol in CFG?", options: ["Any terminal", "A non-terminal from which derivations begin", "The last production rule", "A special character"], answer: "A non-terminal from which derivations begin" },
    { question: "Which type of pushdown automaton can recognize a deterministic context-free language?", options: ["Non-deterministic PDA", "Deterministic PDA", "DFA", "NFA"], answer: "Deterministic PDA" },
    { question: "Which operation is unique to PDA compared to DFA?", options: ["Push and pop", "State transitions", "Input reading", "Accepting states"], answer: "Push and pop" },
    { question: "Which one is a valid CFG production rule?", options: ["A → aB", "A → B + C", "X = Y", "S -> λ"], answer: "A → aB" },
    { question: "Which of these grammars is more expressive than CFG?", options: ["Regular", "Context-Free", "Context-Sensitive", "Finite Automata"], answer: "Context-Sensitive" },
    { question: "Which automaton has two stacks instead of one?", options: ["PDA", "Turing Machine", "2-PDA", "Finite Automata"], answer: "2-PDA" },
    { question: "Which of the following languages is not context-free?", options: ["L = {a^n b^n | n >= 0}", "L = {a^n b^n c^n | n >= 0}", "L = {a^n | n > 0}", "L = {ε}"], answer: "L = {a^n b^n c^n | n >= 0}" },
    { question: "Which notation is used to define CFG?", options: ["Backus-Naur Form", "Lambda Calculus", "Regular Expressions", "First-Order Logic"], answer: "Backus-Naur Form" },
    { question: "Which language is accepted by a PDA?", options: ["Regular", "Context-Free", "Context-Sensitive", "Unrestricted"], answer: "Context-Free" },
    { question: "How is a PDA different from a Turing Machine?", options: ["PDA has unlimited tape", "PDA uses a stack, TM uses tape", "TM cannot recognize CFG", "PDA has more memory"], answer: "PDA uses a stack, TM uses tape" },
    { question: "What is the primary role of the stack in a PDA?", options: ["Store all input", "Manage recursive structures", "Execute instructions", "Memory allocation"], answer: "Manage recursive structures" },
    { question: "Which PDA configuration results in acceptance?", options: ["Final state reached", "Stack is empty", "Either final state or empty stack", "None"], answer: "Either final state or empty stack" }
];

let questionIndex = 0;
let score = 0;
let timer = 300; // 5 minutes in seconds

function startTimer() {
    setInterval(() => {
        if (timer > 0) {
            timer--;
            document.getElementById("time").textContent = `${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}`;
        } else {
            submitQuiz();
        }
    }, 1000);
}

function loadQuestion() {
    if (questionIndex >= quizData.length) {
        submitQuiz();
        return;
    }

    const question = quizData[questionIndex];
    document.getElementById("question-text").textContent = question.question;
    document.getElementById("options-container").innerHTML = question.options
        .map(option => `<button class="btn" onclick="checkAnswer('${option}')">${option}</button>`)
        .join("");
}

function checkAnswer(selected) {
    if (selected === quizData[questionIndex].answer) {
        score++;
    }
    questionIndex++;
    loadQuestion();
}

function submitQuiz() {
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("result-container").style.display = "block";
    document.getElementById("score").textContent = score;

    let motivation = score >= 15 ? "Excellent! 🎉" : score >= 10 ? "Good effort! 🚀" : "Keep trying! 💪";
    document.getElementById("motivation").textContent = motivation;
}

window.onload = () => {
    startTimer();
    loadQuestion();
};
