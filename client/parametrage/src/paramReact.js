'use strict';
/**
 * @fileOverview Parametrage in React.js
 * @author Bertrand Hédelin  © Copyright 2017-2022, B. Petit-Hédelin
 * @version 1.0
 * To compile JSX to js, launch this in the terminal, in ./client/parametrage
 * npx babel --watch src --out-dir . --presets react-app/prod
 * Il faut aussi: browserify paramReact.js -o paramReactbundle.js
 */

var par;
var ipConfig = require("../../serveur/ipConfig.json");

var index = Math.floor((Math.random() * 10000) + 1); // Pour identifier le client
var ws;

var msg = { // On met des valeurs pas defaut
  type: "configuration",
  text: "ECRAN_NOIR",
  pseudo: "Anonyme",
  value: 0
}

function initWSSocket(host) {

  window.resizeTo(900, 600);

  ws = new WebSocket("ws://" + host + ":" + ipConfig.websocketServeurPort);
  console.log("configurateur ws://" + host + ":" + ipConfig.websocketServeurPort);

  ws.onopen = function (event) {
    var msg = {
      type: "startSpectateur",
      text: "pieceParameters",
      id: index
    }
    console.log("ID sent to server:", msg.id);
    ws.send(JSON.stringify(msg));
  };

  //Traitement de la Réception sur le client
  ws.onmessage = function (event) {
    var msgRecu = JSON.parse(event.data);
    switch (msgRecu.type) {

      case "message":
        console.log(msgRecu);
        //document.getElementById("MessageDuServeur").innerHTML = msgRecu.value;
        break;

      case "skiniParametres":
        console.log("skiniParametres:", msgRecu.value);
        par = msgRecu.value;
        var options = {
          data: par.groupesDesSons,
          minDimensions: [9, 5],
          columns: [
            { type: 'text', width: 80, title: 'Groupe' },
            { type: 'text', width: 80, title: 'Index' },
            { type: 'text', width: 80, title: 'Type' },
            { type: 'text', width: 80, title: 'X' },
            { type: 'text', width: 80, title: 'Y' },
            { type: 'text', width: 140, title: 'Nb of El. or Tank nb' },
            { type: 'text', width: 80, title: 'Color' },
            { type: 'text', width: 80, title: 'Previous' },
            { type: 'text', width: 80, title: 'Scene' },
          ]
        };
        ReactDOM.render(<Jspreadsheet options={options} />, document.getElementById('spreadsheet'));
        break;

      default: console.log("Client reçoit un message inconnu", msgRecu.type);
    }
  };

  ws.onclose = function (event) {
    console.log("Client: websocket closed for :", index);
  }

  window.onbeforeunload = function () {
    msg.type = "closeSpectateur";
    msg.text = "DISCONNECT_SPECTATEUR";
    ws.send(JSON.stringify(msg));
    ws.close();
  }
}
window.initWSSocket = initWSSocket;

// Pour test, inutile sinon
class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return ipConfig.websocketServeurPort;
    }

    return (
      <button onClick={() => this.setState({ liked: true })}>
        Like
      </button>
    );
  }
}

class Jspreadsheet extends React.Component {
  constructor(props) {
    super(props);
    this.options = props.options;
    this.wrapper = React.createRef();
  }

  hideSomeColumns = function (obj) {
    //obj.hideColumn(2);
    //obj.hideColumn(6);
    //obj.hideColumn(8);
    //obj.hideColumn(11);
    //obj.hideColumn(12);
  }

  componentDidMount = function () {
    this.el = jspreadsheet(this.wrapper.current, this.options);
    this.hideSomeColumns(this.el);
  }

  addRow = function () {
    this.el.insertRow();
  }

  updateParameters = function () {
    let param;
    param = this.el.getData();
    console.log(param);

    par.groupesDesSons = param;

    var msg = {
      type: "updateParameters",
      parametersDir : par.sessionPath,
      data: par
    }
    ws.send(JSON.stringify(msg));
  }

  render() {
    return (
      <div>
        <div ref={this.wrapper} />
        <br />
        <input
          className="button"
          type="button"
          value="Add new row"
          onClick={() => this.addRow()}
        />
        <input
          className="button"
          type="button"
          value="Update parameters"
          onClick={() => this.updateParameters()}
        />
      </div>
    );
  }
}

//let domContainer = document.querySelector('#like_button_container');
//ReactDOM.render(<LikeButton />, domContainer);
