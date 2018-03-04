import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Tags } from '/imports/api/tag/TagCollection';
import { Events } from '/imports/api/event/EventCollection';


const selectedTagsKey = 'selectedTags';

Template.Home_Page.onCreated(function onCreated() {
  this.subscribe(Tags.getPublicationName());
  this.subscribe(Events.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(selectedTagsKey, []);
});

Template.Home_Page.helpers({
  routeUserName() {
    return FlowRouter.getParam('username');
  },
  eventTag() {
    return _.map(Tags.findAll(),
        function makeTagObject(tag) {
          return {
            label: tag.name,
            selected: _.contains(Template.instance().messageFlags.get(selectedTagsKey), tag.name),
          };
        });
  },
  events() {
    // Find all events with the currently selected interests.
    const foundEvents = Events.findAll();
    const selectedTags = Template.instance().messageFlags.get(selectedTagsKey);
    return _.filter(foundEvents, event => _.intersection(event.tags, selectedTags).length > 0);
  },
});

Template.Home_Page.events({
  'submit .filter-data-form'(event, instance) {
    event.preventDefault();
    const selectedOptions = _.filter(event.target.Tags.selectedOptions, (option) => option.selected);
    // error in console: Event map has to be an object
    // cards do not show when searched
    instance.messageFlags.set(selectedTagsKey, _.map(selectedOptions, (option) => option.value));
  },
});

