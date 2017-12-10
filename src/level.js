;(function() {
	window._1gam.game = window._1gam.game || {};
	window._1gam.level = {};

	const level = window._1gam.level;

	level.Level = Level;

	function Level(tmx) {
		this.loadMap(tmx);
		this.loadEntities();
	}

	Level.prototype.loadMap = function(tmx) {
		this.map = _1gam.p.add.tilemap(tmx);
		this.map.addTilesetImage("tilemap", "tilemap");
		this.tileLayer = this.map.createLayer(0);
		this.tileLayer.resizeWorld();
		this.map.setCollisionByExclusion([]);
	};

	Level.prototype.loadEntities = function() {
		this.entities = [];

		for(let e of this.map.objects.entities) {
			if (e.type == "playerSpawn") {
				_1gam.game.player.sprite.x = e.x;
				_1gam.game.player.sprite.y = e.y;
			} else {
				this.entities.push(this.createEntity(e));
			}
		}
	};

	Level.prototype.createEntity = function(definition) {
		return new (({
			"sawblade": _1gam.entities.sawblade
		})[definition.type])(definition);
	}

	Level.prototype.update = function() {
		if (_1gam.game.player.dead) {
			_1gam.p.physics.arcade.collide(_1gam.game.player.emitter, this.tileLayer);
		} else {
			_1gam.p.physics.arcade.collide(_1gam.game.player.sprite, this.tileLayer);
		}
		for(let e of this.entities) {
			e.update();
		}
	};

	Level.prototype.render = function() {
		for(let e of this.entities) {
			e.render();
		}
	};

	Level.prototype.destroy = function() {
		for(let e of this.entities) {
			e.sprite.destroy();
		}
	};
})();
