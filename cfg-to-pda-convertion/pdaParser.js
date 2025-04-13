// PDA.js - Logic for parsing expressions
class PDA {
    constructor() {
        this.stack = [];
    }

    parseExpression(expression) {
        let tokens = this.tokenize(expression);
        let transitions = [];
        
        this.stack.push("E"); // Start with the start symbol
        
        for (let token of tokens) {
            let top = this.stack.pop();

            if (this.isNonTerminal(top)) {
                let production = this.getProduction(top, token);
                if (production) {
                    let newSymbols = production.split(" ").reverse();
                    this.stack.push(...newSymbols);
                    transitions.push(`Applied ${top} → ${production}`);
                } else {
                    return { success: false, error: `Invalid syntax at '${token}'` };
                }
            } else if (top !== token) {
                return { success: false, error: `Unexpected token '${token}', expected '${top}'` };
            }

            transitions.push(`Stack: [${this.stack.join(", ")}]`);
        }

        return { success: this.stack.length === 0, transitions };
    }

    tokenize(expression) {
        return expression.match(/(\d+|\+|\-|\*|\/|\(|\))/g);
    }

    isNonTerminal(symbol) {
        return CFG.hasOwnProperty(symbol);
    }

    getProduction(nonTerminal, token) {
        let rules = CFG[nonTerminal];
        return rules.find(rule => rule.includes(token) || rule.includes("num"));
    }
}

const CFG = {
    "E": ["E + T", "E - T", "T"],
    "T": ["T * F", "T / F", "F"],
    "F": ["( E )", "num"]
};

window.pda = new PDA();
