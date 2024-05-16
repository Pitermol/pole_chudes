import './App.css';
import React from "react";
import raw from "./words.txt"

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mistakes: 0,
      cur_word: "",
      full_word: "",
      guessed: [],
      inputed: [],
      tip: "",
      cur_input: ""
    }
    this.ref = React.createRef();
    fetch(raw).then((res) => res.text()).then((text) => {
      let words = text.split("\n");
      let word = words[Math.floor(Math.random() * words.length)].split("@");
      let cur_word = ""
      for (let i = 0; i < word[0].length; i++) {
        if (word[0][i] !== " ") {
          cur_word += ".";
        } else {
          cur_word += " "
        }
      }
      this.setState({cur_word: cur_word, full_word: word[0], tip: word[1], mistakes: 0, guessed: [], inputed: [], cur_input: ""})
    })
    this.onBtnClick = this.onBtnClick.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onReload = this.onReload.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }
  handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      this.onBtnClick(event);
    }
  }
  onReload = (e) => {
    fetch(raw).then((res) => res.text()).then((text) => {
      let words = text.split("\n");
      let word = words[Math.floor(Math.random() * words.length)].split("@");
      let cur_word = ""
      for (let i = 0; i < word[0].length; i++) {
        if (word[0][i] !== " ") {
          cur_word += ".";
        } else {
          cur_word += " "
        }
      }
      this.setState({cur_word: cur_word, full_word: word[0], tip: word[1], mistakes: 0, guessed: [], inputed: [], cur_input: ""})
    })
    this.ref.current.focus();
  }
  onInputChange = (e) => {
    this.setState({cur_input: e.target.value.toLowerCase()})
  }
  onBtnClick = (e) => {
    if (this.state.cur_input === "") {
      alert("Надо ввести букву")
    } else {
      if (this.state.inputed.includes(this.state.cur_input)) {
        this.setState({cur_input: ""});
        alert("Вы уже вводили эту букву")
      } else {
        let inputed = this.state.inputed;
        inputed.push(this.state.cur_input);
        this.setState({inputed: inputed})
        let cur = ""
        let found = 0
        for (let i = 0; i < this.state.full_word.length; i++) {
          if (this.state.full_word[i] === this.state.cur_input) {
            cur += this.state.full_word[i];
            found++;
          } else {
            if (this.state.cur_word[i] !== ".") {
              cur += this.state.cur_word[i]
            } else {
              cur += "."
            }
          }
        }
        
        this.setState({cur_word: cur, cur_input: ""})
        if (cur === this.state.full_word) {
          alert("Легчайшая!")
        }
        if (found === 0) {
          let mistakes = this.state.mistakes;
          mistakes++;
          this.setState({mistakes: mistakes});
          if (mistakes === 3) {
            alert(`Анлак( Правильное слово: ${this.state.full_word}`);
            fetch(raw).then((res) => res.text()).then((text) => {
              let words = text.split("\n");
              let word = words[Math.floor(Math.random() * words.length)].split("@");
              let cur_word = ""
              for (let i = 0; i < word[0].length; i++) {
                if (word[0][i] !== " ") {
                  cur_word += ".";
                } else {
                  cur_word += " "
                }
              }
              this.setState({cur_word: cur_word, full_word: word[0], tip: word[1], guessed: [], inputed: [], mistakes: 0, cur_input: ""})
            })
          }
        }
      }
    }
    this.ref.current.focus();
  }
  render() {
    return (
      <div class="App">
        <div class="header">
          <p class="carefull">Поле чудес</p>
        </div>
        <h1 class="word">{this.state.cur_word}</h1>
        <div>
          <input onKeyPress={this.handleKeyPress} ref={this.ref} autoFocus type="text" maxLength="1" placeholder="Буква" onChange={this.onInputChange} value={this.state.cur_input} />
          <button onClick={this.onBtnClick}>Отправить букву</button>
        </div>
        <h3 style={{color: this.state.mistakes === 0 ? "#00ff00" : this.state.mistakes === 1 ? "#f68379" : "#FD0E35"}}>Ошибок подряд: {this.state.mistakes}</h3>

        <div class="reload">
          <button onClick={this.onReload}>Обновить вопрос</button>
        </div>
        <h5>Подсказка: {this.state.tip}</h5>
      </div>
    );
  }
}

export default App;
