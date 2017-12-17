;(function() {
	window._1gam.entities = window._1gam.entities || {};

	const C = window._1gam.constants;

	window._1gam.entities.Conveyor = class {
		constructor(definition) {
			this.sprite = _1gam.p.add.tileSprite(definition.x, definition.y, definition.width, definition.height, "conveyor");
			this.sprite.animations.add("main", [0, 1, 2], 12, true);
			this.sprite.play("main");
			_1gam.p.physics.enable([this.sprite], Phaser.Physics.ARCADE);
			this.sprite.body.setSize(definition.width, definition.height);
			this.sprite.body.immovable = true;

			this.direction = definition.direction || "right";

			this.trigger = _1gam.p.add.sprite(definition.x, definition.y - 2, null);
			_1gam.p.physics.enable(this.trigger, Phaser.Physics.ARCADE);
			this.trigger.body.setSize(definition.width, definition.height + 2);
		}

		update() {
			_1gam.p.physics.arcade.collide(_1gam.game.player.sprite, this.sprite);
			_1gam.p.physics.arcade.overlap(_1gam.game.player.sprite, this.trigger, this.onCollision, null, this);
		}

		onCollision(col) {
			console.log("collision");
			if (col.key == C.PLAYER_SPRITE_KEY) {
				_1gam.game.player.sprite.body.velocity.x += 20;
			}
		}

		render() {

		}

		destroy() {
			this.sprite.destroy();
			this.trigger.destroy();
		}
	}
})();
