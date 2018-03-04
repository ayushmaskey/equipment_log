import SimpleSchema from 'simpl-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
// import { _ } from 'meteor/underscore';
import { Tracker } from 'meteor/tracker';
import { Roles } from 'meteor/alanning:roles';
/** @module Profile */

/**
 * Profiles provide portfolio data for a user.
 * @extends module:Base~BaseCollection
 */
class ProfileCollection extends BaseCollection {

  /**
   * Creates the Profile collection.
   */
  constructor() {
    super('Profile', new SimpleSchema({
      username: { type: String },
      firstName: { type: String, optional: true },
      lastName: { type: String, optional: true },
      email: { type: SimpleSchema.RegEx.Email, optional: true },
      text: {
        type: String,
        optional: true,
        max: 12,
        regEx: /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/,
      },
      picture: { type: SimpleSchema.RegEx.Url, optional: true },
      slack: { type: SimpleSchema.RegEx.Url, optional: true },
      facebook: { type: SimpleSchema.RegEx.Url, optional: true },
      twitter: { type: SimpleSchema.RegEx.Url, optional: true },
      additional: { type: String, optional: true },
    }, { tracker: Tracker }));
  }

  /**
   * Returns an object representing the Profile docID in a format acceptable to define().
   * @param docID The docID of a Profile.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const firstName = doc.firstName;
    const lastName = doc.lastName;
    const username = doc.username;
    const email = doc.email;
    const text = doc.text;
    const picture = doc.picture;
    const slack = doc.slack;
    const facebook = doc.facebook;
    const twitter = doc.twitter;
    const additional = doc.additional;
    return { firstName, lastName, username, email, text, slack, facebook, twitter, picture, additional };
  }

  /**
   * Defines a new Profile.
   * @example
   * Profiles.define({ firstName: 'Philip',
   *                   lastName: 'Johnson',
   *                   username: 'johnson',
   *                   bio: 'I have been a professor of computer science at UH since 1990.',
   *                   interests: ['Application Development', 'Software Engineering', 'Databases'],
   *                   title: 'Professor of Information and Computer Sciences',
   *                   picture: 'http://philipmjohnson.org/headshot.jpg',
   *                   github: 'https://github.com/philipmjohnson',
   *                   facebook: 'https://facebook.com/philipmjohnson',
   *                   instagram: 'https://instagram.com/philipmjohnson' });
   * @param { Object } description Object with required key username.
   * Remaining keys are optional.
   * Username must be unique for all users. It should be the UH email account.
   * Interests is an array of defined interest names.
   * @throws { Meteor.Error } If a user with the supplied username already exists, or
   * if one or more interests are not defined, or if github, facebook, and instagram are not URLs.
   * @returns The newly created docID.
   */
  define({
           firstName = '', lastName = '', username, email = '', text = '', picture = '',
           facebook = '', twitter = '', slack = '', additional = '', admin = '',
         }) {
    // make sure required fields are OK.
    const checkPattern = { firstName: String, lastName: String, username: String, additional: String, admin: String };
    check({ firstName, lastName, username, additional, admin }, checkPattern);

    if (this.find({ username }).count() > 0) {
      throw new Meteor.Error(`${username} is previously defined in another Profile`);
    }

    if (this.find({ email }).count() > 0) {
      throw new Meteor.Error(`${email} is previously defined in another Profile`);
    }

    return this._collection.insert({
      firstName, lastName, username, email, text, picture, facebook, twitter, slack, additional,});
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Profiles = new ProfileCollection();
