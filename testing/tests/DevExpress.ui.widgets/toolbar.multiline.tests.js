import $ from 'jquery';
import 'ui/toolbar';
import 'ui/button';
import 'ui/select_box';
import { extend } from 'core/utils/extend';
import { value as viewPort } from 'core/utils/view_port';

import { MultiLineStrategy } from 'ui/toolbar/strategy/toolbar.multiline';
import { SingleLineStrategy } from 'ui/toolbar/strategy/toolbar.singleline';

import 'generic_light.css!';

const TOOLBAR_ITEMS_CLASS = 'dx-toolbar-item';
const TOOLBAR_ITEMS_CONTAINER_CLASS = 'dx-toolbar-items-container';
const TOOLBAR_ITEM_HEIGHT = 36;

const BUTTON_TEXT_CLASS = 'dx-button-text';

class ToolbarTestWrapper {
    constructor(options) {
        viewPort($('#container'));

        this._$toolbar = $('#toolbar').dxToolbar(extend({
            items: [{
                location: 'before',
                widget: 'dxButton',
                options: { type: 'back' }
            }, {
                location: 'before',
                widget: 'dxButton',
                options: { icon: 'refresh' }
            }, {
                location: 'before',
                widget: 'dxSelectBox',
                options: { width: 140 }
            }, {
                location: 'before',
                widget: 'dxButton',
                options: { icon: 'plus' }
            }, {
                location: 'before',
                widget: 'dxButton',
                options: { type: 'back' }
            }, {
                location: 'before',
                widget: 'dxSelectBox',
                options: { width: 140 }
            }, {
                location: 'before',
                widget: 'dxButton',
                options: { type: 'back' }
            }]
        }, options));
        this._toolbar = this._$toolbar.dxToolbar('instance');
    }

    set width(value) {
        this._toolbar.option('width', value);
    }

    set multiline(value) {
        this._toolbar.option('multiline', value);
    }

    getItems() {
        return this._$toolbar.find(`.${TOOLBAR_ITEMS_CLASS}`);
    }

    getItemContainer() {
        return this._$toolbar.find(`.${TOOLBAR_ITEMS_CONTAINER_CLASS}`);
    }

    checkToolBarHeight(expected) {
        QUnit.assert.roughEqual(this._$toolbar.height(), expected, 2.1, 'toolbar height');
    }

    checkItemsInLine(itemsIndexes, lineIndex) {
        const itemsElements = this._$toolbar.find('.dx-toolbar-item').toArray();
        const widths = itemsIndexes.map(itemIndex => $(itemsElements[itemIndex]).outerWidth());
        const getAssertMessage = (index, offsetName) => `${lineIndex} line, ${index} item, ${offsetName} offset`;

        itemsIndexes.forEach((itemIndex, i) => {
            const item = itemsElements[itemIndex];
            const expectedLeftOffset = widths.slice(0, i).reduce((result, value) => result + value, 0);

            QUnit.assert.roughEqual($(item).offset().top - this._$toolbar.offset().top, TOOLBAR_ITEM_HEIGHT * lineIndex, 2, getAssertMessage(itemIndex, 'top'));
            QUnit.assert.roughEqual($(item).offset().left - this._$toolbar.offset().left, expectedLeftOffset, 2.1, getAssertMessage(itemIndex, 'left'));
        });
    }

    checkMultilineOption(expected) {
        QUnit.assert.equal(this._toolbar.option('multiline'), expected, 'multiline option');
    }

    checkMultilineCssClass(expected) {
        QUnit.assert.equal(this._$toolbar.hasClass('dx-toolbar-multiline'), expected, 'multiline CSS class');
    }

    checkRenderLayoutStrategy(isMultiline) {
        if(isMultiline) {
            QUnit.assert.ok(this._toolbar._layoutStrategy instanceof MultiLineStrategy, 'multiline strategy render');
        } else {
            QUnit.assert.ok(this._toolbar._layoutStrategy instanceof SingleLineStrategy, 'singleline strategy render');
        }
    }
}

