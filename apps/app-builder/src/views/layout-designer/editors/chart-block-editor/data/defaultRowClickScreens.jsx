const getRowClickDefault = (tableName) => {
  switch (tableName) {
    case 'Invoice':
      return {
        appId: 'ec3cd016-e8de-4244-b8cf-a29300ae95eb',
        appName: 'Invoices',
        screenId: '9f283339-fdfd-4d42-befc-94a5fbe6e93a',
        screenName: 'New / Edit Invoice',
      };
    case 'Estimate':
      return {
        appId: 'e5ab3ab8-7a93-4e7e-9748-a33b00d8ce3b',
        appName: 'Estimates',
        screenId: '56b62494-41d9-48f6-ad97-23019b36ff0e',
        screenName: 'New / Edit Estimate',
      };
    case 'SalesOrder':
      return {
        appId: '55b7fa26-9d45-400d-829f-a3610098567c',
        appName: 'Sales Orders',
        screenId: 'ff06016e-4256-4c8e-814e-b6a8e0a8ac23',
        screenName: 'New / Edit Sales Order',
      };
    case 'Opportunity':
      return {
        appId: '62d5aca0-a2fb-4d62-8af4-a38100a17531',
        appName: 'Opportunities',
        screenId: 'f3afcb4e-2aca-4d0e-ab3d-c5063cb8dcdd',
        screenName: 'New / Edit Opportunity ',
      };
    case 'ReceivePayment':
      return {
        appId: '8af71562-f84f-4988-abc6-a3a7009daad2',
        appName: 'Payments',
        screenId: '367d0b71-b20d-4486-8e86-303d4c7f2c8e',
        screenName: 'New / Edit Payment',
      };
    case 'TimeTracking':
      return {
        appId: '98bee3a2-ff0a-46d5-a61b-a3ea011325e1',
        appName: 'Time Tracking',
        screenId: '4134c59f-fe18-419d-a1ca-ee22833acb39',
        screenName: 'New / Edit Time Entry',
      };
    case 'PurchaseOrder':
      return {
        appId: '16fb50e7-05c2-49a4-b766-a3ce00ccdefe',
        appName: 'Purchase Orders',
        screenId: '324c700c-8853-4cd3-9bfe-efb5399baf25',
        screenName: 'New / Edit Purchase Order',
      };
    case 'Bill':
      return {
        appId: 'd33e87b4-bd6d-4357-9a1c-a65f00e201fb',
        appName: 'Bills',
        screenId: 'db0e76b1-3426-4cd7-a85f-7ee3f238daf6',
        screenName: 'New / Edit Bill',
      };

    default:
      return null;
  }
};

export default getRowClickDefault;
