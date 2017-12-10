;(function() {
	window._1gam.game = window._1gam.game || {};

	const game = window._1gam.game;
	const loader = window._1gam.loader;
	const player = window._1gam.player;
	const input = window._1gam.input;

	game.run = _run;

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
		console.log("_run");
		_1gam.p = new Phaser.Game(800, 600, Phaser.AUTO, "1gam", game.setup, false, false);
	}

	function _preload() {
		loader.load(_1gam.p);
	}

	function _create() {
		_1gam.p.physics.startSystem(Phaser.Physics.ARCADE);
		input.init();
		game.player = new player.Player();

		game.map = _1gam.p.add.tilemap("level1");
		game.map.addTilesetImage("tilemap", "tilemap");
		game.tileLayer = game.map.createLayer(0);
		game.tileLayer.resizeWorld();
		game.map.setCollisionByExclusion([]);
	}

	function _update() {
		_1gam.p.physics.arcade.collide(game.player.sprite, game.tileLayer);
		game.player.update();
	}

	function _render() {

	}
})();
