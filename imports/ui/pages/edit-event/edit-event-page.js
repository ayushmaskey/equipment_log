import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Events } from '/imports/api/event/EventCollection';
import { Tags } from '/imports/api/tag/TagCollection';
import { Profiles } from '/imports/api/profile/ProfileCollection';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';
const context = Events.getSchema().namedContext('Create_Event_Page');

export const meetupList = ['At Location', 'At UH', 'Other'];
export const maxPeopleList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', ' 19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'];

Template.Edit_Event_Page.onCreated(function onCreated() {
  this.subscribe(Tags.getPublicationName());
  this.subscribe(Events.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  this.context = context;
});

Template.Edit_Event_Page.helpers({
  eventDataField(fieldName) {
    const eventData = Events.findOne(FlowRouter.getParam('_id'));
    // See https://dweldon.silvrback.com/guards to understand '&&' in next line.
    return eventData && eventData[fieldName];
  },
  successClass() {
    return Template.instance().messageFlags.get(displaySuccessMessage) ? 'success' : '';
  },
  displaySuccessMessage() {
    return Template.instance().messageFlags.get(displaySuccessMessage);
  },
  errorClass() {
    return Template.instance().messageFlags.get(displayErrorMessages) ? 'error' : '';
  },
  event() {
    return Events.findDoc(FlowRouter.getParam('_id'));
  },
  maxPeoples() {
    return _.map(maxPeopleList, function makemeetupObject(maxPeople) { return { label: maxPeople }; });
  },
  eventTag() {
    return _.map(Tags.findAll(),
        function makeTagObject(tag) {
          return { label: tag.name };
        });
  },
  getUsername() {
    return FlowRouter.getParam('_id');
  },
});

Template.Edit_Event_Page.events({
/* eslint max-len:0 */
  'submit . event-data-form'(event, instance) {
    event.preventDefault();
    const name = event.target.eventName.value;
    const max = event.target.maxPeople.value;
    const location = event.target.eventLocation.value;
    const username = FlowRouter.getParam('username'); // schema requires username.
    const additional = event.target.eventAdditional.value;
    const start = event.target.eventStart.value;
    const end = event.target.eventEnd.value;
    const selectedTags = _.filter(event.target.Tags.selectedOptions, (option) => option.selected);
    const tags = _.map(selectedTags, (option) => option.value);

    const updatedEventData = { name, max, location, additional, start, end, tags, username };

    // Clear out any old validation errors.
    instance.context.reset();
    // Invoke clean so that updated EventData reflects what will be inserted.
    const cleanData = Events.getSchema().clean(updatedEventData);
    // Determine validity.
    instance.context.validate(cleanData);

    if (instance.context.isValid()) {
      const docID = FlowRouter.getParam('_id');
      const userName = FlowRouter.getParam('username');
      const id = Events.update(docID, { $set: cleanData });
      instance.messageFlags.set(displaySuccessMessage, id);
      instance.messageFlags.set(displayErrorMessages, false);
      FlowRouter.go('Event_Page', { username: userName, _id: id });
    } else {
      instance.messageFlags.set(displaySuccessMessage, false);
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
});

