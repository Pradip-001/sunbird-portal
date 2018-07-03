// Renderer plugin can't be tested as of now
// Please move the logic to other classes and test them independently
// Let the plugin class delegate functionality to these classes

var WordWormPlugin = WordWormPlugin || {};

WordWormPlugin.Direction = Class.extend({
    init: function(offsetX, offsetY) {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    },

    applyOffset: function(position) {
        var x = position.x + this.offsetX;
        var y = position.y + this.offsetY;
        return new WordWormPlugin.Position(x, y);
    },

    isOppositeOf: function(otherDirection) {
        return (this.offsetX && this.offsetX === (otherDirection.offsetX * -1)) || (this.offsetY && this.offsetY === (otherDirection.offsetY * -1));
    },

    getOppositeDirection: function() {
        var self = this;
        var allDirections = Object.values(WordWormPlugin.Direction)
        var oppositeDirection = _.find(allDirections, function(direction) {
            return self.isOppositeOf(direction);
        });
        return oppositeDirection || WordWormPlugin.Direction.NONE;
    }
});
Object.defineProperties(WordWormPlugin.Direction, {
    "NONE": { value: new WordWormPlugin.Direction(0, 0), writable: false, enumerable: true, configurable: false },
    "UP": { value: new WordWormPlugin.Direction(0, -1), writable: false, enumerable: true, configurable: false },
    "RIGHT": { value: new WordWormPlugin.Direction(1, 0), writable: false, enumerable: true, configurable: false },
    "DOWN": { value: new WordWormPlugin.Direction(0, 1), writable: false, enumerable: true, configurable: false },
    "LEFT": { value: new WordWormPlugin.Direction(-1, 0), writable: false, enumerable: true, configurable: false }
});


WordWormPlugin.Position = Class.extend({
    init: function(x, y) {
        this.x = x;
        this.y = y;
    },

    equals: function(otherPosition) {
        return this.x === otherPosition.x && this.y === otherPosition.y;
    }
});

WordWormPlugin.Game = function(word) {
    var self = this;
    createjs.EventDispatcher.initialize(self);
    self.word = (word || "").toUpperCase();
    self.grid = new WordWormPlugin.Grid(18, 26); // Ratio 9:13
    self.worm = new WordWormPlugin.Worm(new WordWormPlugin.Position(0, 0), WordWormPlugin.Direction.RIGHT);
    self.isWon = false;
    self.stopReason = "";

    self.start = function() {
        console.log("Starting the WordWorm game for word :", self.word);
        document.addEventListener('keydown', self._onKeyDownHandler, false);
        self.grid.placeFoodItemsForAplhabets(this.word.split(""));
        return self;
    };

    self.stop = function(isWon, reason) {
        self.isWon = isWon;
        self.stopReason = reason;
        console.log("Stopping the WordWorm game for word :", self.word, ", Reason :", reason);
        document.removeEventListener('keydown', self._onKeyDownHandler, false);
        self.dispatchEvent("game:stopped");
        return self;
    };

    self._onKeyDownHandler = function(e) {
        var keyCode = e.keyCode ? e.keyCode : e.which;
        var keyCodeToDirection = {
            37: WordWormPlugin.Direction.LEFT,
            38: WordWormPlugin.Direction.UP,
            39: WordWormPlugin.Direction.RIGHT,
            40: WordWormPlugin.Direction.DOWN
        };
        var direction = keyCodeToDirection[keyCode] || WordWormPlugin.Direction.NONE;
        self.worm.changeDirection(direction);
    };

    self.onEachTick = function() {
        var foodItemAtWormPosition = self.grid.getFooodItemAtPosoition(self.worm.getCurrentPosition());
        if (foodItemAtWormPosition) {
            self.worm.feedFoodItem(foodItemAtWormPosition);
            self.grid.removeFoodItem(foodItemAtWormPosition);
        }

        var wordForemedByWorm = self.worm.getWord();
        var nextPositionOfWorm = self.worm.getNextPosition();

        if (wordForemedByWorm === self.word) {
            self.stop(true, "Worm has formed the word successfully");
        } else if (wordForemedByWorm && self.word.indexOf(wordForemedByWorm) !== 0) {
            self.stop(false, "Worm has alphabet is wrong order");
        } else if (self.grid.isOutside(nextPositionOfWorm)) {
            self.stop(false, "Worm is going outside the grid");
        } else if (self.worm.hasNodeAtPosition(nextPositionOfWorm)) {
            self.stop(false, "Worm is collides with the body");
        } else {
            self.worm.move();
        }
    }
};


