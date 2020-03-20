import { LightningElement, api, wire } from 'lwc';
import getRelatedFiles from '@salesforce/apex/fieldsOnFiles.getRelatedFiles';
import { refreshApex } from '@salesforce/apex';

import {
  subscribe,
  unsubscribe,
  APPLICATION_SCOPE,
  MessageContext
} from 'lightning/messageService';
import MC from '@salesforce/messageChannel/FieldsOnFilesMessages__c';

export default class FieldsOnFilesRelatedList extends LightningElement {
  _fieldsListArray = [];
  subscription = null;
  // "environment" variables
  @api recordId;

  // configurable properties from design
  @api showSharing;
  @api showPreview;
  @api cardTitle;
  //   @api sortBy;
  //   @api sortDirection;

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
    await refreshApex(this.wiredFiles);
  }

  @wire(MessageContext)
  messageContext;

  connectedCallback() {
    this.subscription = subscribe(
      this.messageContext,
      MC,
      () => this.refresh(),
      { scope: APPLICATION_SCOPE }
    );
  }

  disconnectedCallback() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }
}
