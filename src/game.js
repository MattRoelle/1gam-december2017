;(function() {
	window._1gam.game = window._1gam.game || {};

	const game = window._1gam.game;
	const loader = window._1gam.loader;
	const player = window._1gam.player;
	const input = window._1gam.input;
	const level = window._1gam.level;

	game.run = _run;
	game.die = _die;
	game.startLevel = _startLevel;
	game.warpToLevel = _warpToLevel;

	game.setup = {
		preload: _preload,
		create: _create,
		update: _update,
		render: _render
	};

	document.getElementById("fullscreen").addEventListener("click", () => {
		_1gam.p.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
		_1gam.p.scale.startFullScreen(false);
	});

	function _run() {
		_1gam.p = new Phaser.Game(800, 600, Phaser.AUTO, "game-host", game.setup, false, false);
	}

	function _preload() {
		loader.load(_1gam.p);
	}

	function _create() {
		_1gam.p.physics.startSystem(Phaser.Physics.ARCADE);
		input.init();
		_startLevel("level1");
	}

	function _update() {
		game.currentLevel.update();
		game.player.update();
	}

	function _render() {

	}

	function _die() {
		if (game.player.dead) return;
		game.player.die();

		const t = _1gam.p.add.tween(_1gam.p.world).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 1200, 0);
		t.onComplete.add(() => {
			_startLevel(game.currentLevel.id);
		});
	}

	function _startLevel(s) {
		if (!!game.player) game.player.destroy();
		if (!!game.currentLevel) game.currentLevel.destroy();
		game.player = new player.Player();
		console.log(s);
		game.currentLevel = new level.Level(s);
		_1gam.p.add.tween(_1gam.p.world).to({ alpha: 1 }, 400, Phaser.Easing.Linear.None, true, 300, 0);
	}

	function _warpToLevel(target) {
		_startLevel(target);
	}
})();
