import DS from 'ember-data';

var belongsTo = DS.belongsTo;

export default DS.Model.extend({
  role: belongsTo('role', { async: false }),
  permission: belongsTo('permission', { async: false })
});
