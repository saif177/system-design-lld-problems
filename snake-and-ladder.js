class Dice {
  constructor(count = 1) {
    this.count = count;
  }

  roll() {
    let total = 0;
    for (let i = 0; i < this.count; i++) {
      total += Math.floor(Math.random() * 6) + 1;
    }
    return total;
  }
}

class Player {
  constructor(name) {
    this.name = name;
    this.position = 0;
  }

  move(steps) {
    this.position += steps;
  }

  setPosition(position) {
    this.position = position;
  }
}

class Board {
  constructor(size, snakes = {}, ladders = {}) {
    this.size = size;
    this.snakes = snakes;
    this.ladders = ladders;
  }

  getNewPosition(position) {
    if (this.ladders[position]) {
      console.log(`${position} -> Ladder to ${this.ladders[position]}`);
      return this.ladders[position];
    }
    if (this.snakes[position]) {
      console.log(`${position} -> Snake to ${this.snakes[position]}`);
      return this.snakes[position];
    }
    return position;
  }
}

class Game {
  constructor(boardSize, players, diceCount = 1, snakes = {}, ladders = {}) {
    this.board = new Board(boardSize, snakes, ladders);
    this.players = players.map((name) => new Player(name));
    this.dice = new Dice(diceCount);
    this.winner = null;
    this.currentTurn = 0;
  }

  play() {
    console.log("Game Start!");

    while (!this.winner) {
      const currentPlayer =
        this.players[this.currentTurn % this.players.length];
      const roll = this.dice.roll();

      console.log(`${currentPlayer.name} rolls ${roll}`);

      let nextPosition = currentPlayer.position + roll;
      if (nextPosition > this.board.size) {
        console.log(`${currentPlayer.name} needs exact roll to finish.`);
      } else {
        const finalPosition = this.board.getNewPosition(nextPosition);
        currentPlayer.setPosition(finalPosition);
        console.log(`${currentPlayer.name} moves to ${finalPosition}`);

        if (finalPosition === this.board.size) {
          this.winner = currentPlayer.name;
          console.log(`Congratulations! ${this.winner} wins!`);
          break;
        }
      }

      this.currentTurn++;
    }
  }
}

const snakes = {
  16: 6,
  47: 26,
  49: 11,
  56: 53,
  62: 19,
  64: 60,
  87: 24,
  93: 73,
  95: 75,
  98: 78,
};

const ladders = {
  1: 38,
  4: 14,
  9: 31,
  21: 42,
  28: 84,
  36: 44,
  51: 67,
  71: 91,
  80: 100,
};

const players = ["Alice", "Bob", "Charlie"];

const game = new Game(100, players, 1, snakes, ladders);
game.play();
