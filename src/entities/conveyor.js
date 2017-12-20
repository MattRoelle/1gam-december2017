class Conveyor {
	constructor(definition) {
		this.sprite = game.phaser.add.tileSprite(definition.x, definition.y, definition.width, definition.height, "conveyor");
		this.sprite.animations.add("main", [0, 1, 2], 12, true);
		this.sprite.play("main");
		game.phaser.physics.enable([this.sprite], Phaser.Physics.ARCADE);
		this.sprite.body.setSize(definition.width, definition.height);
		this.sprite.body.immovable = true;

		this.direction = definition.direction || "right";

		this.trigger = game.phaser.add.sprite(definition.x, definition.y - 2, null);
		game.phaser.physics.enable(this.trigger, Phaser.Physics.ARCADE);
		this.trigger.body.setSize(definition.width, definition.height + 2);
	}

	update() {
		game.phaser.physics.arcade.collide(game.player.sprite, this.sprite);
		game.phaser.physics.arcade.overlap(game.player.sprite, this.trigger, this.onCollision, null, this);
	}

	onCollision(col) {
		console.log("collision");
		if (col.key == C.PLAYER_SPRITE_KEY) {
			game.player.sprite.body.velocity.x += 20;
		}
	}

	render() {

	}

	destroy() {
		this.sprite.destroy();
		this.trigger.destroy();
	}
}
