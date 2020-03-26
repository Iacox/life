class life {
    constructor(min, max, interval, isFromFile = false, scriptUrl) {
        this.rows = this._getRandom(min, max)
        this.cols = this._getRandom(min, max)
        this.board = []
        this.curCell
        this.boardUpdate = []
        this.interval = interval
        this.lifeInterval
        this.isFromFile = isFromFile
        this.scriptUrl = scriptUrl
        this.requestComplete = false
    }

    _getRandom(min = 0, max = 1) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    _fillTheBoard() {
        for (let i = 0; i < this.rows; i++) {
            this.board[i] = []
            for (let j = 0; j < this.cols; j++) {
                this.board[i][j] = this._getRandom()
            }
        }
        return this.board
    }

    _update() {
        this.boardUpdate = []

        for (let i = 0; i < this.rows; i++) {
            this.boardUpdate[i] = []

            for (let j = 0; j < this.cols; j++) {
                this.curCell = this.board[i][j]
                let curAlive = this._getAlive(i, j) - this.curCell

                if (curAlive < 2 && this.curCell) {
                    this.curCell--
                } else if (curAlive > 1 && curAlive < 4 && this.curCell) {
                    this.curCell
                } else if (curAlive > 3 && this.curCell) {
                    this.curCell--
                } else if (curAlive == 3 && !this.curCell) {
                    this.curCell++
                } else {
                    this.curCell
                }

                this.boardUpdate[i].push(this.curCell)
            }
        }

        this.board = this.boardUpdate.slice()
        console.table(this.board)
    }

    _getAlive(num1, num2) {
        let arr_i = [num1 - 1, num1, num1 + 1],
            arr_j = [num2 - 1, num2, num2 + 1],
            alive = 0

        for (let x = 0; x < arr_i.length; x++) {
            for (let y = 0; y < arr_j.length; y++) {
                if (arr_i[x] >= 0 && arr_j[y] >= 0 && arr_i[x] < this.rows && arr_j[y] < this.cols) {
                    if (this.board[arr_i[x]][arr_j[y]]) {
                        ++alive
                    }
                }
            }
        }
        return alive
    }

    _checkQuit(event) {
        if (event.keyCode === 81 || event.charCode === 81) {
            clearInterval(this.lifeInterval)
        }
    }

    _load(cls) {
        var xhr = new XMLHttpRequest()

        xhr.open('GET', this.scriptUrl, true)
        xhr.send()
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return

            if (xhr.status != 200) {
                alert(xhr.status + ': ' + xhr.statusText)
            } else {
                cls.board = xhr.response
                cls.board = eval(cls.board)
                cls.rows = cls.board.length
                cls.cols = cls.board[0].length
                cls.requestComplete = true
            }
        }
    }

    render() {
        if (this.isFromFile) {
            this._load(this)
            setTimeout(() => { this._finalRender() }, 1000)
        } else {
            this._fillTheBoard()
            this._finalRender()
        }
    }

    _finalRender() {
        console.table(this.board)
        this.lifeInterval = setInterval(() => { this._update() }, this.interval)
        document.addEventListener('keydown', (event) => { this._checkQuit(event) })
    }
}