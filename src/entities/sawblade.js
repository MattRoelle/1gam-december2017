
;(function() {
	window._1gam.entities = window._1gam.entities || {};

	const C = window._1gam.constants;

	window._1gam.entities.Sawblade = class {
		constructor(definition) {
			this.def = definition;
			this.def.properties = this.def.properties || {};

			this.orientation = this.def.properties.orientation || "up";

			this.sprite = _1gam.p.add.sprite(definition.x + 16, definition.y, "sawblade");
			this.baseSprite = _1gam.p.add.sprite(definition.x + 16, definition.y + 16, "sawblade-base");
			_1gam.p.physics.enable([this.sprite, this.baseSprite], Phaser.Physics.ARCADE);
			this.sprite.body.immovable = true;
			this.baseSprite.body.setSize(96, 32, 0, 0);
			this.baseSprite.body.immovable = true;

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
		}
		update() {
			_1gam.p.physics.arcade.overlap(_1gam.game.player.sprite, this.sprite, this.onCollision, null, this);
			_1gam.p.physics.arcade.collide(_1gam.game.player.sprite, this.sprite);
			_1gam.p.physics.arcade.collide(_1gam.game.player.sprite, this.baseSprite);
			this.sprite.angle += 6.5;
		};
		render() {

		};
		onCollision(col) {
			if (col.key == C.PLAYER_SPRITE_KEY) {
				_1gam.game.die();
			}
		};
		destroy () {
			this.sprite.destroy();
		};
	}
})();
