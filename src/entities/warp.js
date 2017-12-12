;(function() {
	window._1gam.entities = window._1gam.entities || {};

	const C = window._1gam.constants;

	window._1gam.entities.Warp = class Warp {
		constructor(definition) {
			this.def = definition;
			this.sprite = _1gam.p.add.sprite(definition.x + 16, definition.y + 16, "warp");
			this.sprite.anchor.set(0.5);
			_1gam.p.physics.enable([this.sprite], Phaser.Physics.ARCADE);
		}

		update() {
			_1gam.p.physics.arcade.overlap(_1gam.game.player.sprite, this.sprite, this.onCollision, null, this);
			this.sprite.angle += 3;
		}

		render() {
		}

		destroy() {
			this.sprite.destroy();
		}

		onCollision(col) {
			console.log("WARP");
			if (col.key == C.PLAYER_SPRITE_KEY) {
				_1gam.game.warpToLevel(this.def.properties.targetLevel);
			}
		}
	}

})();
