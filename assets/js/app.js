// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html";
import socket from "./socket";

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

// import socket from "./socket"

import run_game from "./game";

function form_init() {
  $('#game-input').keypress((e) => {
    if (e.keyCode==13) $('#game-button').click();
  });

  $('#game-button').click(() => {
    console.log("game button clicked");
    let gameName = $('#game-input').val();
    window.location.href="/game/"+gameName;
  });
}

// value: string, complete: boolean, onClick: function

function init() {
  let root = document.getElementById('root');
  if (root) {
    let gameName = window.location.href.substr(this.location.href.lastIndexOf('/')+1);
    let channel = socket.channel("games:"+gameName, {});

    run_game(root, channel);
  }

  if (document.getElementById('index-page')) {
    form_init();
  }
}


// Use jQuery to delay until page loaded.
$(init);
