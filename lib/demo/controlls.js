'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Controlls = function () {
    function Controlls(target, versions, renderFunction) {
        _classCallCheck(this, Controlls);

        var div = document.createElement('div');
        div.style['float'] = 'left';
        div.style['clear'] = 'both';
        div.style['margin'] = '4px 2px';
        div.style['padding'] = '0 5px';
        div.style['border-width'] = '1px 1px 1px 0';
        div.style['border-style'] = 'dashed';
        div.style['border-color'] = '#888';

        this._controllDiv = div;

        this.appendLayout();
        this.appendRules();
        this.appendVersions(versions);
        this.appendDrawButton(renderFunction);

        target.appendChild(this._controllDiv);
    }

    _createClass(Controlls, [{
        key: 'appendLayout',
        value: function appendLayout() {
            var layouts = [{ key: 'grid', label: 'GRID' }, { key: 'linear', label: 'Linear' }, { key: 'light', label: 'Lightmap' }];

            var positions = [{ key: 'left', label: 'Left' }, { key: 'right', label: 'Right' }, { key: 'default', label: 'Alternating (Age)' }, { key: 'size', label: 'Alternating (Size)' }];

            var margins = [];
            for (var i = 0; i <= 10; i++) {
                margins.push({ label: i, key: i });
            }

            this.appendHeader('Layout');
            this.appendSelectBox('l_sort', 'House Position', positions, 'default');
            this.appendSelectBox('l_margin', 'House Margin', margins, 4);
            this.appendSelectBox('l_pack', 'House Packing: ', layouts);
        }
    }, {
        key: 'appendRules',
        value: function appendRules() {
            this.appendHeader('Rules');
            this.appendCheckbox('r_loc', 'LOC -> Height', 1);
            this.appendCheckbox('r_edit', 'Changes -> Width', 1);
            this.appendCheckbox('r_pack', 'Package -> Color', 1);
            this.appendCheckbox('r_opac', 'Existence -> Opacity', 1);
        }
    }, {
        key: 'appendVersions',
        value: function appendVersions(v) {
            this.appendHeader('Versions');
            this.appendSelectBox('version', '', v, v[v.length - 1]);
        }
    }, {
        key: 'appendDrawButton',
        value: function appendDrawButton(renderFunction) {
            var b = document.createElement('input');
            b.setAttribute('type', 'button');
            b.setAttribute('name', 'b_draw');
            b.setAttribute('id', 'draw');
            b.setAttribute('value', 'Draw City');
            b.style['padding'] = '6px 10px';
            b.style['margin'] = '5px 0 0 0';

            b.addEventListener('click', function () {
                var options = {
                    'house.length': 32,
                    'house.width': 32,
                    'house.height': 26,
                    'house.margin': 4,
                    'evostreet.options': {
                        'spacer.initial': 20,
                        'spacer.conclusive': 0,
                        'spacer.branches': 20
                    }
                };

                if (document.getElementById('l_margin')) options['house.margin'] = parseInt(document.getElementById('l_margin').value);

                if (document.getElementById('l_sort').value === 'size') options['evostreet.options']['house.distribution'] = function (s) {
                    return s.displayDimensions.base;
                };else options['evostreet.options']['house.distribution'] = document.getElementById('l_sort').value;

                if (document.getElementById('l_pack').value === 'linear') options['evostreet.options']['house.container'] = require('../illustrator/container/row.js');
                if (document.getElementById('l_pack').value === 'grid') options['evostreet.options']['house.container'] = require('../illustrator/container/grid.js');
                if (document.getElementById('l_pack').value === 'light') options['evostreet.options']['house.container'] = require('../illustrator/container/lightmap.js');

                var rules = [];
                rules.push(require('../illustrator/rules/save-first-version.js')());
                if (document.getElementById('r_loc').checked) rules.push(require('../illustrator/rules/loc-to-height.js')());
                if (document.getElementById('r_edit').checked) rules.push(require('../illustrator/rules/editor-to-width.js')());
                if (document.getElementById('r_pack').checked) rules.push(require('../illustrator/rules/package-to-color.js')());
                if (document.getElementById('r_opac').checked) rules.push(require('../illustrator/rules/opacity-if-not-in-version.js')());

                var version = document.getElementById('version').value;

                renderFunction(options, rules, version);

                if (document.getElementById('legend_div')) {
                    var legendDisplay = document.getElementById('r_pack').checked ? 'block' : 'none';
                    document.getElementById('legend_div').style['display'] = legendDisplay;
                }
            });

            var container = document.createElement('div');
            container.appendChild(b);
            container.style['margin'] = '18px 0 2px 0';
            container.style['padding'] = '0 25px 0 0';
            container.style['text-align'] = 'center';
            this._controllDiv.appendChild(container);
        }
    }, {
        key: 'appendCheckbox',
        value: function appendCheckbox(id, label, value) {
            var checked = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

            var c = document.createElement('input');
            c.setAttribute('type', 'checkbox');
            c.setAttribute('name', id);
            c.setAttribute('id', id);
            c.setAttribute('value', value);
            c.style['margin'] = '2px';
            if (checked) {
                c.setAttribute('checked', true);
            }

            var l = document.createElement('label');
            l.setAttribute('for', id);
            l.style['padding'] = '0 2px';
            l.appendChild(document.createTextNode(label));

            var container = document.createElement('div');
            container.appendChild(c);
            container.appendChild(l);
            this._controllDiv.appendChild(container);
        }
    }, {
        key: 'appendSelectBox',
        value: function appendSelectBox(id, label, contents) {
            var defaultValue = arguments.length <= 3 || arguments[3] === undefined ? '' : arguments[3];


            var s = document.createElement('select');
            s.setAttribute('name', id);
            s.setAttribute('id', id);
            s.style['margin-left'] = '5px';

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = contents[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var option = _step.value;

                    var o = document.createElement('option');
                    o.setAttribute('value', option.key);
                    o.appendChild(document.createTextNode(option.label));

                    if (String(option.key) === String(defaultValue)) {
                        o.setAttribute('selected', true);
                    }

                    s.appendChild(o);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this._controllDiv.appendChild(s);

            var container = document.createElement('div');
            container.appendChild(document.createTextNode(label));
            container.appendChild(s);
            this._controllDiv.appendChild(container);
        }
    }, {
        key: 'appendHeader',
        value: function appendHeader(name) {
            var h = document.createElement('h3');
            h.style['margin'] = '16px 10px 4px 10px';
            h.appendChild(document.createTextNode(name));
            this._controllDiv.appendChild(h);
        }
    }]);

    return Controlls;
}();

module.exports = Controlls;