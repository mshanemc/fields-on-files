import { LightningElement, api, wire, track } from 'lwc';
// import getSerialized from '@salesforce/apex/fieldsOnFiles.getSerialized';
import getCVId from '@salesforce/apex/fieldsOnFiles.getCVId';

export default class FieldsOnFiles extends LightningElement {
  get acceptedFormats() {
    return ['.png', '.gif', 'jpg', '.mov', 'jpeg'];
  }

  // "environment" variables
  @api recordId;
  @api objectApiName;

  // configurable properties from design
  @api fieldsList = [];
  @api showSharing;
  @api showPreview;

  @track metadata = {};
  @track fieldsMetadata = [];

  latestCDid;
  latestCVid;

  connectedCallback() {
    console.log('fields list: ', this.fieldsList);
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

  handleUploadFinished(event) {
    // const uploadedFiles = event.detail.files;
    console.log(event.detail.files);
    this.latestCDid = event.detail.files[0].documentId;
  }

  handleCVUpdate() {
    this.latestCDid = undefined;
    this.latestCVid = undefined;
  }
}
