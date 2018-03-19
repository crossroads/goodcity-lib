import DS from 'ember-data';

var attr = DS.attr, hasMany = DS.hasMany;

export default DS.Model.extend({
  name: attr('string'),
  rolePermissions: hasMany('rolePermissions', { async: false }),
  users: hasMany('users', { async: false })
});
