
;(function() {
	window._1gam.entities = window._1gam.entities || {};

	window._1gam.entities.sawblade = Sawblade;
	const C = window._1gam.constants;

	function Sawblade(definition) {
		this.def = definition;

		this.sprite = _1gam.p.add.sprite(definition.x + 16, definition.y + 16, "sawblade");
		this.sprite.anchor.set(0.5);

		_1gam.p.physics.enable([this.sprite], Phaser.Physics.ARCADE);
		this.sprite.body.setSize(32, 32, 16, 16);
		this.sprite.body.immovable = true;
	}
	Sawblade.prototype.update = function() {
		_1gam.p.physics.arcade.overlap(_1gam.game.player.sprite, this.sprite, this.onCollision, null, this);
		_1gam.p.physics.arcade.collide(_1gam.game.player.sprite, this.sprite);
		this.sprite.angle += 10;
	};
	Sawblade.prototype.render = function() {

	};
	Sawblade.prototype.onCollision = function(col) {
		if (col.key == C.PLAYER_SPRITE_KEY) {
			_1gam.game.die();
		}
	};
})();
