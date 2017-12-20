class Game {
	constructor() {
		this.setup = {
			preload: this.preload.bind(this),
			create: this.create.bind(this),
			update: this.update.bind(this),
			render: this.render.bind(this)
		};

		this.input = new Input();
		this.utils = new Utils();
		this.phaser = new Phaser.Game(800, 600, Phaser.AUTO, "game-host", this.setup, false, false);

		document.getElementById("fullscreen").addEventListener("click", () => {
			_1gam.p.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
			_1gam.p.scale.startFullScreen(false);
		});
	}

	preload() {
		loader.load(this.phaser);
	}

	create() {
		this.phaser.physics.startSystem(Phaser.Physics.ARCADE);
		this.input.init();
		console.log(this);
		this.startLevel("level1");
	}

	update() {
		this.currentLevel.update();
		this.player.update();
	}

	render() {

	}

	die() {
		if (this.player.dead) return;
		this.player.die();

		const t = this.phaser.add.tween(this.phaser.world).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 1200, 0);

		const _this = this;
		t.onComplete.add(() => {
			_this.startLevel(game.currentLevel.id);
		});
	}

	startLevel(s) {
		if (!!this.player) this.player.destroy();
		if (!!this.currentLevel) this.currentLevel.destroy();
		this.player = new Player();
		this.currentLevel = new Level(s);
		this.phaser.add.tween(this.phaser.world).to({ alpha: 1 }, 400, Phaser.Easing.Linear.None, true, 300, 0);
	}

	warpToLevel(target) {
		this.startLevel(target);
	}
}


