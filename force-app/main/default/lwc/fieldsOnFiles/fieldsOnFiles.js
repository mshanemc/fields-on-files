import { LightningElement, api, wire } from 'lwc';
import getCVId from '@salesforce/apex/fieldsOnFiles.getCVId';
import modifyContentDocumentLink from '@salesforce/apex/fieldsOnFiles.modifyContentDocumentLink';
import { publish, MessageContext } from 'lightning/messageService';
import MC from '@salesforce/messageChannel/FieldsOnFilesMessages__c';

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
  sharingDisplayed;

  connectedCallback() {
    this.sharingDisplayed = this.showSharing;
  }

  @wire(getCVId, { ContentDocumentId: '$latestCDid' })
  wiredCVid({ error, data }) {
    if (error) {
      console.error(error);
    } else if (data) {
      // console.log(data);
      this.latestCVid = data;
    }
  }

  @wire(MessageContext)
  messageContext;

  async handleUploadFinished(event) {
    // const uploadedFiles = event.detail.files;
    // console.log(event.detail.files);
    this.latestCDid = event.detail.files[0].documentId;
    // set it to the default
    await modifyContentDocumentLink({
      LinkedEntityId: this.recordId,
      ContentDocumentId: this.latestCDid,
      Visibility: this.defaultCustomerVisibility ? 'AllUsers' : 'InternalUsers'
    });
    // cause sharing component to refresh?
    if (this.showSharing) {
      this.sharingDisplayed = false;
      this.sharingDisplayed = this.showSharing;
    }
    publish(this.messageContext, MC, { parentRecordId: this.recordId });
  }

  handleCVUpdate() {
    // reset everything
    this.latestCDid = undefined;
    this.latestCVid = undefined;
    publish(this.messageContext, MC, { parentRecordId: this.recordId });
  }
}
