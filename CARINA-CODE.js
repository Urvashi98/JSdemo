// Decorators -> Link

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { jsx as _jsx } from "@emotion/react/jsx-runtime";
import React from 'react';
import PropTypes from 'prop-types';
import BaseDecorator from '../BaseDecorator';
import { LinkTypes } from '../../controls/Link/constants';
import ensureSafeUrl from '../../utils/ensureSafeURL';
import startsWithDatatag from '../../utils/startsWithDatatag';
import { returnURL } from "@cvent/rich-text-editor/lib/es/utils/returnUrlAndSubject";
import { returnSubject } from "@cvent/rich-text-editor/lib/es/utils/returnUrlAndSubject";
/**
 * Link Decorator.
 */
var LinkDecorator = /** @class */ (function (_super) {
    __extends(LinkDecorator, _super);
    function LinkDecorator(config) {
        var _this = _super.call(this, config) || this;
        // @ts-expect-error ts-migrate(2416) FIXME: Property 'getComponent' in type 'LinkDecorator' is... Remove this comment to see the full error message
        _this.getComponent = function (_config) {
            var _a;
            return _a = /** @class */ (function (_super) {
                    __extends(Link, _super);
                    function Link() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    Link.prototype.render = function () {
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'entityKey' does not exist on type 'Reado... Remove this comment to see the full error message
                        var _a = this.props, children = _a.children, entityKey = _a.entityKey, contentState = _a.contentState;
                        var _b = contentState.getEntity(entityKey).getData(), url = _b.url, target = _b.target, type = _b.type, subjectLine = _b.subjectLine;
                        var newUrl = url.includes('?') ? returnURL(url) : url;
                        subjectLine = url.includes('?') ? returnSubject(url) : subjectLine;
                        if (type === LinkTypes.EMAIL_ADDRESS) {
                            // newUrl = newUrl.includes('?') ? returnURL(newUrl) : newUrl;
                            // subjectLine = newUrl.includes('?') ? returnSubject(newUrl) : subjectLine;
                            if (subjectLine) {

                                var encodedSubjectLine = encodeURI(subjectLine);

                                if (url.includes('?')) {
                                    newUrl = "".concat(newUrl, "&subject=").concat(encodedSubjectLine);
                                }
                                else {
                                    newUrl = "".concat(newUrl, "?subject=").concat(encodedSubjectLine);
                                }
                            }
                        }
                        return (_jsx("a", __assign({ href: ensureSafeUrl(newUrl), target: target }, (startsWithDatatag(newUrl) ? { 'data-datatag': newUrl } : null), { children: children })));
                    };
                    return Link;
                }(React.Component)),
                _a.propTypes = {
                    children: PropTypes.array,
                    entityKey: PropTypes.string,
                    contentState: PropTypes.object
                },
                _a;
        };
        // @ts-expect-error ts-migrate(2416) FIXME: Property 'findEntities' in type 'LinkDecorator' is... Remove this comment to see the full error message
        _this.findEntities = function (contentBlock, callback, contentState) {
            contentBlock.findEntityRanges(function (character) {
                var entityKey = character.getEntity();
                return entityKey !== null && contentState.getEntity(entityKey).getType() === 'LINK';
            }, callback);
        };
        return _this;
    }
    return LinkDecorator;
}(BaseDecorator));
var getDecorator = function (config) { return new LinkDecorator(config).getDecorator(); };
export { getDecorator as default };



