import SimpleSchema from 'simpl-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { check } from 'meteor/check';
import { Tracker } from 'meteor/tracker';
// import { Meteor } from 'meteor/meteor';
// import { _ } from 'meteor/underscore';
// import { Tags } from '/imports/api/tag/TagCollection';

class LogCollection extends BaseCollection {
  constructor() {
    super('Log', new SimpleSchema({
      employeeId: { type: String },
      barcode: { type: String },
      start: { type: String, optional: true },
      end: { type: String, optional: true },
      comment: { type: String, optional: true },
    }, { tracker: Tracker }));
  }
  define({ employeeId = '', barcode = '', start = '', end = '', comment = '' }) {
    const checkPattern = { employeeId: String, barcode: String, start: String, end: String, comment: String };
    check({ employeeId, barcode, start, end, comment }, checkPattern);


    return this._collection.insert({
      employeeId,
      barcode,
      start,
      end,
      comment,
    });
  }

  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const employeeId = doc.employeeId;
    const barcode = doc.barcode;
    const start = doc.start;
    const end = doc.end;
    const comment = doc.comment;

    return { employeeId, barcode, start, end, comment };
  }
}

export const Logz = new LogCollection();
