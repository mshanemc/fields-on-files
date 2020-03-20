import { LightningElement, api, wire } from 'lwc';
import modifyContentDocumentLink from '@salesforce/apex/fieldsOnFiles.modifyContentDocumentLink';
import communitiesEnabled from '@salesforce/apex/fieldsOnFiles.communitiesEnabled';
import externalSharingOnCDL from '@salesforce/apex/fieldsOnFiles.externalSharingOnCDL';

export default class FieldsOnFilesVisibilityToggle extends LightningElement {
  @api recordId;
  @api contentDocumentId;

  @api
  async visibilityUpdate(allUsers) {
    await modifyContentDocumentLink({
      LinkedEntityId: this.recordId,
      ContentDocumentId: this.contentDocumentId,
      Visibility: allUsers ? 'AllUsers' : 'InternalUsers'
    });
  }

  value;
  disabled = true;

  @wire(communitiesEnabled, {})
  wiredCommunitiesEnabled({ error, data }) {
    if (error) {
      console.error(error);
    } else if (data) {
      // console.log(data);
      this.disabled = !data;
    }
  }

  @wire(externalSharingOnCDL, {
    ContentDocumentId: '$contentDocumentId',
    LinkedEntityId: '$recordId'
  })
  wiredExternalSharing({ error, data }) {
    if (error) {
      console.error(error);
    } else if (data) {
      // console.log(data);
      this.value = data;
    }
  }

  async visibilityToggled() {
    await this.visibilityUpdate(
      this.template.querySelector('lightning-input[data-locator="visibility"]')
        .checked
    );
  }
}
