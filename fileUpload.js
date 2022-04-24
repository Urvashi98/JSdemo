import React, { cloneElement } from "react";

import { resolve } from "@cvent/nucleus-dynamic-css";
import PropTypes from "prop-types";
import { KEY_RETURN, KEY_SPACE } from "../utils/keyCodes";

/**
 * IE9+ Compatible FileUpload Component
 * Uses a hidden iFrame to upload file to a given endpoint
 * */

class FileUpload extends React.Component {
  static displayName = "FileUpload";
  static propTypes = {
    /** Children objects to render inside of upload container */
    children: PropTypes.node,
    /** Field ID to be used as ID for the form element*/
    fieldId: PropTypes.string,
    /** Field Name to be used as the name for the form element*/
    fieldName: PropTypes.string,
    /** Frame Name to be used as ID for the frame element*/
    frameName: PropTypes.string,
    /** Form Action Method [put/post] */
    method: PropTypes.oneOf(["put", "post"]),
    /** Form Action URL */
    formAction: PropTypes.string.isRequired,
    /** Deferred Submit */
    deferSubmit: PropTypes.bool,
    /** Accepted File Formats */
    fileFormats: PropTypes.array,
    /** Max File Size */
    maxFileSize: PropTypes.number,
    /** Disable Form Boolean */
    disabled: PropTypes.bool,
    /** Callback for Upload Start */
    onFileUploadStart: PropTypes.func,
    /** Callback for Upload Response */
    onFileUploadResponse: PropTypes.func,
    /** Callback for File Size Error */
    onFileSizeError: PropTypes.func,
    /** Callback for File Type Error */
    onFileTypeError: PropTypes.func,
    /** Flag to determine if children are plain html **/
    isChildPlainHtml: PropTypes.bool,
    /** aria-label for the label input **/
    ariaLabel: PropTypes.string,
  };

  static defaultProps = {
    maxFileSize: 10485760,
    ariaLabel: "",
  };

  constructor(props) {
    super(props);
    this.state = {
      isSubmitting: false,
      fileSelected: false,
    };
    // If frameName is not provided use simple generated hash for form target //
    this.defaultFrameName = `target${((Math.random() * 0xffffff) << 0).toString(
      16
    )}`;
    this.onFileChange = this.onFileChange.bind(this);
    this.onIFrameLoad = this.onIFrameLoad.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.triggerUpload = this.triggerUpload.bind(this);
    this.clearSelectedFile = this.clearSelectedFile.bind(this);
    this.keyPressDown = this.keyPressDown.bind(this);

    this.inlineHidden = {
      position: "absolute",
      clip: "rect(0 0 0 0)",
      border: "0",
      height: "1px",
      width: "1px",
      margin: "-1px",
      overflow: "hidden",
      padding: "0",
    };
  }

  componentDidMount() {
    const frame = this.uploadIframe;
    if (frame.addEventListener) {
      frame.addEventListener("load", () => this.onIFrameLoad());
    } else if (frame.attachEvent) {
      frame.attachEvent("load", () => this.onIFrameLoad());
    }
  }

  onFileChange() {
    const form = this.uploadInput;
    this.setState({
      fileSelected: true,
    });
    if (this.isValidFileType(form) && this.isValidFileSize(form)) {
      if (!this.props.deferSubmit) {
        this.submitForm();
      }
    }
  }

  onIFrameLoad() {
    if (this.state.isSubmitting) {
      this.setState({ isSubmitting: false });
      const frame = this.uploadIframe;
      const content = frame.contentDocument || frame.contentWindow.document;

      let response;
      if (content.body && content.body.innerText) {
        response = JSON.parse(content.body.innerText);
      }
      if (this.props.onFileUploadResponse) {
        this.props.onFileUploadResponse(response);
      }
    }
  }

  clearSelectedFile() {
    this.uploadForm.reset();
    this.setState({
      fileSelected: false,
    });
  }

  isValidFileType(form) {
    const fileName =
      form.files && form.files.length ? form.files[0].name : form.value;
    // Take care of the case where the widget tries to fire upload without a file
    if (!fileName || fileName === "") {
      return false;
    }
    const { fileFormats } = this.props;
    if (!fileFormats) {
      return true;
    }
    // Match exact file extension (without .)
    const extension = fileName.split(".").pop();
    const isValid = new RegExp("^(" + fileFormats.join("|") + ")$", "i").test(
      extension
    );
    if (!isValid && this.props.onFileTypeError) {
      this.props.onFileTypeError(extension);
    }
    return isValid;
  }