// Controls/Link/index.js

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { jsx as _jsx } from "@emotion/react/jsx-runtime";
import React from 'react';
import PropTypes from 'prop-types';
import { RichUtils, EditorState, Modifier } from 'draft-js';
import { getSelectionText, getEntityRange, getSelectionEntity } from 'draftjs-utils';
import LayoutComponent from './Component';
import { LinkOptionTypes } from './constants';
import getLengthOfSelectedText from '../../utils/getLengthOfSelectedText';
import { returnURL } from "@cvent/rich-text-editor/lib/es/utils/returnUrlAndSubject";
import { returnSubject } from "@cvent/rich-text-editor/lib/es/utils/returnUrlAndSubject";
/**
 * Wrapper around the Link toolbar control based on the react-draft-wysiwyg implementation:
 * https://github.com/jpuri/react-draft-wysiwyg/blob/master/src/controls/Link/index.js
 *
 * Copyright (c) 2016 Jyoti Puri
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
 * Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var Link = /** @class */ (function (_super) {
    __extends(Link, _super);
    function Link() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.getCurrentEntity = function (props) {
            return props.editorState ? getSelectionEntity(props.editorState) : undefined;
        };
        _this.onChange = function (action, text, data) {
            if (action === LinkOptionTypes.LINK) {
                _this.addLink(text, data);
            }
            else {
                _this.removeLink();
            }
        };
        _this.getCursorValues = function () {
            var editorState = _this.props.editorState;
            var currentEntity = _this.getCurrentEntity(_this.props);
            // If no editor state, just return empty information.
            if (!editorState) {
                return {
                    link: {},
                    selectedText: ''
                };
            }
            var contentState = editorState.getCurrentContent();
            var cursorValues = {};
            if (currentEntity && contentState.getEntity(currentEntity).get('type') === 'LINK') {
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'link' does not exist on type '{}'.
                cursorValues.link = {};
                var entityRange = getEntityRange(editorState, currentEntity);
                var linkData = contentState.getEntity(currentEntity).get('data');
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'link' does not exist on type '{}'.
                cursorValues.link.type = linkData.type;
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'link' does not exist on type '{}'.
                cursorValues.link.url = returnURL(linkData.url);
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'link' does not exist on type '{}'.
                cursorValues.link.text = entityRange && entityRange.text;
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'link' does not exist on type '{}'.
                cursorValues.link.target = linkData.target;
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'link' does not exist on type '{}'.
                cursorValues.link.subjectLine = linkData.subjectLine ? linkData.subjectLine : returnSubject(linkData.url);
            }
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'selectedText' does not exist on type '{}... Remove this comment to see the full error message
            cursorValues.selectedText = getSelectionText(editorState);
            return cursorValues;
        };
        _this.removeLink = function () {
            var _a = _this.props, editorState = _a.editorState, onChange = _a.onChange;
            var currentEntity = _this.getCurrentEntity(_this.props);
            // If no editor state, do nothing.
            if (!editorState) {
                return;
            }
            var selection = editorState.getSelection();
            if (currentEntity) {
                var entityRange = getEntityRange(editorState, currentEntity);
                selection = selection.merge({
                    anchorOffset: entityRange.start,
                    focusOffset: entityRange.end
                });
                onChange(RichUtils.toggleLink(editorState, selection, null));
            }
        };
        _this.addLink = function (text, data) {
            var _a = _this.props, editorState = _a.editorState, onChange = _a.onChange, remainingCharacterCount = _a.remainingCharacterCount;
            var currentEntity = _this.getCurrentEntity(_this.props);
            // If no editor state, do nothing.
            if (!editorState) {
                return;
            }
            var selection = editorState.getSelection();
            var newRemainingCharacterCount;
            if (currentEntity) {
                var entityRange = getEntityRange(editorState, currentEntity);
                selection = selection.merge({
                    anchorOffset: entityRange.start,
                    focusOffset: entityRange.end,
                    // Setting selection to not be backward,
                    // regardless whether user selects the link text from left to right or right to left,
                    // since anchorOffset is set to entityRange.start and focusOffset is set to entityRange.end
                    // and entityRange.start is always less than entityRange.end.
                    isBackward: false
                });
                if (remainingCharacterCount !== undefined) {
                    newRemainingCharacterCount = remainingCharacterCount + entityRange.end - entityRange.start;
                }
            }
            else {
                var lengthOfSelectedText = getLengthOfSelectedText(editorState);
                if (remainingCharacterCount !== undefined) {
                    newRemainingCharacterCount = remainingCharacterCount + lengthOfSelectedText;
                }
            }
            var newText = text;
            if (newRemainingCharacterCount !== undefined) {
                if (text.length > newRemainingCharacterCount) {
                    newText = text.substring(0, newRemainingCharacterCount);
                }
                newRemainingCharacterCount = newRemainingCharacterCount - newText.length;
            }
            var entityKey = editorState
                .getCurrentContent()
                .createEntity('LINK', 'MUTABLE', __assign({}, data))
                .getLastCreatedEntityKey();
            var contentState = Modifier.replaceText(editorState.getCurrentContent(), selection, newText, editorState.getCurrentInlineStyle(), entityKey);
            var newEditorState = EditorState.push(editorState, contentState, 'insert-characters');
            onChange(EditorState.push(newEditorState, contentState, 'insert-characters'), true);
        };
        return _this;
    }
    Link.prototype.render = function () {
        var _a = this.props, config = _a.config, translate = _a.translate, renderToolbarFlyout = _a.renderToolbarFlyout, closeToolbarFlyout = _a.closeToolbarFlyout, disabled = _a.disabled, theme = _a.theme;
        var LinkComponent = config.component || LayoutComponent;
        return (_jsx(LinkComponent, { config: config, translate: translate, currentState: this.getCursorValues(), onChange: this.onChange, renderToolbarFlyout: renderToolbarFlyout, closeToolbarFlyout: closeToolbarFlyout, disabled: disabled, theme: theme }));
    };
    Link.propTypes = {
        onChange: PropTypes.func.isRequired,
        editorState: PropTypes.object,
        config: PropTypes.object.isRequired,
        translate: PropTypes.func.isRequired,
        renderToolbarFlyout: PropTypes.func.isRequired,
        closeToolbarFlyout: PropTypes.func.isRequired,
        disabled: PropTypes.bool,
        theme: PropTypes.object,
        remainingCharacterCount: PropTypes.number
    };
    return Link;
}(React.Component));
export default Link;


