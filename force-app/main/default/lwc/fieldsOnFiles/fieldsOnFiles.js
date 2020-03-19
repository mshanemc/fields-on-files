import { LightningElement, api, wire } from 'lwc';
import modifyContentDocumentLink from '@salesforce/apex/fieldsOnFiles.modifyContentDocumentLink';
import getCVId from '@salesforce/apex/fieldsOnFiles.getCVId';

export default class FieldsOnFiles extends LightningElement {
  get acceptedFormats() {
    return ['.png', '.gif', 'jpg', '.mov', 'jpeg'];
  }

  _fieldsListArray = [];

  // "environment" variables
  @api recordId;
  @api objectApiName;

  // configurable properties from design
  @api showSharing;
  @api showPreview;
  @api defaultCustomerVisibility;

  @api
  get fieldsList() {
    return this._fieldsListArray || [];
  }

  set fieldsList(configString) {
    // app builder provides a string, comma separated.  convert into a trimmed array of strings;
    this._fieldsListArray = configString.split(',').map(item => item.trim());
  }

  latestCDid;
  latestCVid;
  customerVisibility;

  connectedCallback() {
    console.log('fields list: ', this.fieldsList);
    console.log(`default customer visibility`, this.defaultCustomerVisibility);
    this.customerVisibility = this.defaultCustomerVisibility;
  }

  @wire(getCVId, { ContentDocumentId: '$latestCDid' })
  wiredCVid({ error, data }) {
    if (error) {
      console.error(error);
    } else if (data) {
      console.log(data);
      this.latestCVid = data;
    }
  }

  async handleUploadFinished(event) {
    // const uploadedFiles = event.detail.files;
    console.log(event.detail.files);
    this.latestCDid = event.detail.files[0].documentId;
    await this.visibilityUpdate();
  }

  async visibilityUpdate() {
    const visible = this.showSharing
      ? this.template.querySelector(
          'lightning-input[data-locator="visibility"]'
        ).checked
      : this.defaultCustomerVisibility;
    console.log(`about to set CDL visibility to ${visible}`);

    await modifyContentDocumentLink({
      LinkedEntityId: this.recordId,
      ContentDocumentId: this.latestCDid,
      Visibility: visible ? 'AllUsers' : 'InternalUsers'
    });
  }

  handleCVUpdate() {
    // reset everything
    this.latestCDid = undefined;
    this.latestCVid = undefined;
    this.customerVisibility = this.defaultCustomerVisibility;
  }
}
