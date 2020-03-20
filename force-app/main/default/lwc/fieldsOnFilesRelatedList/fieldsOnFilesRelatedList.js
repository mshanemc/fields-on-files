import { LightningElement, api, wire } from 'lwc';
import getRelatedFiles from '@salesforce/apex/fieldsOnFiles.getRelatedFiles';
import { refreshApex } from '@salesforce/apex';

export default class FieldsOnFilesRelatedList extends LightningElement {
  _fieldsListArray = [];

  // "environment" variables
  @api recordId;

  // configurable properties from design
  @api showSharing;
  @api showPreview;
  @api cardTitle;
  @api sortBy;
  @api sortDirection;

  @api
  get fieldsList() {
    return this._fieldsListArray || [];
  }

  set fieldsList(configString) {
    // app builder provides a string, comma separated.  convert into a trimmed array of strings;
    this._fieldsListArray = configString.split(',').map(item => item.trim());
  }

  get fileIds() {
    return this.wiredFiles.data
      ? this.wiredFiles.data.map(record => record.Id)
      : [];
  }

  get isEmpty() {
    return this.wiredFiles.data && this.wiredFiles.data.length === 0;
  }
  // query for the related files
  @wire(getRelatedFiles, { recordId: '$recordId' })
  wiredFiles;

  async refresh() {
    console.log('refresh is called');
    await refreshApex(this.wiredFiles);
  }
}
