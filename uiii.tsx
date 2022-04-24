import React from 'react';
import PropTypes from 'prop-types';
import { LinkTypes, LinkTargets } from './constants';
import * as classes from './EditFormCss';
import { DatatagRegex } from '@cvent/carina-datatag-selector';

type Props = {
  config: any;
  link?: any;
  selectedText?: string;
  translate: (...args: any[]) => any;
  onSave: (...args: any[]) => any;
  onCancel: (...args: any[]) => any;
};

type State = any;

/**
 * A base edit form component that can be extended by the consuming application to create a compatible look and feel
 * for the add/edit link form for their application.
 */
export default class LinkControlEditorForm extends React.Component<
  Props,
  State
> {
  static propTypes = {
    config: PropTypes.object.isRequired,
    link: PropTypes.object,
    selectedText: PropTypes.string,
    translate: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  };

  /**
   * The constructor sets up the expected state properties: type, url, text, target
   */
  constructor(props: Props) {
    super(props);
    const { selectedText, link = {} } = props;
    this.state = {
      type: link.type || LinkTypes.WEB_ADDRESS,
      url: link.url || '',
      text: link.text || selectedText || '',
      subjectLine: link.subjectLine || '',
      target: link.target || LinkTargets.NEW_TAB
    };
  }

  /**
   * Setter functions to set the relevant data fields.
   * Ideally you should use these rather than set the state variables yourself.
   */
  setType = (type: any) => {
    this.setState({
      type,
      // If switching to a new type, clear the url.
      url: type !== this.state.type ? '' : this.state.url,
      // If setting to email address, force target to new tab.
      target:
        type === LinkTypes.EMAIL_ADDRESS
          ? LinkTargets.NEW_TAB
          : this.state.target
    });
  };
  setUrl = (url: any) => {
    this.setState({
      url
    });
  };
  setText = (text: any) => {
    this.setState({
      text
    });
  };
  setSubjectLine = (subjectLine: any) => {
    this.setState({
      subjectLine
    });
  };
  setTarget = (target: any) => {
    this.setState({
      target
    });
  };
  /** ********** End Setter Functions *********** */

  /**
   * Gets a formatted version of the current URL or a datatag to use when saving or validating.
   * Returns null if the URL or datatag is invalid.
   */
  formatUrl = () => {
    const { type, url } = this.state;

    if (!url || !(typeof url === 'string' || url instanceof String)) {
      return undefined;
    }

    let trimmedUrl = url.trim();
    if (!trimmedUrl) {
      return undefined;
    }

    // Check if the url is a datatag.
    // Datatags that resolve to links should already fully resolve with a protocol.
    // Datatags that resolve to email address don't have "mailto:" prefixed,
    // so we are adding the prefix for email datatags.
    const regex = DatatagRegex;
    regex.lastIndex = 0;
    const match = regex.exec(trimmedUrl);
    if (match !== null && trimmedUrl.length === match[0].length) {
      return type === LinkTypes.EMAIL_ADDRESS
        ? `mailto:${trimmedUrl}`
        : trimmedUrl;
    }

    // Add an appropriate protocol to the URL if one is not provided.
    /**
     * (bug-fix) NUKE-7768/PROD-122574: The use case for the '{[' check is if the url has a data tag
     * in the front, followed by additional query string params like '&foo=bar',
     * then we don't wanna add 'https://' to the front of the url automatically.
     * Additionally, there is (essentially) no chance someone will start the url field
     * with '{[' and not intend to have a data tag.
     */
    if (type === LinkTypes.WEB_ADDRESS) {
      if (
        !trimmedUrl.startsWith('//') &&
        !trimmedUrl.startsWith('http://') &&
        !trimmedUrl.startsWith('https://') &&
        !trimmedUrl.startsWith('{[')
      ) {
        trimmedUrl = `https://${trimmedUrl}`;
      }
    } else if (type === LinkTypes.EMAIL_ADDRESS) {
      if (!trimmedUrl.startsWith('mailto:')) {
        trimmedUrl = `mailto:${trimmedUrl}`;
      }
    }

    return trimmedUrl;
  };

  /**
   * Just a top level validation of the form that verifies that there is some kind of text and a valid URL defined.
   */
  isValid = () => {
    return this.formatUrl() && this.state.text;
  };

  /**
   * You can extend the save function to do more things or make your own, but ultimately you at least have to call
   * the onSave function property in order to complete the link add/edit.
   */
  onSave = () => {
    if (!this.isValid()) {
      return;
    }
    const { text, ...rest } = this.state;
    this.props.onSave(text, {
      ...rest,
      url: this.formatUrl()
    });
  };

  /**
   * Because of how some of the editor focus state stuff works, we have the top level wrapping div of this
   * component prevent propagation of clicks. This is probably unnecessary if the consuming application is
   * using renderToolbarFlyout to render this content separately from the editor.
   */
  stopPropagation = (event: any) => {
    event.stopPropagation();
  };

  /**
   * A simple switch statement to pick which setter function to use. Not expected to use this in your extended
   * component.
   */
  updateValue = (event: any) => {
    switch (event.target.id) {
      case 'LINK_TYPE':
        this.setType(event.target.value);
        return;
      case 'LINK_URL':
        this.setUrl(event.target.value);
        return;
      case 'LINK_TEXT':
        this.setText(event.target.value);
        return;
      case 'SUBJECT_LINE':
        this.setSubjectLine(event.target.value);
        return;
      case 'LINK_TARGET':
        this.setTarget(event.target.value);
        return;
      default:
        return;
    }
  };

  /**
   * For now, consuming apps are expected to implement their own render function so that the link configuration has a
   * consistent look and feel with the app. Eventually it is expected for this form to be implemented using design
   * system components that might make this more of a "drop in" solution instead of having to extend it.
   */
  render() {
    const { translate, onCancel } = this.props;
    const { type, text, url, target, subjectLine } = this.state;

    const typeControl = (
      <div css={classes.formField}>
        <label css={classes.formFieldLabel} htmlFor="LINK_TYPE">
          {translate('Carina_RichTextEditor_Controls_LinkEditor_TypeLabel')}
        </label>
        <select
          id="LINK_TYPE"
          value={type}
          onChange={this.updateValue}
          css={classes.formFieldInput}
        >
          <option value={LinkTypes.WEB_ADDRESS}>
            {translate(
              `Carina_RichTextEditor_Controls_LinkEditor_TypeOptions_${LinkTypes.WEB_ADDRESS}`
            )}
          </option>
          <option value={LinkTypes.EMAIL_ADDRESS}>
            {translate(
              `Carina_RichTextEditor_Controls_LinkEditor_TypeOptions_${LinkTypes.EMAIL_ADDRESS}`
            )}
          </option>
        </select>
      </div>
    );

    const urlControl = (
      <div css={classes.formField}>
        <label css={classes.formFieldLabel} htmlFor="LINK_URL">
          {type === LinkTypes.WEB_ADDRESS
            ? translate('Carina_RichTextEditor_Controls_LinkEditor_UrlLabel')
            : translate(
                'Carina_RichTextEditor_Controls_LinkEditor_EmailAddressLabel'
              )}
        </label>
        <input
          id="LINK_URL"
          onChange={this.updateValue}
          value={url}
          css={classes.formFieldInput}
        />
      </div>
    );

    const textControl = (
      <div css={classes.formField}>
        <label css={classes.formFieldLabel} htmlFor="LINK_TEXT">
          {translate('Carina_RichTextEditor_Controls_LinkEditor_TextLabel')}
        </label>
        <input
          id="LINK_TEXT"
          onChange={this.updateValue}
          value={text}
          css={classes.formFieldInput}
        />
      </div>
    );

    let targetControl;
    if (type === LinkTypes.WEB_ADDRESS) {
      targetControl = (
        <div css={classes.formField}>
          <label css={classes.formFieldLabel} htmlFor="LINK_TARGET">
            {translate('Carina_RichTextEditor_Controls_LinkEditor_TargetLabel')}
          </label>
          <select
            id="LINK_TARGET"
            value={target}
            onChange={this.updateValue}
            css={classes.formFieldInput}
          >
            <option value={LinkTargets.NEW_TAB}>
              {translate(
                `Carina_RichTextEditor_Controls_LinkEditor_TargetOptions_${LinkTargets.NEW_TAB}`
              )}
            </option>
            <option value={LinkTargets.CURRENT_TAB}>
              {translate(
                `Carina_RichTextEditor_Controls_LinkEditor_TargetOptions_${LinkTargets.CURRENT_TAB}`
              )}
            </option>
          </select>
        </div>
      );
    }

    let subjectLineControl;
    if (type === LinkTypes.EMAIL_ADDRESS) {
      subjectLineControl = (
        <div css={classes.formField}>
          <label css={classes.formFieldLabel} htmlFor="SUBJECT_LINE">
            {translate('Carina_RichTextEditor_Controls_LinkEditor_SubjectLine')}
          </label>
          <input
            id="SUBJECT_LINE"
            onChange={this.updateValue}
            value={subjectLine}
            css={classes.formFieldInput}
          />
        </div>
      );
    }
    /* eslint-disable jsx-a11y/click-events-have-key-events */
    return (
      <div onClick={this.stopPropagation}>
        <h3 css={classes.formHeader}>
          {translate('Carina_RichTextEditor_Controls_LinkEditor_Title')}
        </h3>
        {typeControl}
        {urlControl}
        {subjectLineControl}
        {textControl}
        {targetControl}
        <div css={classes.formButtonGroup}>
          <button
            onClick={this.onSave}
            disabled={!this.isValid()}
            css={classes.formButton}
          >
            {translate(
              'Carina_RichTextEditor_Controls_LinkEditor_SaveButtonText'
            )}
          </button>
          <button onClick={onCancel} css={classes.formButton}>
            {translate(
              'Carina_RichTextEditor_Controls_LinkEditor_CancelButtonText'
            )}
          </button>
        </div>
      </div>
    );
    /* eslint-enable jsx-a11y/click-events-have-key-events */
  }
}
