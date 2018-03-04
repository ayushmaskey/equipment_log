import { Tags } from '/imports/api/tag/TagCollection';
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('TagCollection', function testSuite() {
    const name = 'Software Engineering';
    const description = 'Tools and techniques for team-based development of high quality software systems';
    const defineObject = { name, description };

    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      let docID = Tags.define(defineObject);
      expect(Tags.isDefined(docID)).to.be.true;
      // Check that fields are available
      const doc = Tags.findDoc(docID);
      expect(doc.name).to.equal(name);
      expect(doc.description).to.equal(description);
      // Check that multiple definitions with the same name fail
      expect(function foo() { Tags.define(defineObject); }).to.throw(Error);
      // Check that we can dump and restore a Tag.
      const dumpObject = Tags.dumpOne(docID);
      Tags.removeIt(docID);
      expect(Tags.isDefined(docID)).to.be.false;
      docID = Tags.restoreOne(dumpObject);
      expect(Tags.isDefined(docID)).to.be.true;
      Tags.removeIt(docID);
    });

    it('#findID, #findIDs', function test() {
      const docID = Tags.define(defineObject);
      expect(Tags.isDefined(docID)).to.be.true;
      const docID2 = Tags.findID(name);
      expect(docID).to.equal(docID2);
      Tags.findIDs([name, name]);
      Tags.removeIt(docID);
    });
  });
}

