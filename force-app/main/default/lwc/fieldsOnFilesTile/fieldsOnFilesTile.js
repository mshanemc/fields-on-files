import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';

import DATA from '@salesforce/schema/ContentVersion.VersionData';
import TITLE from '@salesforce/schema/ContentVersion.Title';
import EXTENSION from '@salesforce/schema/ContentVersion.FileExtension';
import CD from '@salesforce/schema/ContentVersion.ContentDocumentId';

export default class FieldsOnFilesTile extends NavigationMixin(
  LightningElement
) {
  @api cvId;
  @api recordId;
  @api showPreview;
  @api showSharing;
  @api fieldsList;

  edit = false;
  title;

  get fieldsListWithoutTitle() {
    return this.fieldsList.filter(field => field !== 'Title');
  }

  get fieldsReady() {
    return (
      this.wiredRecord && this.wiredRecord.data && this.wiredRecord.data.fields
    );
  }

  get imgUrl() {
    return this.showPreview && this.fieldsReady
      ? `data:image/${this.wiredRecord.data.fields.FileExtension.value};base64,${this.wiredRecord.data.fields.VersionData.value}`
      : undefined;
  }

  get latestCDid() {
    return this.fieldsReady
      ? this.wiredRecord.data.fields.ContentDocumentId.value
      : undefined;
  }

  @wire(getRecord, {
    recordId: '$cvId',
    fields: [DATA, TITLE, EXTENSION, CD]
  })
  wiredRecord;

  switchToEdit() {
    this.edit = true;
  }

  handleLoad(data) {
    this.title = data.detail.records[this.cvId].fields.Title.value;
  }

  handleCVUpdate() {
    console.log('updated');
    this.edit = false;
  }

  toFile(event) {
    event.preventDefault();
    if (this.isCommunity()) {
      this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
          objectApiName: 'ContentDocument',
          actionName: 'view',
          recordId: this.wiredRecord.data.fields.ContentDocumentId.value
        }
      });
    } else {
      this[NavigationMixin.Navigate]({
        type: 'standard__namedPage',
        attributes: {
          pageName: 'filePreview'
        },
        state: {
          //   recordIds: [this.wiredRecord.data.fields.ContentDocumentId.value],
          selectedRecordId: this.wiredRecord.data.fields.ContentDocumentId.value
        }
      });
    }
  }

  isCommunity() {
    return window.location.pathname.includes('/s/');
  }
}
