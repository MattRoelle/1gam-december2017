class Warp {
	constructor(definition) {
		this.def = definition;
		this.sprite = game.phaser.add.sprite(definition.x, definition.y, "door");
		this.sprite.animations.add("closed", [0], 0, true);
		this.sprite.animations.add("open", [0, 1, 2, 3], 6, true);
		this.sprite.animations.getAnimation("open").loop = false;
		this.sprite.animations.play("closed");

		this.arrowSprite = game.phaser.add.sprite(definition.x + 11, definition.y - 25, "arrow");
		this.ogArrowY = this.arrowSprite.y;
	}

	update() {
		if (game.utils.dist(this.sprite.x + 16, this.sprite.y + 32, game.player.sprite.x, game.player.sprite.y) < C.DOOR_OPEN_DISTANCE) {
			if (game.input.interact.isDown || game.input.up()) {
				this.open();
			}
			this.arrowSprite.y = this.ogArrowY - Math.sin(game.phaser.time.now/100)*10;
			this.arrowSprite.alpha = 1;
		} else {
			this.arrowSprite.alpha = 0;
		}
	}

	open() {
		this.sprite.animations.play("open");
		game.player.exit(this.def.properties.targetLevel);
	}

	render() {
	}

	destroy() {
		this.arrowSprite.destroy();
		this.sprite.destroy();
	}
}
