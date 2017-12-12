;(function() {
	window._1gam.game = window._1gam.game || {};
	window._1gam.level = {};

	const level = window._1gam.level;

	const entityCtorLookup = {
		"sawblade": _1gam.entities.Sawblade,
		"crusher": _1gam.entities.Crusher,
		"warp": _1gam.entities.Warp,
		"sign": _1gam.entities.Sign,
	};

	level.Level = class Level {
		constructor(tmx) {
			this.id = tmx;
			this.loadMap(tmx);
			this.loadEntities();
		}

		loadMap(tmx) {
			this.map = _1gam.p.add.tilemap(tmx);
			this.map.addTilesetImage("tilemap", "tilemap");
			this.tileLayer = this.map.createLayer(0);
			this.tileLayer2 = this.map.createLayer(1);
			this.tileLayer.resizeWorld();
			this.map.setCollisionByExclusion([1]);
		}

		loadEntities() {
			this.entities = [];

			for(let e of this.map.objects.entities) {
				if (e.type == "playerSpawn") {
					_1gam.game.player.sprite.x = e.x;
					_1gam.game.player.sprite.y = e.y;
				} else {
					this.createEntity(e);
				}

			}
		}

		createEntity(definition) {
			this.entities.push(new (entityCtorLookup[definition.type])(definition));
		}

		update () {
			if (_1gam.game.player.dead) {
				_1gam.p.physics.arcade.collide(_1gam.game.player.deathEmitter, this.tileLayer);
			} else {
				_1gam.p.physics.arcade.collide(_1gam.game.player.sprite, this.tileLayer);
			}
			for(let e of this.entities) {
				e.update();
			}
		};

		render() {
			for(let e of this.entities) {
				e.render();
			}
		};

		destroy() {
			this.map.destroy();
			this.tileLayer.destroy();
			for(let e of this.entities) {
				e.destroy();
			}
		};
	}
})();
