class EndZone {
	constructor(definition) {
		this.def = definition;
		this.trigger = game.phaser.add.sprite(definition.x, definition.y, null);
		game.phaser.physics.enable(this.trigger, Phaser.Physics.ARCADE);
		this.trigger.body.setSize(definition.width, definition.height);
	}

	update() {
		game.phaser.physics.arcade.overlap(game.player.sprite, this.trigger, this.onCollision, null, this);

	}

	onCollision(col) {
		if (col.key == C.PLAYER_SPRITE_KEY) {
			game.win();
		}
	}

	render() {

	}

	destroy() {
		this.trigger.destroy();
	}
}

