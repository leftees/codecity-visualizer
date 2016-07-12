exports.models = {
    'base' : require('./model/Model').Model,
    'dummy' : require('./model/Model').DummyModel
};

exports.components = {
    'dependency': require('./components/Dependency').Dependency,
    'version':    require('./components/Version').Version,
    'node':       require('./components/TreeNode').TreeNode,
    'cuboid':     require('./components/Cuboid').Cuboid,
    'point':      require('./components/Point').Point
};

exports.illustrators = {
    'base':      require('./illustrator/base'),
    'evostreet': require('./illustrator/evostreet'),
    'district': require('./illustrator/district')
};

exports.containers = {
    'base':     require('./illustrator/container/base-universal'),
    'row':      require('./illustrator/container/universal/row'),
    'lightmap': require('./illustrator/container/universal/lightmap'),
    'grid':     require('./illustrator/container/universal/grid')
};

exports.shapes = {
    'base':     require('./illustrator/shapes/base'),
    'house':    require('./illustrator/shapes/house'),
    'street':   require('./illustrator/shapes/street'),
    'platform': require('./illustrator/shapes/platform')
};

exports.rules = {
    'base': require('./illustrator/rules/base'),
    'universal': require('./illustrator/rules/universal'),

    'math': {
        'linear': require('./illustrator/rules/math/linear'),
        'logarithmic': require('./illustrator/rules/math/logarithmic'),
        'exponential': require('./illustrator/rules/math/exponential')
    },
    'color': {
        'gradient': require('./illustrator/rules/color/gradient'),
        'assigned': require('./illustrator/rules/color/assigned')
    }
};

exports.helper = {
    'attributes': require('./model/helper/attributeExtractor')
};
