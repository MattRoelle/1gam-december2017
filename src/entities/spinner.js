;(function() {

	window._1gam.entities = window._1gam.entities || {};

	const C = window._1gam.constants;

	window._1gam.entities.Spinner = class Spinner {
		constructor(definition) {
			this.def = definition;

			this.baseSprite = _1gam.p.add.sprite(definition.x + 16, definition.y + 16, "spinner-base");
			this.armSprite = _1gam.p.add.sprite(definition.x + 16, definition.y + 16, "spinner-arm");
			this.headSprite = _1gam.p.add.sprite(definition.x + 16, definition.y + 84, "spinner-head");

			this.baseSprite.anchor.set(0.5);
			this.armSprite.anchor.set(0.5, 0);
			this.headSprite.anchor.set(0.5);

			this.theta = 0;

			this.hasKilledPlayer = false;

			//this.sGroup.anchor.set(0.5, 0);
		}

		update() {
			this.theta += this.def.properties.speed;
			this.armSprite.angle = this.theta;
			this.headSprite.x = this.baseSprite.x + Math.cos((this.theta*Math.PI/180) + Math.PI/2)*80;
			this.headSprite.y = this.baseSprite.y + Math.sin((this.theta*Math.PI/180) + Math.PI/2)*80;
			this.headSprite.angle += 8;

			if (!this.hasKilledPlayer && _1gam.utils.dist(this.headSprite.x, this.headSprite.y, _1gam.game.player.sprite.x, _1gam.game.player.sprite.y) < 40) {
				this.hasKilledPlayer = true;
				_1gam.game.die();
			}
		}

		render() {

		}

		destroy() {
			this.baseSprite.destroy();
			this.armSprite.destroy();
			this.headSprite.destroy();
		}
	};
})();
