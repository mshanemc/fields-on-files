public with sharing class fieldsOnFiles {
  @auraEnabled(cacheable=true)
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
    CDL.Visibility = Visibility;
    CDL.ShareType = 'I';
    update CDL;
  }
}

// delete [select id from ContentDocument];

