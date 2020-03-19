public with sharing class fieldsOnFiles {
  @AuraEnabled(cacheable=true)
  public static string getSerialized(string objectName) {
    return JSON.serialize(
      [
        SELECT
          MasterLabel,
          Display_Sharing__c,
          Object__c,
          Show_Preview__c,
          (
            SELECT Field__c, Show_on_Related_List__c, Show_on_Upload_Form__c
            FROM FieldsOnFiles_Fields__r
          )
        FROM FieldsOnFiles_Settings__mdt
        WHERE Object__c = :objectName
        LIMIT 1
      ]
    );
  }

  @auraEnabled(cacheable=true)
  public static Id getCVId(id ContentDocumentId) {
    return [
      SELECT id
      FROM ContentVersion
      WHERE IsLatest = true AND ContentDocumentId = :ContentDocumentId
    ]
    .id;
  }
}
