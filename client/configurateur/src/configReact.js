'use strict';
/**
 * @fileOverview Configurateur in React.js
 * compile JSX to js, launch this in the terminal, in ./client/configurateur
 * npx babel --watch src --out-dir . --presets react-app/prod
 * Do also: browserify configReact.js -o configReactbundle.js
 * 
 * @copyright (C) 2022 Bertrand Petit-Hédelin
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.
 * 
 * @version 1.2
 * @author Bertrand Petit-Hédelin <bertrand@hedelin.fr>
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

function saisiClip() {
  var DAWNote = document.getElementById("numClip").value;
  var DAWChannel = Math.floor(DAWNote / 127) + 1;
  DAWNote = DAWNote % 127;
  if (DAWChannel > 15) {
    console.log("Web Socket Server.js : pushNoteOnDAW: Nombre de canaux midi dépassé.");
    return;
  }

  var msg = {
    type: "configDAWMidiNote",
    bus: par.busMidiDAW,
    channel: DAWChannel,
    note: DAWNote
  }
  ws.send(JSON.stringify(msg));
}
window.saisiClip = saisiClip;

function saisiCC() {
  var controlChange = parseFloat(document.getElementById("numCC").value);
  var controlChangeValue = parseFloat(document.getElementById("valueCC").value);
  var DAWChannel = 1;
  if (controlChange != undefined && controlChangeValue != undefined) {
    var msg = {
      type: "configDAWCC",
      bus: par.busMidiDAW,
      channel: DAWChannel,
      CC: controlChange,
      CCValue: controlChangeValue
    }
    ws.send(JSON.stringify(msg));
  } else {
    alert("CC or CC value undefined:", controlChange, controlChangeValue);
  }
}
window.saisiCC = saisiCC;

function saisiOSC(){
  let IpOSC = document.getElementById("IpOSC").value;
  let messageOSC = document.getElementById("messageOSC").value;
  let value1OSC = document.getElementById("val1OSC").value;

  if (IpOSC != '' && messageOSC != '' && value1OSC != '') {
    var msg = {
      type: "sendOSC",
      IpAddress: IpOSC,
      message: messageOSC,
      value1: value1OSC
    }
    ws.send(JSON.stringify(msg));
  } else {
    alert("OSC command incomplete");
  }
}
window.saisiOSC = saisiOSC;

function initWSSocket(host) {

  window.resizeTo(900, 600);

  ws = new WebSocket("ws://" + host + ":" + ipConfig.websocketServeurPort);
  console.log("configurateur ws://" + host + ":" + ipConfig.websocketServeurPort);

  ws.onopen = function (event) {
    var msg = {
      type: "startSpectateur",
      text: "configurateur",
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
        console.log("skiniParametres:", msgRecu.descriptors);
        par = msgRecu.value;
        var options = {
          data: msgRecu.descriptors,
          minDimensions: [14, 14],
          columns: [
            { type: 'text', width: 80, title: 'Note' },
            { type: 'text', width: 80, title: 'Note stop' },
            { type: 'text', width: 80, title: 'Flag' },
            { type: 'text', width: 120, title: 'Text' },
            { type: 'text', width: 120, title: 'Sound file' },
            { type: 'text', width: 80, title: 'Instrument' },
            { type: 'text', width: 80, title: 'Slot' },
            { type: 'text', width: 80, title: 'Type' },
            { type: 'text', width: 80, title: 'Free' },
            { type: 'text', width: 80, title: 'Group' },
            { type: 'text', width: 80, title: 'Duration' },
            { type: 'text', width: 100, title: 'IP address' },
            { type: 'text', width: 80, title: 'Buffer num' },
            { type: 'text', width: 80, title: 'Level' }
          ]
        };
        ReactDOM.render(<Jspreadsheet options={options} />, document.getElementById('spreadsheet'));
        break;

      default: console.log("Client reçoit un message inconnu");
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

  updateDescriptors = function () {
    let descr;
    descr = this.el.getData();
    console.log(descr);
    var msg = {
      type: "updateSession",
      data: descr
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
          value="Update descriptors"
          onClick={() => this.updateDescriptors()}
        />
      </div>
    );
  }
}

//let domContainer = document.querySelector('#like_button_container');
//ReactDOM.render(<LikeButton />, domContainer);
