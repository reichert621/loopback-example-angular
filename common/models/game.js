const _ = require('lodash');

module.exports = function(Game) {

  // Built-in methods
  Game.fetchGameTypes = function(cb) {
    fetchGameTypes()
      .then(games => cb(null, games))
      .catch(err => cb(err));
  };

  Game.remoteMethod('fetchGameTypes', {
    accepts: [],
    returns: { arg: 'games', type: 'array' }
  });

  Game.fetchPlayers = function(cb) {
    fetchPlayers()
      .then(players => cb(null, players))
      .catch(err => cb(err));
  };

  Game.remoteMethod('fetchPlayers', {
    accepts: [],
    returns: { arg: 'players', type: 'array' }
  });



  // TODO: implement this for the test
  Game.fetchStats = function(game, cb) {
    Promise.all([
        fetchPlayers(),
        fetchGames(game)
      ])
      .then(([players, games]) => {
        const stats = formatStats(players, games);

        return cb(null, stats);
      })
      .catch(err => cb(err));
  };

  Game.remoteMethod('fetchStats', {
    accepts: [
      { arg: 'game', type: 'string', required: true }
    ],
    returns: { arg: 'stats', type: 'array' }
  });



  // TODO: helper functions for the test
  function generateStats(players, games) {
    const playerMap = mapPlayerIdsToNames(players);

    return games.reduce((stats, game) => {
      const { type, winnerId, loserId } = game;
      const winner = playerMap[winnerId];
      const loser = playerMap[loserId];

      stats[winner].wins++;
      stats[loser].losses++;

      return stats;
    }, defaultStats(players));
  }

  function formatStats(players, games) {
    const stats = generateStats(players, games);

    return formatPlayers(stats);
  }

  function formatPlayers(playerMap) {
    return Object.keys(playerMap)
      .map(name => {
        const { wins, losses } = playerMap[name];
        const _ratio = (wins === 0 && losses === 0) ? -Infinity : (wins / losses);

        return Object.assign(playerMap[name], {
          ratio: _ratio + (wins * 0.02) - (losses * 0.01)
        });
      })
      .sort((x, y) => {
        return y.ratio - x.ratio;
      })
      .map((player, index) => {
        return Object.assign(player, {
          rank: (index + 1)
        })
      });
  }

  function defaultStats(players) {
    return players.reduce((map, player) => {
      return Object.assign(map, {
        [player.name]: {
          playerId: player.id,
          name: player.name,
          wins: 0,
          losses: 0
        }
      });
    }, {});
  }

  function mapPlayerIdsToNames(players) {
    return players.reduce((map, player) => {
      return Object.assign(map, {
        [player.id]: player.name
      });
    }, {});
  }



  // Constants
  const PING_PONG = 'PING_PONG';
  const CHESS = 'CHESS';
  const GO_KART_RACING = 'GO_KART_RACING';



  // Built-in helper functions
  function fetchGames(game) {
    return new Promise(resolve => {
      setTimeout(() => {
        if (isValidGame(game)) {
          resolve(_games()
            .filter(g => g.type === game));
        } else {
          resolve(_games());
        }
      }, 300);
    });
  }

  function fetchGameTypes() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(_gameTypes())
      }, 300);
    });
  }

  function fetchPlayers() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(_players())
      }, 300);
    });
  }

  function isValidGame(game) {
    const _games = _gameTypes().map(gt => gt.code);

    return _.includes(_games, game);
  }


  // Mock data
  function _players() {
    return [
      { id: 1, name: 'Alex' },
      { id: 2, name: 'Ben' },
      { id: 3, name: 'Boris' },
      { id: 4, name: 'Brian' }
    ];
  }

  function _gameTypes() {
    return [
      { name: 'Ping-Pong', code: PING_PONG },
      { name: 'Chess', code: CHESS },
      { name: 'Go-Kart Racing', code: GO_KART_RACING }
    ];
  }

  function _games() {
    return [
      {
        type: PING_PONG,
        loserId: 4,
        winnerId: 3
      },
      {
        type: CHESS,
        loserId: 3,
        winnerId: 2
      },
      {
        type: PING_PONG,
        loserId: 1,
        winnerId: 3
      },
      {
        type: GO_KART_RACING,
        loserId: 2,
        winnerId: 4
      },
      {
        type: PING_PONG,
        loserId: 2,
        winnerId: 1
      },
      {
        type: GO_KART_RACING,
        loserId: 3,
        winnerId: 4
      },
      {
        type: PING_PONG,
        loserId: 3,
        winnerId: 1
      },
      {
        type: CHESS,
        loserId: 2,
        winnerId: 1
      },
      {
        type: PING_PONG,
        loserId: 1,
        winnerId: 3
      },
      {
        type: GO_KART_RACING,
        loserId: 3,
        winnerId: 2
      }
    ];
  }

};
