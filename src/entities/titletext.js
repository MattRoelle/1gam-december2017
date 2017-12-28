class TitleText {
	constructor(definition) {
		this.sprite = game.phaser.add.sprite(400, 200, "titletext");
		this.sprite.anchor.set(0.5);
	}

	update() {

	}

	render() {

	}

	destroy() {
		this.sprite.destroy();
	}
}
