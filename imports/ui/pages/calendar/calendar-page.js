import { Tracker } from 'meteor/tracker';
import { moment } from 'meteor/momentjs:moment';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { _ } from 'meteor/underscore';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
// import { $ } from 'meteor/jquery';
import { Events } from '/imports/api/event/EventCollection';

function urEvents(usr, evt) {
  const eventList = _.map(evt, function (oneEvent) {
    let eventObject = {};
    const checkEventSubscription = _.contains(oneEvent.eventAttending, usr);
    if (checkEventSubscription) {
      eventObject = {
        title: oneEvent.eventName,
        start: oneEvent.eventStart,
        end: oneEvent.eventEnd,
      };
    }
    return eventObject;
  });
  return eventList;
}

Template.Calendar_Page.onCreated(function onCreated() {
  this.subscribe(Events.getPublicationName());
});

Template.Calendar.onRendered(function onRendered() {
  const username = FlowRouter.getParam('username');
  const allEvents = Events.findAll();
  const eventArray = urEvents(username, allEvents);
  const cleanArray = eventArray.filter(value => Object.keys(value).length !== 0);

  this.$('#event-calendar').fullCalendar({
    header: {
      right: 'today prev,next',
      center: 'title',
      left: '',
    },
    events: cleanArray,
  });
});
Template.Calendar_Page.helpers({});
Template.Calendar_Page.events({});
