/* eslint no-unused-vars: "off" */

var ConfigurableInterface = require('./interfaces/configurable.js');
var BaseRule = require('./rules/base.js');

/**
 * Converts the model into a 2D SoftwareCity consisting of SpatialNodes.
 *
 * @implements Configurable
 */
class BaseIllustrator {
    /**
     * @param  {BaseSoftwareModel} model
     * @param  {Object}            options
     * @return {BaseIllustrator}
     */
    constructor(model, options) {
        this._illustratorRules = [];
    }

    /**
     * Create the 2D spatial model, using the available information
     * for the chosen version.
     * Returns a list of SpatialNodes, which can be rendered in
     * combination with the model.
     * @abstract
     * @param  {Version} version
     * @return {Illustration}
     */
    draw(version) {}

    /**
     * Add a Metric-Rule, which will create or alter the attributes
     * of the Shapes and respectively the SpatialNodes.
     * @param {function} rule
     */
    addRule(rule) {
        this._illustratorRules.push(rule);
    }

    /**
     * Applies all available rules against a single node and returns an Object
     * covering the changes and additions to the node's attributes
     * @param {TreeNode}           node
     * @param {BaseSoftwareModel}  model
     * @param {Version}            version
     * @return {Object}
     * @protected
     */
    applyRules(node, model, version) {
        var attributes = {};
        for (const rule of this._illustratorRules) {
            if (rule instanceof BaseRule && rule.condition(model, node, version)) {
                Object.assign(attributes, rule.execute(model, node, version));
            }
        }

        return attributes;
    }
}

module.exports = ConfigurableInterface(BaseIllustrator);
