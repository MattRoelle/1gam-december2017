class Input {
	constructor() {
	}

	init() {
		this.movement = game.phaser.input.keyboard.createCursorKeys();
		this.jump = game.phaser.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.interact = game.phaser.input.keyboard.addKey(Phaser.Keyboard.Z);
	}
}
