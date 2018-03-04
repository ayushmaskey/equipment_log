import { Template } from 'meteor/templating';

Template.Tags_Form_Field.onRendered(function onRendered() {
  this.$('.dropdown').dropdown();
});

