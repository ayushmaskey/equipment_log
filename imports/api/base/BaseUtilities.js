import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Tags } from '/imports/api/tag/TagCollection';
import { Events } from '/imports/api/event/EventCollection';
import { Messages } from '/imports/api/message/MessageCollection';

export function removeAllEntities() {
  Profiles.removeAll();
  Events.removeAll();
  Tags.removeAll();
  Messages.removeAll();
}
