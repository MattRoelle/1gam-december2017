class Sawblade {
	constructor(definition) {
		this.def = definition;
		this.def.properties = this.def.properties || {};

		this.orientation = this.def.properties.orientation || "up";

		this.sprite = game.phaser.add.sprite(definition.x + 16, definition.y, "sawblade");
		this.baseSprite = game.phaser.add.sprite(definition.x + 16, definition.y + 16, "sawblade-base");
		game.phaser.physics.enable([this.sprite], Phaser.Physics.ARCADE);
		this.sprite.body.immovable = true;

		switch(this.orientation) {
			case "up":
				this.sprite.body.setSize(32, 32, 16, 16);
				break;
			case "left":
				this.sprite.body.setSize(32, 32, 0, 16);
				this.sprite.x = definition.x;
				this.sprite.y = definition.y + 16;
				this.baseSprite.angle = -90;
				break;
			case "right":
				this.sprite.body.setSize(32, 32, 32, 16);
				this.sprite.x = definition.x + 32;
				this.sprite.y = definition.y + 16;
				this.baseSprite.angle = 90;
				break;
		}

		this.sprite.anchor.set(0.5);
		this.baseSprite.anchor.set(0.5);

		if (this.def.properties.ignoreBase) {
			this.baseSprite.alpha = 0;
		}
	}
	update() {
		game.phaser.physics.arcade.overlap(game.player.sprite, this.sprite, this.onCollision, null, this);
		this.sprite.angle += 6.5;
	};
	render() {

	};
	onCollision(col) {
		if (col.key == C.PLAYER_SPRITE_KEY) {
			game.die();
		}
	};
	destroy () {
		this.sprite.destroy();
		this.baseSprite.destroy();
	};
}
