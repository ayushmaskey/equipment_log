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
class EquipmentCollection extends BaseCollection {
  constructor() {
    super('Equipment', new SimpleSchema({
      type: { type: String },
      barcode: { type: String },
      name: { type: String, optional: true },
      os: { type: String, optional: true },
      serial: { type: String, optional: true },
      additional: { type: String, optional: true },
      phone: {
        type: String,
        optional: true,
        max: 12,
        regEx: /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/,
      },
    }, { tracker: Tracker }));
  }
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const type = doc.type;
    const barcode = doc.barcode;
    const name = doc.name;
    const os = doc.oss;
    const serial = doc.serial;
    const additional = doc.additional;
    const phone = doc.phone;
    return { type, barcode, name, os, serial, phone, additional };
  }
  define({
           type = '', name = '', os = '', barcode = '', serial = '', phone = '',
           additional = '',
         }) {
    // make sure required fields are OK.
    const checkPattern = { type: String, name: String, barcode: String,
      additional: String, serial: String, os: String };
    check({ type, name, os, additional, barcode, serial }, checkPattern);

    if (this.find({ barcode }).count() > 0) {
      throw new Meteor.Error(`${barcode} is previously defined in another Profile`);
    }

    if (this.find({ serial }).count() > 0) {
      throw new Meteor.Error(`${serial} is previously defined in another Profile`);
    }

    return this._collection.insert({
      type, name, os, barcode, serial, phone, additional });
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Equipments = new EquipmentCollection();
