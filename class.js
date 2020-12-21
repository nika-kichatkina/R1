class StateMachine {
  constructor(name, rules) {
    this.prevState = {
      name: 'begin'
    }
    this.state = {
      name: 'begin'
    }
    this.rules = rules
    this.name = name
  }

  inputChar(char) {
    this.prevState = this.state
    if (this.state) {
      this.state = this.rules[this.state.name](char)
    }
  }

  resetState() {
    this.prevState = {
      name: 'begin'
    }
    this.state = {
      name: 'begin'
    }
  }

}

class LexAnal {
  constructor() {
    const wordMachine = new StateMachine('word', {
      begin: char => {
        if (/[a-z]/i.test(char)) {
          return {
            name: 'begin'
          }
        }
      }
    })

    const spaceMachine = new StateMachine('spaces', {
      begin: char => {
        if (char === ' ') {
          return {
            name: 'begin'
          }
        }
      }
    })


    const numberMachine = new StateMachine('number', {
      begin: char => {
        if (/[0-9]/.test(char)) {
          return {
            name: 'num'
          }
        }
      },
      num: char => {
        if (/[0-9]/.test(char)) {
          return {
            name: 'num'
          }
        } else if (char === '.') {
          return {
            name: 'dot',
            notEnd: true
          }
        }
      },
      dot: char => {
        if (/[0-9]/.test(char)) {
          return {
            name: 'dot'
          }
        }
      },
    })

    const appropriationMachine = new StateMachine('appropriation', {
      begin: char => {
        if (char === '=') {
          return {
            name: 'end'
          }
        }
      },
      end: () => undefined
    })

    const roundBracketsMachine = new StateMachine('round brackets', {
      begin: char => {
        if (char === '(' || char === ')') {
          return {
            name: 'end'
          }
        }
      },
      end: () => undefined
    })

    const bracketsMachine = new StateMachine('brackets', {
      begin: char => {
        if (char === '{' || char === '}') {
          return {
            name: 'end'
          }
        }
      },
      end: () => undefined
    })

    const squareBracketsMachine = new StateMachine('square brackets', {
      begin: char => {
        if (char === '[' || char === ']') {
          return {
            name: 'end'
          }
        }
      },
      end: () => undefined
    })


    this.allRules = [wordMachine, spaceMachine, appropriationMachine, numberMachine, roundBracketsMachine, bracketsMachine, squareBracketsMachine];

  }


  getActiveName(machinesList) {
    for (let i = 0; i < machinesList.length; i++) {
      if (machinesList[i].prevState && !machinesList[i].prevState.notEnd) {
        return machinesList[i].name;
      }
    }
  }

  resetAllRules(machinesList) {
    machinesList.forEach(item => {
      item.resetState();
    })
  }


  parse(string) {

    let tokens = [] 
    let charsCounter = 0 

    for (let i = 0; i <= string.length; i++) {
      charsCounter++
      let hasActiveMachine = false
      this.allRules.forEach(machine => {
        machine.inputChar(string[i])
        if (machine.state) {
          hasActiveMachine = true
        }
      })

      if (!hasActiveMachine) {
        if (charsCounter > 1) {
          tokens.push({
            token: this.getActiveName(this.allRules),
            lexeme: string.substring(i - charsCounter + 1, i)
          })
          i--
        } else {
          tokens.push({
            token: undefined,
            lexeme: string.substring(i, i + 1)
          })
        }
        charsCounter = 0
        this.resetAllRules(this.allRules)
      }
    }

    return tokens;
     }


  test(string, expectation) {
    let input = this.parse(string);

    if (input.length !== expectation.length) {
      return false;
    }

    for (var i = 0; i < input.length; i++) {
      if(input[i].token !== expectation[i]){
        return false
      }
    }
     return true;
      }
}
