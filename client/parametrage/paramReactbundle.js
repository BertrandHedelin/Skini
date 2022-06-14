(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';
/**
 * @fileOverview Parametrage in React.js
 * @author Bertrand Hédelin  © Copyright 2017-2022, B. Petit-Hédelin
 * @version 1.0
 * To compile JSX to js, launch this in the terminal, in ./client/parametrage
 * npx babel --watch src --out-dir . --presets react-app/prod
 * Il faut aussi: browserify paramReact.js -o paramReactbundle.js
 */

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

function initWSSocket(host) {

  window.resizeTo(900, 600);

  ws = new WebSocket("ws://" + host + ":" + ipConfig.websocketServeurPort);
  console.log("configurateur ws://" + host + ":" + ipConfig.websocketServeurPort);

  ws.onopen = function (event) {
    var msg = {
      type: "startSpectateur",
      text: "pieceParameters",
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
        par = msgRecu.value;
        var options = {
          data: par.groupesDesSons,
          minDimensions: [9, 5],
          columns: [{ type: 'text', width: 80, title: 'Groupe' }, { type: 'text', width: 80, title: 'Index' }, { type: 'text', width: 80, title: 'Type' }, { type: 'text', width: 80, title: 'X' }, { type: 'text', width: 80, title: 'Y' }, { type: 'text', width: 140, title: 'Nb of El. or Tank nb' }, { type: 'text', width: 80, title: 'Color' }, { type: 'text', width: 80, title: 'Previous' }, { type: 'text', width: 80, title: 'Scene' }]
        };
        ReactDOM.render(React.createElement(Jspreadsheet, { options: options }), document.getElementById('spreadsheet'));
        break;

      default:
        console.log("Client reçoit un message inconnu", msgRecu.type);
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
        return par.sessionPath;
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
      //obj.hideColumn(11);
      //obj.hideColumn(12);
    };

    _this3.componentDidMount = function () {
      this.el = jspreadsheet(this.wrapper.current, this.options);
      this.hideSomeColumns(this.el);
    };

    _this3.addRow = function () {
      this.el.insertRow();
    };

    _this3.updateParameters = function () {
      var param = void 0;
      param = this.el.getData();
      console.log(param);

      par.groupesDesSons = param;

      var msg = {
        type: "updateParameters",
        parametersDir: par.sessionPath,
        data: par
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
          value: "Update parameters",
          onClick: function onClick() {
            return _this4.updateParameters();
          }
        })
      );
    }
  }]);

  return Jspreadsheet;
}(React.Component);

var domContainer = document.querySelector('#like_button_container');
ReactDOM.render(React.createElement(LikeButton, null), domContainer);
},{"../../serveur/ipConfig.json":2}],2:[function(require,module,exports){
module.exports={
  "remoteIPAddressImage": "localhost",
  "remoteIPAddressSound": "localhost",
  "remoteIPAddressLumiere": "localhost",
  "remoteIPAddressGame": "localhost",
  "serverIPAddress": "localhost",
  "webserveurPort": 8080,
  "websocketServeurPort": 8383,
  "InPortOSCMIDIfromDAW": 13000,
  "OutPortOSCMIDItoDAW": 12000,
  "portOSCToGame": 1000,
  "portOSCFromGame": 3005,
  "distribSequencerPort": 8888,
  "outportProcessing": 10000,
  "outportLumiere": 7700,
  "inportLumiere": 9000
}
},{}]},{},[1]);
