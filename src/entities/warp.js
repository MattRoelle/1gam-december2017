;(function() {
	window._1gam.entities = window._1gam.entities || {};

	const C = window._1gam.constants;

	window._1gam.entities.Warp = class Warp {
		constructor(definition) {
			this.def = definition;
			this.sprite = _1gam.p.add.sprite(definition.x, definition.y, "door");
			this.sprite.animations.add("closed", [0], 0, true);
			this.sprite.animations.add("open", [0, 1, 2, 3], 6, true);
			this.sprite.animations.getAnimation("open").loop = false;
			this.sprite.animations.play("closed");

			this.arrowSprite = _1gam.p.add.sprite(definition.x + 11, definition.y - 25, "arrow");
			this.ogArrowY = this.arrowSprite.y;
		}

		update() {
			if (_1gam.utils.dist(this.sprite.x + 16, this.sprite.y + 32, _1gam.game.player.sprite.x, _1gam.game.player.sprite.y) < C.DOOR_OPEN_DISTANCE) {
				if (_1gam.input.interact.isDown) {
					this.open();
				}
				this.arrowSprite.y = this.ogArrowY - Math.sin(_1gam.p.time.now/100)*10;
				this.arrowSprite.alpha = 1;
			} else {
				this.arrowSprite.alpha = 0;
			}
		}

		open() {
			this.sprite.animations.play("open");
			_1gam.game.player.exit(this.def.properties.targetLevel);
		}

		render() {
		}

		destroy() {
			this.arrowSprite.destroy();
			this.sprite.destroy();
		}
	}

})();
