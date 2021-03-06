import {applyMixins, Configurable, ConfigurableInterface} from "./components/Mixins";
import {Rule} from "./rules/Rule";

/**
 * Converts the model into a 2D SoftwareCity consisting of SpatialNodes.
 * @implements Configurable
 */
abstract class Illustrator implements ConfigurableInterface {

    // Satisfy Configurable-Interface
    public setDefaults: (defaults: AttributeContainer) => void;
    public setOptions: (options: AttributeContainer) => void;
    public setOption: (key: string, value: any) => void;
    public getOption: (key: string) => any;
    public getOptions: () => AttributeContainer;
    public requireOption: (key: string) => void;

    private _illustratorRules: Rule[];

    constructor() {
        this._illustratorRules = [];
    }

    /**
     * Create the 2D spatial model, using the available information
     * for the chosen version.
     * Returns a list of SpatialNodes, which can be rendered in
     */
    public abstract draw(version: VersionInterface): any;

    /**
     * Add a Metric-Rule, which will create or alter the attributes
     * of the Shapes and respectively the SpatialNodes.
     * @param {function} rule
     */
    public addRule(rule: Rule): void {
        this._illustratorRules.push(rule);
    }

    /**
     * Applies all available rules against a single node and returns an Object
     * covering the changes and additions to the node"s attributes
     */
    protected applyRules(model: SoftwareModel, node: TreeNodeInterface, version: VersionInterface): AttributeContainer {
        let attributes = {};
        for (const rule of this._illustratorRules) {
            if (rule instanceof Rule && rule.condition(model, node, version)) {
                Object.assign(attributes, rule.execute(model, node, version));
            }
        }

        return attributes;
    }
}

applyMixins(Illustrator, Configurable);

export {Illustrator};