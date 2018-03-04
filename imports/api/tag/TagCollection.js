import SimpleSchema from 'simpl-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Tracker } from 'meteor/tracker';

/** @module Tag */

/**
 * Represents a specific tag, such as "Software Engineering".
 * @extends module:Base~BaseCollection
 */
class TagCollection extends BaseCollection {

  /**
   * Creates the Tag collection.
   */
  constructor() {
    super('Tag', new SimpleSchema({
      name: { type: String },
    }, { tracker: Tracker }));
  }

  /**
   * Defines a new Tag.
   * @example
   * Tags.define({ name: 'Surfing' });
   * @param { Object } description Object with keys name and description.
   * Name must be previously undefined.
   * Creates a "slug" for this name and stores it in the slug field.
   * @throws {Meteor.Error} If the tag definition includes a defined name.
   * @returns The newly created docID.
   */
  define({ name }) {
    check(name, String);
    if (this.find({ name }).count() > 0) {
      throw new Meteor.Error(`${name} is previously defined in another Tag`);
    }
    return this._collection.insert({ name });
  }

  // /**
  //  * Returns the Tag name corresponding to the passed tag docID.
  //  * @param tagID An tag docID.
  //  * @returns { String } An tag name.
  //  * @throws { Meteor.Error} If the tag docID cannot be found.
  //  */
  // findName(tagID) {
  //   this.assertDefined(tagID);
  //   return this.findDoc(tagID).name;
  // }
  //
  // /**
  //  * Returns a list of Tag names corresponding to the passed list of Tag docIDs.
  //  * @param tagIDs A list of Tag docIDs.
  //  * @returns { Array }
  //  * @throws { Meteor.Error} If any of the instanceIDs cannot be found.
  //  */
  // findNames(tagIDs) {
  //   return tagIDs.map(tagID => this.findName(tagID));
  // }
  //
  // /**
  //  * Throws an error if the passed name is not a defined Tag name.
  //  * @param name The name of an tag.
  //  */
  // assertName(name) {
  //   this.findDoc(name);
  // }
  //
  // /**
  //  * Throws an error if the passed list of names are not all Tag names.
  //  * @param names An array of (hopefully) Tag names.
  //  */
  // assertNames(names) {
  //   _.each(names, name => this.assertName(name));
  // }
  //
  // /**
  //  * Returns the docID associated with the passed Tag name, or throws an error if it cannot be found.
  //  * @param { String } name An tag name.
  //  * @returns { String } The docID associated with the name.
  //  * @throws { Meteor.Error } If name is not associated with an Tag.
  //  */
  // findID(name) {
  //   return (this.findDoc(name)._id);
  // }
  //
  // /**
  //  * Returns the docIDs associated with the array of Tag names, or throws an error if any name cannot be found.
  //  * If nothing is passed, then an empty array is returned.
  //  * @param { String[] } names An array of tag names.
  //  * @returns { String[] } The docIDs associated with the names.
  //  * @throws { Meteor.Error } If any instance is not an Tag name.
  //  */
  // findIDs(names) {
  //   return (names) ? names.map((instance) => this.findID(instance)) : [];
  // }

  /**
   * Returns an object representing the Tag docID in a format acceptable to define().
   * @param docID The docID of an Tag.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const name = doc.name;
    return { name };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Tags = new TagCollection();
