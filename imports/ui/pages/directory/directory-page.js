import { Template } from 'meteor/templating';
import { Events } from '/imports/api/event/EventCollection';

Template.Directory_Page.onCreated(function onCreated() {
  this.subscribe(Events.getPublicationName());
});

Template.Directory_Page.helpers({

  /**
   * Returns a cursor to events, sorted by last name.
   */
  events() {
    return Events.find({}, { sort: { eventName: 1 } });
  },
});
