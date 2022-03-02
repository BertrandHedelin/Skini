'use strict';
// To compile JSX to js, launch this in the terminal, in ./client/configurateur
// npx babel --watch src --out-dir . --presets react-app/prod
// Il faut aussi: browserify configReact.js -o configReactbundle.js

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var par;
var ipConfig = require("../../serveur/ipConfig.json");

var index = Math.floor(Math.random() * 10000 + 1); // Pour identifier le client
var ws;

var msg = { // On met des valeurs pas defaut
  type: "configuration",
  text: "ECRAN_NOIR",
  pseudo: "Anonyme",
  value: 0
};

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
  };
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
    };
    ws.send(JSON.stringify(msg));
  } else {
    alert("CC or CC value undefined:", controlChange, controlChangeValue);
  }
}
window.saisiCC = saisiCC;

function initWSSocket(host) {

  ws = new WebSocket("ws://" + host + ":" + ipConfig.websocketServeurPort);
  console.log("configurateur ws://" + host + ":" + ipConfig.websocketServeurPort);

  ws.onopen = function (event) {
    var msg = {
      type: "startSpectateur",
      text: "configurateur",
      id: index
    };
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
          minDimensions: [10, 10],
          columns: [{ type: 'text', width: 80, title: 'Note' }, { type: 'text', width: 80, title: 'Note stop' }, { type: 'text', width: 80, title: 'Flag' }, { type: 'text', width: 120, title: 'Text' }, { type: 'text', width: 120, title: 'Sound file' }, { type: 'text', width: 80, title: 'Instrument' }, { type: 'text', width: 80, title: 'Slot' }, { type: 'text', width: 80, title: 'Type' }, { type: 'text', width: 80, title: 'Free' }, { type: 'text', width: 80, title: 'Group' }, { type: 'text', width: 80, title: 'Duration' }]
        };
        ReactDOM.render(React.createElement(Jspreadsheet, { options: options }), document.getElementById('spreadsheet'));
        break;

      default:
        console.log("Client reçoit un message inconnu");
    }
  };

  ws.onclose = function (event) {
    console.log("Client: websocket closed for :", index);
  };

  window.onbeforeunload = function () {
    msg.type = "closeSpectateur";
    msg.text = "DISCONNECT_SPECTATEUR";
    ws.send(JSON.stringify(msg));
    ws.close();
  };
}
window.initWSSocket = initWSSocket;

// Pour test, inutile sinon

var LikeButton = function (_React$Component) {
  _inherits(LikeButton, _React$Component);

  function LikeButton(props) {
    _classCallCheck(this, LikeButton);

    var _this = _possibleConstructorReturn(this, (LikeButton.__proto__ || Object.getPrototypeOf(LikeButton)).call(this, props));

    _this.state = { liked: false };
    return _this;
  }

  _createClass(LikeButton, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      if (this.state.liked) {
        return ipConfig.websocketServeurPort;
      }

      return React.createElement(
        "button",
        { onClick: function onClick() {
            return _this2.setState({ liked: true });
          } },
        "Like"
      );
    }
  }]);

  return LikeButton;
}(React.Component);

var Jspreadsheet = function (_React$Component2) {
  _inherits(Jspreadsheet, _React$Component2);

  function Jspreadsheet(props) {
    _classCallCheck(this, Jspreadsheet);

    var _this3 = _possibleConstructorReturn(this, (Jspreadsheet.__proto__ || Object.getPrototypeOf(Jspreadsheet)).call(this, props));

    _this3.hideSomeColumns = function (obj) {
      //obj.hideColumn(2);
      //obj.hideColumn(6);
      //obj.hideColumn(8);
      obj.hideColumn(11);
      obj.hideColumn(12);
    };

    _this3.componentDidMount = function () {
      this.el = jspreadsheet(this.wrapper.current, this.options);
      this.hideSomeColumns(this.el);
    };

    _this3.addRow = function () {
      this.el.insertRow();
    };

    _this3.updateDescriptors = function () {
      var descr = void 0;
      descr = this.el.getData();
      console.log(descr);
      var msg = {
        type: "updateSession",
        data: descr
      };
      ws.send(JSON.stringify(msg));
    };

    _this3.options = props.options;
    _this3.wrapper = React.createRef();
    return _this3;
  }

  _createClass(Jspreadsheet, [{
    key: "render",
    value: function render() {
      var _this4 = this;

      return React.createElement(
        "div",
        null,
        React.createElement("div", { ref: this.wrapper }),
        React.createElement("br", null),
        React.createElement("input", {
          className: "button",
          type: "button",
          value: "Add new row",
          onClick: function onClick() {
            return _this4.addRow();
          }
        }),
        React.createElement("input", {
          className: "button",
          type: "button",
          value: "Update descriptors",
          onClick: function onClick() {
            return _this4.updateDescriptors();
          }
        })
      );
    }
  }]);

  return Jspreadsheet;
}(React.Component);

//let domContainer = document.querySelector('#like_button_container');
//ReactDOM.render(<LikeButton />, domContainer);