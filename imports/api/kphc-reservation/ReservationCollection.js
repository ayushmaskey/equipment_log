import SimpleSchema from 'simpl-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { check } from 'meteor/check';
import { Tracker } from 'meteor/tracker';
// import { Meteor } from 'meteor/meteor';
// import { _ } from 'meteor/underscore';
// import { Tags } from '/imports/api/tag/TagCollection';

/** @module Event */

/**
 * Represents a specific event, such as "Diamond Head Hike".
 * @extends module:Base~BaseCollection
 */
class ReservationCollection extends BaseCollection {

  /**
   * Creates the Event collection.
   */
  constructor() {
    super('Reservation', new SimpleSchema({
      employeeId: { type: String },
      needs: { type: String, optional: false,
      },
    }, { tracker: Tracker }));
  }

  define({ employeeId = '', needs = '' }) {
    const checkPattern = { employeeId: String, needs: String };
    check({ employeeId, needs }, checkPattern);
    return this._collection.insert({
      employeeId,
      needs,
    });
  }

  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const employeeId = doc.employeeId;
    const needs = doc.needs;

    return { employeeId, needs };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Reservations = new ReservationCollection();
