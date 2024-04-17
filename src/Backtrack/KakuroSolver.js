class GridPoint {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }

    toString() {
        return `${this.row},${this.col}`;
    }
}

class SumClue {
    constructor(index, start, end, sum) {
        this.index = index;
        this.start = start;
        this.end = end;
        this.sum = sum;
    }

    toString() {
        return `${this.index},${this.start},${this.end} => ${this.sum}`;
    }
}

export class KakuroBacktracking {
    constructor(board) {
        console.log("called");
        this.board = board;
        this.rowClues = [];
        this.columnClues = [];
        this.clueGrids = [];
        this.emptyGrids = [];
        this.boardRow = board.length;
        this.boardCol = board[0].length;
        this.steps=[]        
        this.fillable = []     
        this.extractClues();
    }

    extractClues() {
        for (let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board[row].length; col++) {
                const cell = this.board[row][col];
                if (cell === "X") {
                    this.emptyGrids.push(new GridPoint(row, col));
                }else if(cell === "0"){
                    this.fillable.push(new GridPoint(row,col))
                }
                else if (cell.includes("\\")) {
                    this.clueGrids.push(new GridPoint(row, col));
                    const parts = cell.split("\\");
                    if (parts[0].length > 0 && parts[0] !== "X") {
                        const sum = parseInt(parts[0], 10);
                        const endRow = this.findEndRow(row, col);
                        this.columnClues.push(new SumClue(col, row + 1, endRow, sum));
                    }
                    if (parts.length > 1 && parts[1].length > 0) {
                        const sum = parseInt(parts[1], 10);
                        const endCol = this.findEndCol(row, col);
                        this.rowClues.push(new SumClue(row, col + 1, endCol, sum));
                    }
                }
            }
        }
    }

    findEndRow(startRow, col) {
        let endRow = startRow;
        while (endRow + 1 < this.board.length && this.board[endRow + 1][col] !== "X" && !this.board[endRow + 1][col].includes("\\")) {
            endRow++;
        }
        return endRow;
    }

    findEndCol(row, startCol) {
        let endCol = startCol;
        while (endCol + 1 < this.board[row].length && this.board[row][endCol + 1] !== "X" && !this.board[row][endCol + 1].includes("\\")) {
            endCol++;
        }
        return endCol;
    }

    solveBackTrack() {
        if (this.solveBackTrackHelper(0, 0)) {
            return true;
        } else {
            console.log("No solution or the problem space is too large");
            return false;
        }
    }

    solveBackTrackHelper(row, col) {
        if (row >= this.boardRow) {
            return true;
        }

        const nextRow = col === this.boardCol - 1 ? row + 1 : row;
        const nextCol = col === this.boardCol - 1 ? 0 : col + 1;

        if (this.board[row][col] !== "0") {
            return this.solveBackTrackHelper(nextRow, nextCol);
        }

        if (!this.isInEmptyGrid(row, col)) {
            for (let num = 1; num <= 9; num++) {
                if (this.isValid(row, col, num)) {
                    this.board[row][col] = String(num);
                    this.steps.push(this.board.map(row => [... row]));
                    if (this.solveBackTrackHelper(nextRow, nextCol)) {
                        return true;
                    }
                    this.board[row][col] = "0";
                    this.steps.push(this.board.map(row => [... row]));
                }
            }
        } else {
            return this.solveBackTrackHelper(nextRow, nextCol);
        }

        return false;
    }

    isValid(row, col, num) {
        num = parseInt(num);

        for (let clue of this.rowClues) {
            if (clue.index === row && col >= clue.start && col <= clue.end) {
                for (let k = clue.start; k <= clue.end; k++) {
                    if (parseInt(this.board[row][k]) == num) return false;
                }
                let total = num;
                let allFilled = true;
                for (let k = clue.start; k <= clue.end; k++) {
                    let cellValue = parseInt(this.board[row][k]);
                    if (isNaN(cellValue) || this.board[row][k] === "0" && k !== col) {
                        allFilled = false;
                        continue;
                    }
                    total += cellValue;
                }
                if (total > clue.sum || (allFilled && total !== clue.sum)) {
                    return false;
                }
            }
        }

        for (let clue of this.columnClues) {
            if (clue.index === col && row >= clue.start && row <= clue.end) {
                for (let k = clue.start; k <= clue.end; k++) {
                    if (parseInt(this.board[k][col]) == num) return false;
                }
                let total = num;
                let allFilled = true;
                for (let k = clue.start; k <= clue.end; k++) {
                    let cellValue = parseInt(this.board[k][col]);
                    if (isNaN(cellValue) || this.board[k][col] === "0" && k !== row) {
                        allFilled = false;
                        continue;
                    }
                    total += cellValue;
                }
                if (total > clue.sum || (allFilled && total !== clue.sum)) {
                    return false;
                }
            }
        }

        return true;
    }

    printBoard() {
        for (let row of this.board) {
            console.log(row.join(", "));
        }
    }

    isInEmptyGrid(row, col) {
        for (let gridPoint of this.emptyGrids) {
            if (gridPoint.row === row && gridPoint.col === col) {
                return true;
            }
        }
        return false;
    }

    
}
