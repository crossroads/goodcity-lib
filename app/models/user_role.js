import DS from 'ember-data';

var belongsTo = DS.belongsTo;

export default DS.Model.extend({
  user: belongsTo('user', { async: false }),
  role: belongsTo('role', { async: false })
});
