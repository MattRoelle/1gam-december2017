;(function() {
	window._1gam.entities = window._1gam.entities || {};

	const C = window._1gam.constants;

	window._1gam.entities.Kill = class {
		constructor(definition) {
			this.def = definition;
			this.trigger = _1gam.p.add.sprite(definition.x, definition.y, null);
			_1gam.p.physics.enable(this.trigger, Phaser.Physics.ARCADE);
			this.trigger.body.setSize(definition.width, definition.height);
		}

		update() {
			_1gam.p.physics.arcade.overlap(_1gam.game.player.sprite, this.trigger, this.onCollision, null, this);
		}

		onCollision(col) {
			if (col.key == C.PLAYER_SPRITE_KEY) {
				_1gam.game.die();
			}
		}

		render() {

		}

		destroy() {
			this.trigger.destroy();
		}
	}
})();
