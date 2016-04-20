/**
 * Converts the model into a 2D SoftwareCity consisting of shapes.
 * 
 * @interface
 */
class BaseIllustrator {
    constructor(model, options) {
        if (new.target === BaseIllustrator) {
            throw new TypeError("Cannot construct instances of this class directly");
        }
    }
}

module.exports = BaseIllustrator;