  isValidFileSize(form) {
    const fileSize = form.files && form.files.length ? form.files[0].size : 0;
    const { maxFileSize } = this.props;
    const isValid = fileSize > 0 && fileSize <= maxFileSize;
    if (!isValid && this.props.onFileSizeError) {
      this.props.onFileSizeError();
    }
    return isValid;
  }

  submitForm(evt) {
    this.setState({ isSubmitting: true });
    this.uploadForm.submit(evt);
    if (this.props.onFileUploadStart) {
      this.props.onFileUploadStart();
    }
  }

  keyPressDown(evt) {
    if (evt.keyCode === KEY_SPACE || evt.keyCode === KEY_RETURN) {
      this.triggerUpload(evt);
    }
  }

  triggerUpload = (evt) => {
    if (evt) {
      evt.preventDefault();
    }
    this.uploadInput.click();
  };

  render() {
    const {
      children,
      disabled,
      fieldId,
      fieldName,
      method = "post",
      formAction,
    } = this.props;
    const elements = this.props.isChildPlainHtml
      ? children
      : React.Children.map(children, (child) => {
          return cloneElement(child, {
            triggerUpload: this.triggerUpload,
            uploadInput: this.uploadInput,
            clearSelectedFile: this.clearSelectedFile,
            fileSelected: this.state.fileSelected,
          });
        });

    return (
      <div {...resolve(this.props, "container")}>
        <iframe
          key="uploadFrame"
          src=""
          id={this.props.frameName || this.defaultFrameName}
          name={this.props.frameName || this.defaultFrameName}
          style={this.inlineHidden}
          ref={(c) => (this.uploadIframe = c)}
          height="0"
          width="0"
          frameBorder="0"
          aria-hidden="true"
          tabIndex="-1"
        />
        <form
          {...resolve(this.props, "form")}
          ref={(c) => (this.uploadForm = c)}
          action={formAction}
          method={method}
          encType="multipart/form-data"
          target={this.props.frameName || this.defaultFrameName}
          onSubmit={this.submitForm}
        >
          <label
            htmlFor={fieldId || fieldName}
            aria-label={this.props.ariaLabel}
            tabIndex="0"
            role="button"
            onKeyDown={(e) => this.keyPressDown(e)}
          >
            {/*
              <input type="file" /> cannot be nested inside <label> for Edge browser < 15.15
              https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/8282613/
            */}
            {elements}
          </label>
          <input
            {...resolve(this.props, "fileInput")}
            disabled={disabled}
            type="file"
            id={fieldId || fieldName}
            name={fieldName}
            ref={(c) => (this.uploadInput = c)}
            onChange={this.onFileChange}
            aria-hidden="true"
            tabIndex="-1"
          />
        </form>
      </div>
    );
  }
}

export default FileUpload;


{
  "mode": "edit",
  "label": "<span />",
  "hideLabel": false,
  "showAdditionalLabelTextInViewMode": false,
  "fieldId": "fileUpload",
  "required": true,
  "element": "label",
  "classes": {
    "label": "QuestionText__labelOnTop___1C8o0 QuestionText__label___3oIFA",
    "smallContainer": "QuestionText__smallContainer___37su4",
    "labelOnTop": "QuestionText__labelOnTop___1C8o0 QuestionText__label___3oIFA",
    "hidden": "QuestionText__hidden___1fjkX",
    "required": "GuestSideFormLabels__required___31kcz",
    "additionalLabelText": "QuestionText__additionalLabelText___1kTzF",
    "errorMessages": "{container: \"GuestSideFormErrorMessages__container_…}"
  },
  "style": {
    "container": "{backgroundColor: \"transparent\", borderRadius: 0, f…}",
    "button": "{backgroundColor: \"#041532\", borderColor: \"#041532\"…}",
    "label": "{backgroundColor: \"transparent\", borderRadius: 0, c…}",
    "fileName": "{backgroundColor: \"#F7F7F7\", borderRadius: 0, color…}",
    "deleteLink": "{backgroundColor: \"transparent\", borderRadius: 0, c…}",
    "profileImage": "{}",
    "fileContainer": "{backgroundColor: \"#F7F7F7\"}"
  },
  "data-cvent-id": "label"
}