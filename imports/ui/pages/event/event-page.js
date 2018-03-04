import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';
import { Events } from '/imports/api/event/EventCollection';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Profiles } from '/imports/api/profile/ProfileCollection';

Template.Event_Page.helpers({
  routeUserName() {
    return Profiles.FlowRouter.getParam('username');
  },
  event() {
    return Events.findDoc(FlowRouter.getParam('_id'));
  },
  attending(event) {
    return _.contains(event.eventAttending, FlowRouter.getParam('username'));
  },
});
Template.Event_Page.events({

  'click .delete'(event, instance) {
    const userName = FlowRouter.getParam('username');
    const eventID = instance.data.event._id;
    Events.update(eventID, { $pull: { attending: userName } });
  },
  'click .rsvp'(event, instance) {
    const userName = FlowRouter.getParam('username');
    const eventID = instance.data.event._id;
    Events.update(eventID, { $push: { attending: userName } });
  },
  'click .edit'() {
    const userName = FlowRouter.getParam('username');
    const eventID = FlowRouter.getParam('userName');
    FlowRouter.go('Edit_Event_Page', { userName, eventID });
  },
});
