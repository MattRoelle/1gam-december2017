;(function() {
	window._1gam.entities = window._1gam.entities || {};

	const C = window._1gam.constants;

	window._1gam.entities.Sign = class Sign {
		constructor(definition) {
			this.def = definition;
			this.sprite = _1gam.p.add.sprite(definition.x, definition.y, "sign");
			this.sprite.z = 100;

			this.arrowSprite = _1gam.p.add.sprite(definition.x + 11, definition.y - 25, "arrow");
			this.ogArrowY = this.arrowSprite.y;
			_1gam.p.physics.enable([this.sprite], Phaser.Physics.ARCADE);

			this.open = false;
			this.timeOpened = 0;

			this.textGroup = _1gam.p.add.group();
			this.textGroup.fixedToCamera = true;

			this.textSprite = _1gam.p.add.sprite(100, 430, "text-bg");
			this.textSprite.fixedToCamera = true;
			this.textSprite.alpha = 0;
			this.text = _1gam.p.add.text(120, 440, "123", {
				font: "32px slkscr",
				fill: "#ffffff",
				align: "left",
				wordWrap: true,
				wordWrapWidth: 400
			});
			this.text.fixedToCamera = true;
			this.textSprite.alpha = 0;
		}

		update() {
			_1gam.p.physics.arcade.overlap(_1gam.game.player.sprite, this.sprite, this.onCollision, null, this);
			this.arrowSprite.y = this.ogArrowY - Math.sin(_1gam.p.time.now/100)*10;

			if (_1gam.utils.dist(this.sprite.x, this.sprite.y, _1gam.game.player.sprite.x, _1gam.game.player.sprite.y) < C.INTERACT_DISTANCE) {
				this.arrowSprite.alpha = 1;

				if (_1gam.input.interact.isDown && !this.open) {
					this.openText();
				}
			} else {
				this.open = false;
				this.arrowSprite.alpha = 0;
			}

			if (this.open) {
				const dt = _1gam.p.time.now - this.timeOpened;
				const charsVisible = Math.floor(dt/25);
				this.text.text = this.def.properties.text.substring(0, charsVisible);
				this.textSprite.alpha = 1;
				this.text.alpha = 1;
			}
			else {
				this.textSprite.alpha = 0;
				this.text.alpha = 0;
			}
		}

		openText() {
			this.open = true;
			this.timeOpened = _1gam.p.time.now;
		}

		render() {
		}

		destroy() {
			this.sprite.destroy();
		}
	}
})();
