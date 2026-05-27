export default function noSqlSvc() {
  var noSqlViews = [
    { name: 'EmailsSent', isRecordIDSupported: false },
    { name: 'EmailSenders', isRecordIDSupported: true },
  ];

  var isNoSql = (tableName) => noSqlViews.some((view) => view.name === tableName);
  var isRecordIDSupported = (tableName) =>
    !noSqlViews.some((view) => view.name === tableName && !view.isRecordIDSupported);

  return {
    views: noSqlViews,
    isNoSql: isNoSql,
    isRecordIDSupported: isRecordIDSupported,
  };
}
