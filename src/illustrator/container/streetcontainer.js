var BaseContainer = require("./base.js");
var RowContainer  = require("./row.js");
var ShapeHouse    = require("../shapes/house.js");
var ShapeStreet   = require("../shapes/street.js");
var Point         = require("../components/point.js");

/**
 * Create an evostreet city
 * 
 * @implements BaseContainer
 * @implements BaseShape
 */
class StreetContainer extends BaseContainer {
    constructor(key, options = {}) {
        super(key);
        this._options = {
            'spacer.initial': 30,
            'spacer.container': 30,
            'spacer.conclusive': 0,
            'house.container': RowContainer,
            'house.distribution': 'default',
            'branch.container': RowContainer,
            'branch.distribution': 'default'
        };

        for (var key in options) {
            this._options[key] = options[key];
        }

        this._shapes = {
            'road': null,
            'houses': [],
            'branches': []
        }

        this._container = {
            houses: {
                left:  new this._options['house.container'](key + '_hl', true),
                right: new this._options['house.container'](key + '_hr')
            },
            branches: {
                left:  new this._options['branch.container'](key + '_bl', true),
                right: new this._options['branch.container'](key + '_br')
            }
        };

        this._container.houses.left.rotate(90);
        this._container.houses.right.rotate(90);
        this._container.branches.left.rotate(90);
        this._container.branches.right.rotate(90);
    };

    _updateDimensions() {
        this.dimensions.length = this._getContainerLength();
        this.dimensions.width  = this._getContainerWidth() + this._options['spacer.conclusive'];
    };

    add(shape) {
        if (shape instanceof StreetContainer) {
            this._shapes.branches.push(shape);
        } else if (shape instanceof ShapeHouse) {
            this._shapes.houses.push(shape);
        } else if (shape instanceof ShapeStreet) {
            if (this._shapes.road !== null) {
                throw 'StreetContainer can only have one road.'
            }
            this._shapes.road = shape;
        } else {
            throw 'Unknown Shape';
        }
    };

    _finalize() {
        super._finalize();

        if (this._shapes.road === null) {
            throw 'StreetContainer requires a primary street'
        }
        var mainRoad = this._shapes.road;

        this._addHousesToStructure();
        this._addBranchesToStructure();
        this._updateDimensions();
        
        var containersTop = (this.dimensions.width / 2) - this._options['spacer.conclusive'];
        var halfTheRoadLength = (mainRoad.displayDimensions.length / 2);
        var middleOfTheRoad = (this.dimensions.length / 2) - this._getMaxContainerRightLength() - halfTheRoadLength;

        mainRoad.dimensions.width = this.dimensions.width;
        mainRoad.position.x = middleOfTheRoad;
        mainRoad.position.y = 0;

        if (this._shapes.houses.length) {
            if (this._container.houses.left.size) {
                this._container.houses.left.position.x = middleOfTheRoad - halfTheRoadLength - this._container.houses.left.centroid.x;
                this._container.houses.left.position.y = containersTop - this._container.houses.left.centroid.y;
            }

            if (this._container.houses.right.size) {
                this._container.houses.right.position.x = middleOfTheRoad + halfTheRoadLength + this._container.houses.right.centroid.x;
                this._container.houses.right.position.y = containersTop - this._container.houses.right.centroid.y;
            }

            containersTop -= this._getMaxHouseContainerWidth() + this._options['spacer.container'];
        }

        if (this._shapes.branches.length) {
            if (this._container.branches.left.size) {
                this._container.branches.left.position.x = middleOfTheRoad - halfTheRoadLength - this._container.branches.left.centroid.x;
                this._container.branches.left.position.y = containersTop - this._container.branches.left.centroid.y;
            }

            if (this._container.branches.right.size) {
                this._container.branches.right.position.x = middleOfTheRoad + halfTheRoadLength + this._container.branches.right.centroid.x;
                this._container.branches.right.position.y = containersTop - this._container.branches.right.centroid.y;
            }

        }

        super.add(this._shapes.road)
        super.add(this._container.houses.left)
        super.add(this._container.houses.right)
        super.add(this._container.branches.left)
        super.add(this._container.branches.right)
    };

    _addHousesToStructure() {
        if (typeof this._options['house.distribution'] === 'function') {
            this._distributeShapesEquallyByAttribute(
                this._shapes.houses,
                this._options['house.distribution'],
                this._container.houses.left,
                this._container.houses.right
            );
        } else {
            this._distributeShapesInOrder(
                this._shapes.houses,
                this._container.houses.left,
                this._container.houses.right
            );
        }
    };

    _addBranchesToStructure() {
        this._distributeShapesInOrder(this._shapes.branches, this._container.branches.left, this._container.branches.right);
    };

    _distributeShapesInOrder(shapes, left, right) {
        for (var key in shapes) {
            if(shapes.hasOwnProperty(key)) {
                var c = (key%2) ? left : right;
                c.add(shapes[key]);
            }
        }
    };

    _distributeShapesEquallyByAttribute(shapes, attr, left, right) {
        shapes.sort(function (a, b) { return attr(b) - attr(a); });
        var diff = 0;
        for (var s of shapes) {
            if(diff <= 0) {
                left.add(s);
                diff += attr(s);
            } else {
                right.add(s);
                diff -= attr(s);
            }
        }
    }

    _getContainerWidth() {
        var houseWidth = this._getMaxHouseContainerWidth();
        var branchWidth = this._getMaxBranchContainerWidth();
        var containerMargin = (branchWidth && houseWidth) ? this._options['spacer.container'] : 0;
        return houseWidth + branchWidth + this._options['spacer.initial'] + containerMargin;
    };

    _getMaxHouseContainerWidth(){
        return Math.max(
            this._container.houses.left.displayDimensions.width,
            this._container.houses.right.displayDimensions.width
        );
    }

    _getMaxBranchContainerWidth(){
        return Math.max(
            this._container.branches.left.displayDimensions.width,
            this._container.branches.right.displayDimensions.width
        );
    }

    _getContainerLength() {
        var leftLength  = this._getMaxContainerLeftLength();
        var rightLength = this._getMaxContainerRightLength();
        
        return leftLength + this._shapes.road.displayDimensions.length + rightLength;
    };

    _getMaxContainerLeftLength() {
        return Math.max(
            this._container.houses.left.displayDimensions.length,
            this._container.branches.left.displayDimensions.length
        );

    };

    _getMaxContainerRightLength() {
        return Math.max(
            this._container.houses.right.displayDimensions.length,
            this._container.branches.right.displayDimensions.length
        );
    };
}

module.exports = StreetContainer;
