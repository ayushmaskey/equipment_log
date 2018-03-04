import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
// import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

Template.Profile_Page.onCreated(function onCreated() {
  this.subscribe(Profiles.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  this.context = Profiles.getSchema().namedContext('Profile_Page');
});

Template.Profile_Page.helpers({
  successClass() {
    return Template.instance().messageFlags.get(displaySuccessMessage) ? 'success' : '';
  },
  displaySuccessMessage() {
    return Template.instance().messageFlags.get(displaySuccessMessage);
  },
  errorClass() {
    return Template.instance().messageFlags.get(displayErrorMessages) ? 'error' : '';
  },
  profile() {
    return Profiles.findDoc(FlowRouter.getParam('username'));
  },
  getUsername() {
    return FlowRouter.getParam('username');
  },
});

Template.Profile_Page.events({
  'submit .profile-data-form'(event, instance) {
    event.preventDefault();
    const firstName = event.target.First.value;
    const lastName = event.target.Last.value;
    const username = FlowRouter.getParam('username'); // schema requires username.
    const email = `${username}@hawaii.edu`;
    const text = event.target.Text.value;
    const slack = event.target.Slack.value;
    const facebook = event.target.Facebook.value;
    const twitter = event.target.Twitter.value;
    const picture = event.target.Picture.value;
    const additional = event.target.Additional.value;

    const updatedProfileData = {
      firstName,
      lastName,
      username,
      email,
      text,
      slack,
      facebook,
      twitter,
      picture,
      additional,
    };

    // Clear out any old validation errors.
    instance.context.reset();
    // Invoke clean so that updatedProfileData reflects what will be inserted.
    const cleanData = Profiles.getSchema().clean(updatedProfileData);
    // Determine validity.
    instance.context.validate(cleanData);

    if (instance.context.isValid()) {
      const docID = Profiles.findDoc(FlowRouter.getParam('username'))._id;
      const id = Profiles.update(docID, { $set: cleanData });
      instance.messageFlags.set(displaySuccessMessage, id);
      instance.messageFlags.set(displayErrorMessages, false);
    } else {
      instance.messageFlags.set(displaySuccessMessage, false);
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
});

