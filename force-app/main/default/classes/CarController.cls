public with sharing class CarController {
    //wrapper class
    public class Filters{
        @AuraEnabled
        public String searchKey {get;set;}
        @AuraEnabled
        public Decimal maxPrice {get;set;}
        @AuraEnabled
        public String[] categories {get;set;}
        @AuraEnabled
        public String[] makeType {get;set;}
        @AuraEnabled
        public String sortKey {get;set;}
    }

    @AuraEnabled(Cacheable=true)
    public static List<Car__c> getCars(Filters filters){
        String key, whereClause = '',orderByClause = 'ORDER BY Name';
        Decimal maxPrice;
        String[] categories,makeType,criteria = new List<String>{};
        if(filters != null){
            maxPrice = filters.maxPrice;
            categories = filters.categories;
            makeType = filters.makeType;
            if(!String.isEmpty(filters.searchKey)){
                key = '%'+filters.searchKey + '%';
                criteria.add('Name LIKE: key');
            }
            if(filters.maxPrice >= 0){
                criteria.add('MSRP__c <= :maxPrice');
            }
            if(filters.categories != null){
                criteria.add('Category__c IN :categories');
            }
            if(filters.makeType != null){
                criteria.add('Make__c IN :makeType');
            }
            if(criteria.size()>0){
                whereClause =  'WHERE ' + String.join(criteria, ' AND ');
            }

            if(!String.isEmpty(filters.sortKey)){
                if(filters.sortKey == 'highttolow'){
                    orderByClause = 'ORDER BY MSRP__c DESC';
                }else{
                    orderByClause = 'ORDER BY MSRP__c ASC'; 
                }
            }
        }
        String query = 'SELECT Id, Name, MSRP__c, Description__c, Category__c, Picture_URL__c FROM Car__c ' + whereClause + ' WITH SECURITY_ENFORCED  '+orderByClause;
        return Database.query(query);
    } 

    @AuraEnabled
    public static Car__c[] getSimilarCars(Id carId,String[] makeType){
        return [SELECT Id, Name, MSRP__c, Description__c, Category__c, Picture_URL__c FROM Car__c WHERE Make__c IN :makeType AND Id != :carId];
    }
}