// rte/ utils/ returnUrlAndSubject.js

import { decode } from "punycode";

export function returnSubject(subject) {
    let newSubjectLine;

    if(subject !== "undefined"){
      if(subject.includes('?subject')){
        newSubjectLine = decodeURI(subject.substring(subject.indexOf('=')+1));
    }else {
      newSubjectLine = subject;
  }
  console.log('new SUBJECT value', newSubjectLine);
  console.log(' decoded new SUBJECT value', decodeURI(newSubjectLine));
    return newSubjectLine;
  
  }
  
    }
export function returnURL(url) {
        let newUrl;
        if(url.includes('?')){
            newUrl = decodeURI(url.substring(0, url.indexOf('?')));
        }else {
            newUrl = url;
        }
        console.log('new URL value', newUrl);
        return newUrl;
    }


//  carina-rich-text-renderer/ shared / block.js


if (entity.type === 'LINK') {
    var target = entity.data.target || '_self';
    var url = entity.data.url.includes('?') ? returnURL(entity.data.url) : entity.data.url; // Add subject line to the email address
    var subjectLine = entity.data.url.includes('?') ? returnSubject(entity.data.url) : entity.data.subjectLine;
    if (entity.data.type === LinkTypes.EMAIL_ADDRESS) {
      if (subjectLine) {
        var encodedSubjectLine = containsDatatag(subjectLine) ? encodeExcludingDatatag(subjectLine) : encodeURIComponent(subjectLine);
        //var encodedSubjectLine = encodeURIComponent(subjectLine);

        if (url.includes('?')) {
          url = "".concat(url, "&subject=").concat(encodedSubjectLine);
        } else {
          url = "".concat(url, "?subject=").concat(encodedSubjectLine);
        }
      }
    }

    return "<a href=\"".concat(url, "\" target=\"").concat(target, "\" rel=\"noreferrer\">").concat(text, "</a>");
  }