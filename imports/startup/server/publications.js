import { Tags } from '/imports/api/tag/TagCollection';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Messages } from '/imports/api/message/MessageCollection';
import { Events } from '/imports/api/event/EventCollection';

Tags.publish();
Profiles.publish();
Messages.publish();
Events.publish();
