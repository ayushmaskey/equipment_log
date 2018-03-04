import { Template } from 'meteor/templating';
// import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Messages } from '/imports/api/message/MessageCollection';
import { Events } from '/imports/api/event/EventCollection';

const selectedEventKey = 'selectedEvent';


function simpleHash(str){
  let num = 2027;
  let i = 0;
  for (i = 0; i < str.length; i++) {
    num += str.charCodeAt(i);
  }
  return num;
}

Template.Message_Page.onCreated(function onCreated() {
  this.subscribe(Profiles.getPublicationName());
  this.subscribe(Messages.getPublicationName());
  this.subscribe(Events.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(selectedEventKey, undefined);
  this.context = Messages.getSchema().namedContext('Message_Page');
});

Template.Message_Page.helpers({
  recentMessages() {
    const selectEvent = Template.instance().messageFlags.get(selectedEventKey);
    const filteredEvent = Messages.filter({ events: selectEvent }, { sort: { sendDate: 1 } });
    return filteredEvent;
  },

  urEvents() {
    const eventList = _.map(Events.findAll(), function (oneEvent) {
      const username = FlowRouter.getParam('username');
      let eventObject = {};
      const checkEventSubscription = _.contains(oneEvent.eventAttending, username);
      if (checkEventSubscription) {
        eventObject = {
          label: oneEvent.eventName,
        };
      }
      return eventObject;
    });
    return eventList;
  },
  currentUser() {
    return FlowRouter.getParam('username');
  },
  userHash(usr) {
    const colors = ['red', 'blue', 'green', 'black', 'yellow', 'orange', 'pink'];
    const hash = simpleHash(usr);
    const index = hash % colors.length;
    return colors[index];
  },
});

Template.Message_Page.events({
  'submit .message-body': function (event, instance) {
    event.preventDefault();
    const message = event.target.message.value;
    const events = Template.instance().messageFlags.get(selectedEventKey);
    const sendDate = new Date();
    const username = FlowRouter.getParam('username');
    const updatedMessageData = { username, events, message, sendDate };

    // console.log(message, events, sendDate, username, updatedMessageData);

    instance.context.reset();
    const cleanData = Messages.getSchema().clean(updatedMessageData);
    instance.context.validate(cleanData);

    if (instance.context.isValid()) {
      Messages.insert({
        username: username,
        events: events,
        sendDate: sendDate,
        message: message,
      });
      event.target.reset();
    }
  },
  'change select[name="events"]': function (event) {
    event.preventDefault();
    Template.instance().messageFlags.set(selectedEventKey, event.target.value);
  },
});
