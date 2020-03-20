public with sharing class fieldsOnFiles {
  @AuraEnabled(cacheable=true)
  public static Id getCVId(id ContentDocumentId) {
    return [
      SELECT id
      FROM ContentVersion
      WHERE IsLatest = true AND ContentDocumentId = :ContentDocumentId
    ]
    .id;
  }

  @AuraEnabled
  public static void modifyContentDocumentLink(
    id LinkedEntityId,
    id ContentDocumentId,
    string Visibility
  ) {
    ContentDocumentLink CDL = [
      SELECT id, Visibility
      FROM ContentDocumentLink
      WHERE
        ContentDocumentId = :ContentDocumentId
        AND LinkedEntityId = :LinkedEntityId
    ];
    if (!communitiesEnabled()) {
      CDL.Visibility = 'AllUsers';
    } else {
      CDL.Visibility = Visibility;
    }
    CDL.ShareType = 'I';
    update CDL;
  }

  @AuraEnabled(cacheable=true)
  public static boolean communitiesEnabled() {
    return Type.forName('Schema.Network') != null;
  }

  @AuraEnabled(cacheable=true)
  public static Boolean externalSharingOnCDL(
    id LinkedEntityId,
    id ContentDocumentId
  ) {
    if (!communitiesEnabled()) {
      system.debug('returning false because communities are not enabled');
      return false;
    }
    ContentDocumentLink CDL = [
      SELECT id, Visibility
      FROM ContentDocumentLink
      WHERE
        ContentDocumentId = :ContentDocumentId
        AND LinkedEntityId = :LinkedEntityId
    ];
    system.debug(CDL);
    system.debug(CDL.Visibility);
    return CDL.Visibility == 'AllUsers';
  }

  @AuraEnabled(cacheable=true)
  public static list<ContentVersion> getRelatedFiles(id recordId) {
    return [
      SELECT id
      FROM ContentVersion
      WHERE IsLatest = true AND FirstPublishLocationId = :recordId
    ];
  }
}
// delete [select id from ContentDocument];
// system.debug(fieldsOnFiles.externalSharingOnCDL());
// system.debug(fieldsOnFiles.externalSharingOnCDL('0016300000iSx5lAAC', '06963000000bv9TAAQ'));
