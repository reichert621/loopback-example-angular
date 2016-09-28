
angular
  .module('app')
  .controller('HomeController', HomeController);

function HomeController($log, Game) {
  var ctrl = this;

  ctrl.game = null;
  ctrl.players = [];

  function init() {
    fetchGameTypes()
      .then(function(gameTypes) {
        // sets game options
        ctrl.gameTypes = gameTypes;
        // sets default game type
        ctrl.game = gameTypes[0];

        // TODO: implement this for the test
        return fetchStats(ctrl.game);
      })
      .then(function(stats) {
        ctrl.players = stats;
      })
      .catch(function(err) {
        $log.error(err);
      });
  }

  // TODO: implement this for the test
  ctrl.updateGame = function(game) {
    fetchStats(game)
      .then(function(stats) {
        ctrl.players = stats;
      })
      .catch(function(err) {
        $log.error(err);
      });
  };



  // TODO: move functions below to a service

  function fetchStats(game) {
    var code = game && game.code;

    if (!code) return $log.error('Invalid game', game);

    return Game.fetchStats({ game: code }).$promise
      .then(function(res) {
        return res.stats;
      });
  }

  function fetchGameTypes() {
    return Game.fetchGameTypes().$promise
      .then(function(res) {
        return res.games;
      });
  }

  function formatGameCode(code) {
    return {
      PING_PONG: 'Ping-Pong',
      CHESS: 'Chess',
      GO_KART_RACING: 'Go-Kart Racing'
    }[code];
  }

  init();
}
