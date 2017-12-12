
;(function() {
	window._1gam.entities = window._1gam.entities || {};

	const C = window._1gam.constants;

	window._1gam.entities.Sawblade = class {
		constructor(definition) {
			this.def = definition;

			this.sprite = _1gam.p.add.sprite(definition.x + 16, definition.y, "sawblade");
			this.sprite.anchor.set(0.5);

			this.baseSprite = _1gam.p.add.sprite(definition.x + 16, definition.y + 16, "sawblade-base");
			this.baseSprite.anchor.set(0.5);

			_1gam.p.physics.enable([this.sprite, this.baseSprite], Phaser.Physics.ARCADE);
			this.sprite.body.setSize(32, 32, 16, 16);
			this.sprite.body.immovable = true;
			this.baseSprite.body.setSize(96, 32, 0, 0);
			this.baseSprite.body.immovable = true;
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
