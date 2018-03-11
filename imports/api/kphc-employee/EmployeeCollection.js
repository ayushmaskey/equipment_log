import SimpleSchema from 'simpl-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
// import { _ } from 'meteor/underscore';
// import { Roles } from 'meteor/alanning:roles';
/** @module Profile */

/**
 * Profiles provide portfolio data for a user.
 * @extends module:Base~BaseCollection
 */
class EmployeeCollection extends BaseCollection {

  /**
   * Creates the Profile collection.
   */
  constructor() {
    super('Employee', new SimpleSchema({
      username: { type: String },
      firstName: { type: String, optional: true },
      lastName: { type: String, optional: true },
      email: { type: SimpleSchema.RegEx.Email, optional: true },
      employeeId: { type: String, optional: true },
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
    const employeeId = doc.employeeId;
    const additional = doc.additional;
    return { firstName, lastName, username, email, employeeId, additional };
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
           firstName = '', lastName = '', username = '', email = '', employeeId = '', additional = '' }) {
    // make sure required fields are OK.
    const checkPattern = { firstName: String, lastName: String, username: String,
      additional: String, employeeId: String };
    check({ firstName, lastName, username, additional, employeeId }, checkPattern);

    if (this.find({ username }).count() > 0) {
      throw new Meteor.Error(`${username} is previously defined in another Employee`);
    }

    if (this.find({ email }).count() > 0) {
      throw new Meteor.Error(`${email} is previously defined in another Employee`);
    }

    if (this.find({ employeeId }).count() > 0) {
      throw new Meteor.Error(`${employeeId} is previously defined in another Employee`);
    }

    return this._collection.insert({
      firstName, lastName, username, email, employeeId, additional });
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Employees = new EmployeeCollection();
