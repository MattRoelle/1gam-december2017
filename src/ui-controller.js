class UIController {
	constructor() {
		this.bgSprite = game.phaser.add.sprite(0, 0, "ui-bg");
		this.bgSprite.fixedToCamera = true;

		this.timeText = game.phaser.add.text(10, 4, "", {
			font: "18px slkscr",
			fill: "#ffffff",
			align: "left",
		});
		this.timeText.fixedToCamera = true;

		this.deadGrape = game.phaser.add.sprite(90, 4, "dead-grape");
		this.deadGrape.fixedToCamera = true;

		this.deathText = game.phaser.add.text(120, 4, "", {
			font: "18px slkscr",
			fill: "#ffffff",
			align: "left",
		});
		this.deathText.fixedToCamera = true;

		this.mute = game.phaser.add.sprite(770, 6, "unmute");
		this.mute.fixedToCamera = true;
		this.mute.inputEnabled = true;

		this.mute.events.onInputDown.add(() => {
			const m = game.audio.toggleMute();
			this.mute.alpha = m ? 0.25 : 1;
		}, this);

		this.fullscreenText = game.phaser.add.text(600, 4, "FULLSCREEN", {
			font: "18px slkscr",
			fill: "#ffffff",
			align: "left",
		});
		this.fullscreenText.fixedToCamera = true;
		this.fullscreenText.inputEnabled = true;

		this.fullscreenText.events.onInputDown.add(() => {
			game.fullscreen();
		}, this);

		this.twitterText = game.phaser.add.text(300, 4, "@mattyk1ns", {
			font: "18px slkscr",
			fill: "#1da1f2",
			align: "left",
		});
		this.twitterText.fixedToCamera = true;
		this.twitterText.inputEnabled = true;

		this.twitterText.events.onInputDown.add(() => {
			window.open("https://twitter.com/mattyk1ns");
		}, this);
	}

	update() {
		this.bgSprite.bringToTop();
		this.timeText.bringToTop();
		this.deadGrape.bringToTop();
		this.deathText.bringToTop();
		this.mute.bringToTop();
		this.fullscreenText.bringToTop();
		this.twitterText.bringToTop();
	}

	render() {

	}

	destroy() {
		this.bgSprite.destroy();
		this.timeText.destroy();
		this.deadGrape.destroy();
		this.deathText.destroy();
		this.mute.destroy();
		this.fullscreenText.destroy();
		this.twitterText.destroy();
	}

	setTime(t) {
		const at = t/1000;
		const minutes = Math.floor(at/60);
		const seconds = Math.floor(at - (minutes*60));
		this.timeText.text = game.utils.padZero(minutes) + ":" + game.utils.padZero(seconds);
	}

	setDeaths(n) {
		this.deathText.text = "x " + n;
	}
}