QUnit.testStart(() => {
    const markup = '<div id="container" class="dx-viewport"><div id=\'toolbar\'></div></div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('render', () => {
    QUnit.test('multiline is disabled by default', function() {
        const testWrapper = new ToolbarTestWrapper({ compactMode: true });
        testWrapper.checkMultilineOption(false);
        testWrapper.checkMultilineCssClass(false);

        testWrapper.width = 150;
        testWrapper.checkToolBarHeight(36);
        testWrapper.checkItemsInLine([0, 1, 2, 3, 4, 5, 6], 0);
    });

    QUnit.test('1 line: [0, 1, 2, 3, 4, 5, 6]', function() {
        const testWrapper = new ToolbarTestWrapper({ multiline: true });
        testWrapper.width = 550;
        testWrapper.checkMultilineCssClass(true);
        testWrapper.checkToolBarHeight(36);
        testWrapper.checkItemsInLine([0, 1, 2, 3, 4, 5, 6], 0);
    });

    QUnit.test('2 lines: [0, 1, 2, 3, 4], [5, 6]', function() {
        const testWrapper = new ToolbarTestWrapper({ multiline: true });
        testWrapper.width = 330;
        testWrapper.checkToolBarHeight(72);
        testWrapper.checkItemsInLine([0, 1, 2, 3, 4], 0);
        testWrapper.checkItemsInLine([5, 6], 1);
    });

    QUnit.test('2 lines: [0, 1, 2, 3], [4, 5, 6]', function() {
        const testWrapper = new ToolbarTestWrapper({ multiline: true });
        testWrapper.width = 300;
        testWrapper.checkToolBarHeight(72);
        testWrapper.checkItemsInLine([0, 1, 2, 3], 0);
        testWrapper.checkItemsInLine([4, 5, 6], 1);
    });

    QUnit.test('2 lines: [0, 1, 2], [3, 4, 5, 6]', function() {
        const testWrapper = new ToolbarTestWrapper({ multiline: true });
        testWrapper.width = 265;
        testWrapper.checkToolBarHeight(72);
        testWrapper.checkItemsInLine([0, 1, 2], 0);
        testWrapper.checkItemsInLine([3, 4, 5, 6], 1);
    });

    QUnit.test('3 lines: [0, 1, 2], [3, 4, 5], [6]', function() {
        const testWrapper = new ToolbarTestWrapper({ multiline: true });
        testWrapper.width = 260;
        testWrapper.checkToolBarHeight(108);
        testWrapper.checkItemsInLine([0, 1, 2], 0);
        testWrapper.checkItemsInLine([3, 4, 5], 1);
        testWrapper.checkItemsInLine([6], 2);
    });

    QUnit.test('4 lines: [0, 1], [2], [3, 4], [5, 6]', function() {
        const testWrapper = new ToolbarTestWrapper({ multiline: true });
        testWrapper.width = 185;

        testWrapper.checkToolBarHeight(144);
        testWrapper.checkItemsInLine([0, 1], 0);
        testWrapper.checkItemsInLine([2], 1);
        testWrapper.checkItemsInLine([3, 4], 2);
        testWrapper.checkItemsInLine([5, 6], 3);
    });

    QUnit.test('5 lines: [0, 1], [2], [3, 4], [5], [6]', function() {
        const testWrapper = new ToolbarTestWrapper({ multiline: true });
        testWrapper.width = 180;

        testWrapper.checkToolBarHeight(180);
        testWrapper.checkItemsInLine([0, 1], 0);
        testWrapper.checkItemsInLine([2], 1);
        testWrapper.checkItemsInLine([3, 4], 2);
        testWrapper.checkItemsInLine([5], 3);
        testWrapper.checkItemsInLine([6], 4);
    });

    ['always', 'inMenu'].forEach(showText => {
        QUnit.test(`button text visibility when showText is ${showText}`, function() {
            const testWrapper = new ToolbarTestWrapper({
                items: [{
                    location: 'before',
                    widget: 'dxButton',
                    showText,
                    options: { text: 'back button', icon: 'back' }
                }],
                multiline: true
            });

            QUnit.assert.strictEqual(testWrapper.getItems().eq(0).find(`.${BUTTON_TEXT_CLASS}`).is(':visible'), showText === 'always' ? true : false);
        });
    });

    QUnit.test('Items should be placed in general items container without sections', function() {
        const testWrapper = new ToolbarTestWrapper({
            multiline: true,
            items: [{
                location: 'before',
                widget: 'dxButton',
                options: { text: 'back button', icon: 'back' }
            }, {
                location: 'center',
                text: ''
            }]
        });

        const $itemContainer = testWrapper.getItemContainer();

        QUnit.assert.strictEqual($itemContainer.children().length, 2, 'itemContainer nested elements count');

        testWrapper.getItems().each((_, item) => {
            QUnit.assert.strictEqual(item.parentElement, testWrapper.getItemContainer().get(0));
        });
    });
});

QUnit.module('option changed', () => {
    QUnit.test('multiline: true -> false', function() {
        const testWrapper = new ToolbarTestWrapper({ multiline: true });
        testWrapper.width = 330;
        testWrapper.multiline = false;

        testWrapper.checkMultilineOption(false);
        testWrapper.checkMultilineCssClass(false);
        testWrapper.checkRenderLayoutStrategy(false);
        testWrapper.checkToolBarHeight(36);
        testWrapper.checkItemsInLine([0, 1, 2, 3, 4, 5, 6], 0);
    });

    QUnit.test('multiline: false -> true', function() {
        const testWrapper = new ToolbarTestWrapper();
        testWrapper.multiline = true;
        testWrapper.width = 330;

        testWrapper.checkMultilineOption(true);
        testWrapper.checkMultilineCssClass(true);
        testWrapper.checkRenderLayoutStrategy(true);
        testWrapper.checkToolBarHeight(72);
        testWrapper.checkItemsInLine([0, 1, 2, 3, 4], 0);
        testWrapper.checkItemsInLine([5, 6], 1);
    });
});
