const GAME_STATES = {
	TITLE: 0,
	IN_GAME: 1,
	VICTORY: 2
};

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
		this.audio = new GameAudio();
		this.phaser = new Phaser.Game(800, 600, Phaser.AUTO, "game-host", this.setup, false, false);

		this.state = GAME_STATES.TITLE;

		const _this = this;
		document.getElementById("fullscreen").addEventListener("click", () => {
			_this.phaser.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
			_this.phaser.scale.startFullScreen(false);
		});
	}

	preload() {
		loader.load(this.phaser);
	}

	create() {
		this.phaser.physics.startSystem(Phaser.Physics.ARCADE);
		this.input.init();

		const _this = this;
		this.showTitle(() => {
			_this.startLevel("title");
		});

		this.audio.startMusic();
	}

	showTitle(cb) {
		const bg = this.phaser.add.graphics(0, 0);
		bg.beginFill(0xFFFFFF);
		bg.drawRect(0, 0, 800, 600); 

		const logoSpr = this.phaser.add.sprite(400, 300, "logo");
		logoSpr.anchor.set(0.5);

		const _this = this;

		let destroyed = false;
		let tween;

		const destroyCb = () => {
			if (destroyed) return;
			destroyed = true;

			if (!!tween) {
				tween.stop();
				_this.phaser.world.alpha = 1;
			}

			window.removeEventListener("keydown", destroyCb);

			logoSpr.destroy();
			bg.destroy();
			cb();
			_this.state = GAME_STATES.IN_GAME;
		};

		window.addEventListener("keydown", destroyCb);

		const fadeInCb = () => {
			if (destroyed) return;
			tween = _this.phaser.add.tween(_this.phaser.world).to({ alpha: 0 }, 0, Phaser.Easing.Linear.None, true, 400, 0);
			tween.onComplete.add(() => {
				setTimeout(() => {
					destroyCb();
				}, 250);
			});
		};
		const tout = setTimeout(fadeInCb, 1150);
	}

	update() {
		switch(this.state) {
			case GAME_STATES.TITLE:
				break;
			case GAME_STATES.IN_GAME:
				this.player.sprite.bringToTop();
				this.currentLevel.update();
				if (this.state == GAME_STATES.IN_GAME) {
					this.player.update();
				}
				break;
			case GAME_STATES.VICTORY:
				break;
		}

		this.input.update();
	}

	render() {

	}

	die() {
		if (this.player.dead) return;
		this.player.die();

		this.audio.pauseMusic();

		const _this =  this;
		this.audio.playSfx(SFX_TYPES.DEATH_EXPLOSION);
		setTimeout(() => {
			this.audio.playSfx(SFX_TYPES.DEATH);
		}, 400);

		const t = this.phaser.add.tween(this.phaser.world).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 1300, 0);

		t.onComplete.add(() => {
			this.audio.playMusic();
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

	win() {
		if (this.state == GAME_STATES.VICTORY) return;

		this.state = GAME_STATES.VICTORY;
		this.player.sprite.body.moves = false;

		const bg = this.phaser.add.graphics(0, 0);
		bg.beginFill(0xFFFFFF);
		bg.drawRect(0, 0, 800, 600); 
		bg.alpha = 0;

		const tween = this.phaser.add.tween(bg).to({ alpha: 1 }, 1500, Phaser.Easing.Linear.None, true, 300, 0);
		tween.onComplete.add(() => {
			const text = game.phaser.add.text(400, 300, "YOU'VE ESCAPED", {
				font: "64px slkscr",
				fill: "#000000",
				align: "center",
				wordWrap: false,
			});
			text.anchor.set(0.5);
			text.fixedToCamera = true;
			text.alpha = 0;

			const text2 = game.phaser.add.text(400, 450, "PRESS ANY KEY TO RETURN TO THE MENU", {
				font: "32px slkscr",
				fill: "#000000",
				align: "center",
				wordWrap: true,
				wordWrapWidth: 400
			});
			text2.anchor.set(0.5);
			text2.fixedToCamera = true;
			text2.alpha = 0;

			const tween2 = this.phaser.add.tween(text).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 500, 0);
			this.phaser.add.tween(text2).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 500, 0);
			
			tween2.onComplete.add(() => {
			});
		});
	}
}