WordWormPlugin.Grid = Class.extend({
    init: function(numberOfRows, numberOfCulumns) {
        this.numberOfRows = numberOfRows;
        this.numberOfCulumns = numberOfCulumns;
        this.foodItems = [];
    },

    placeFoodItemsForAplhabets: function(alphabets) {
        var self = this;
        self.foodItems = [];
        _.each(alphabets, function(alphabet) {
            self.foodItems.push(new WordWormPlugin.FoodItem(alphabet, self._randomPositionForFoodItem()));
        });
    },

    isOutside: function(position) {
        return position.x < 0 || position.y < 0 || position.x > this.numberOfCulumns - 1 || position.y > this.numberOfRows - 1;
    },

    getFooodItemAtPosoition: function(position) {
        return _.find(this.foodItems, function(foodItem) {
            return foodItem.position.equals(position);
        });
    },

    removeFoodItem: function(foodItem) {
        var index = this.foodItems.indexOf(foodItem);
        if (index > -1) {
            this.foodItems.splice(index, 1);
        }
    },

    _randomPositionForFoodItem: function() {
        var minX = 2; // Avoids worm eating foodItem at beginning
        var minY = 2; // Avoids worm eating foodItem at beginning
        var randomX = _.random(minX, this.numberOfCulumns - 1);
        var randomY = _.random(minY, this.numberOfRows - 1);
        var randomPosition = new WordWormPlugin.Position(randomX, randomY);
        var randomPositionIsOccupied = _.any(this.foodItems, function(foodItem) {
            return foodItem.position.equals(randomPosition);
        })
        if (!randomPositionIsOccupied) {
            return randomPosition;
        } else {
            return this._randomPositionForFoodItem();
        }
    }
});


WordWormPlugin.FoodItem = Class.extend({
    init: function(alphabet, position) {
        this.id = _.uniqueId('WordWormPlugin.FoodItem-');
        this.alphabet = alphabet;
        this.position = position;
    }
});

WordWormPlugin.WormNode = Class.extend({
    init: function(isHead, direction, position, data) {
        this.id = _.uniqueId('WordWormPlugin.WormNode-');
        this.isHead = isHead;
        this.direction = direction;
        this.position = position;
        this.data = data;
    },

    changeDirection: function(direction) {
        this.direction = direction;
    },

    move: function() {
        this.position = this.direction.applyOffset(this.position);
    }
});


WordWormPlugin.Worm = Class.extend({
    init: function(position, direction) {
        this.direction = direction || WordWormPlugin.Direction.NONE;
        this.nodes = this._defaultNodes(position);
    },

    getHeadNode: function() {
        return this.nodes[0];
    },

    getDataNodes: function() {
        return this.nodes.slice(1);
    },

    getWord: function() {
        var alphabets = _.map(this.getDataNodes(), function(node) {
            return node.data;
        });
        var word = alphabets.join('');
        return word;
    },

    getNextPosition: function() {
        var currentPosition = this.getCurrentPosition()
        return this.direction.applyOffset(currentPosition);
    },

    getCurrentPosition: function() {
        return this.getHeadNode().position;
    },

    canChangeToDirection: function(newDirection) {
        return newDirection !== this.direction && !newDirection.isOppositeOf(this.direction);
    },

    changeDirection: function(direction) {
        if (!this.canChangeToDirection(direction)) {
            return;
        }
        this.direction = direction;
    },

    hasNodeAtPosition: function(position) {
        return _.any(this.nodes, function(node) {
            return node.position.equals(position);
        });
    },

    feedFoodItem: function(foodItem) {
        var lastNode = _.last(this.nodes);
        var positionOfNewNode = lastNode.direction.getOppositeDirection().applyOffset(lastNode.position);
        var newNode = new WordWormPlugin.WormNode(false, lastNode.direction, positionOfNewNode, foodItem.alphabet);
        this.nodes.push(newNode);
    },

    move: function() {
        var directionForNextNode = this.direction;
        _.each(this.nodes, function(node) {
            var currentNodePrviousDirection = node.direction;
            node.changeDirection(directionForNextNode);
            directionForNextNode = currentNodePrviousDirection;
            node.move();
        });
    },

    _defaultNodes: function(position, direction) {
        var headNode = new WordWormPlugin.WormNode(true, this.direction, position || new WordWormPlugin.Position(0, 0));
        return [headNode];
    }
});

WordWormPlugin.WormRenderer = Class.extend({
    init: function(parentContainer) {
        this.parentContainer = parentContainer;
        this.nodeToRenderedObjectMap = {};
    },

    render: function(worm, cellDims) {
        var self = this;
        _.each(worm.nodes, function(node) {
            self.nodeToRenderedObjectMap[node.id] = self.nodeToRenderedObjectMap[node.id] || self._createRenderingObjectForNode(node, cellDims);
            var renderedObject = self.nodeToRenderedObjectMap[node.id];
            renderedObject.x = node.position.x * cellDims.w;
            renderedObject.y = node.position.y * cellDims.h;
        });
    },

    _createRenderingObjectForNode: function(node, cellDims) {
        var text = new createjs.Text();
        text.set({
            text: node.data,
            textAlign: "center",
            textBaseline: "middle",
            x: cellDims.w / 2,
            y: cellDims.h / 2
        });

        var circleRadius = Math.min(cellDims.w, cellDims.h) / 2;
        var circle = new createjs.Shape();
        circle.graphics.beginFill("DeepSkyBlue").drawCircle(circleRadius, circleRadius, circleRadius);

        var wormNodeContainer = new createjs.Container();
        wormNodeContainer.addChild(circle, text);

        this.parentContainer.addChild(wormNodeContainer);

        return wormNodeContainer;
    }
});

WordWormPlugin.GridRenderer = Class.extend({
    init: function(parentContainer) {
        this.parentContainer = parentContainer;
        this.foodItemToRenderedObjectMap = {};
    },

    render: function(grid, cellDims) {
        var self = this;
        _.each(grid.foodItems, function(foodItem) {
            self.foodItemToRenderedObjectMap[foodItem.id] = self.foodItemToRenderedObjectMap[foodItem.id] || self._createRenderingObjectForFoodItem(foodItem, cellDims);
        });

        _.each(Object.entries(self.foodItemToRenderedObjectMap), function(entry) {
            var foodItemId = entry[0];
            var foodItemRenderedObject = entry[1];
            var foodItemIsDeleted = !_.any(grid.foodItems, function(foodItem) {
                return foodItem.id === foodItemId;
            });
            if (foodItemIsDeleted) {
                self.parentContainer.removeChild(foodItemRenderedObject);
            }
        });
    },

    _createRenderingObjectForFoodItem: function(foodItem, cellDims) {
        var text = new createjs.Text();
        text.set({
            text: foodItem.alphabet,
            textAlign: "center",
            textBaseline: "middle",
            x: cellDims.w / 2,
            y: cellDims.h / 2
        });

        var reactangle = new createjs.Shape();
        reactangle.graphics.beginStroke("green").drawRect(0, 0, cellDims.w, cellDims.h);

        var foodItemContainer = new createjs.Container();
        foodItemContainer.addChild(reactangle, text);
        foodItemContainer.x = foodItem.position.x * cellDims.w;
        foodItemContainer.y = foodItem.position.y * cellDims.h;

        this.parentContainer.addChild(foodItemContainer);

        return foodItemContainer;
    }
});

WordWormPlugin.GameRenderer = Class.extend({
    init: function(dims) {
        this.dims = dims;
        this.container = this._createContainer(dims);
        this.gridRenderer = new WordWormPlugin.GridRenderer(this.container);
        this.wormRenderer = new WordWormPlugin.WormRenderer(this.container);
    },

    render: function(game) {
        var pixelsOccupiedByBorder = 2;
        var cellDims = { w: (this.dims.w - pixelsOccupiedByBorder) / game.grid.numberOfCulumns, h: (this.dims.h - pixelsOccupiedByBorder) / game.grid.numberOfRows };
        this.gridRenderer.render(game.grid, cellDims);
        this.wormRenderer.render(game.worm, cellDims);
        Renderer.update = true;
    },

    getMainRenderingObject: function() {
        return this.container;
    },

    _createContainer: function(dims) {
        var border = new createjs.Shape();
        border.graphics.beginStroke("#000");
        border.graphics.setStrokeStyle(1);
        border.snapToPixel = true;
        border.graphics.drawRect(1, 1, dims.w - 2, dims.h - 2);

        var container = new createjs.Container();
        container.addChild(border);
        container.x = dims.x;
        container.y = dims.y;
        return container;
    }
});



Plugin.demo = {};

Plugin.demo.RendererPlugin = Plugin.extend({
    _type: 'org.ekstep.demo',
    _isContainer: false,
    _render: true,
    initPlugin: function(data) {
        var self = this;
        var dims = this.relativeDims();
	console.log("printing data"+data.wordText);

        self.game = new WordWormPlugin.Game(data.wordText).start();
        self.gameRenderer = new WordWormPlugin.GameRenderer(dims);

        var tickEventListener = function() {
            self.game.onEachTick();
            self.gameRenderer.render(self.game);
        }

        createjs.Ticker.setInterval(10);
        createjs.Ticker.setFPS(10);
        createjs.Ticker.addEventListener("tick", tickEventListener);

        self.game.addEventListener("game:stopped", function() {
            console.log("Removing tickEventListener");
            createjs.Ticker.removeEventListener("tick", tickEventListener);
        });

        this._self = this.gameRenderer.getMainRenderingObject();
    }
});
