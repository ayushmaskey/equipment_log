
import { Tags } from '/imports/api/tag/TagCollection';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Messages } from '/imports/api/message/MessageCollection';
import { Events } from '/imports/api/event/EventCollection';
import { Employees } from '/imports/api/kphc-employee/EmployeeCollection';
import { Equipments } from '../../api/kphc-equipment/EquipmentCollection';
import { Logz } from '../../api/kphc-log/LogCollection';
import { Reservations } from '../../api/kphc-reservation/ReservationCollection';

Tags.publish();
Profiles.publish();
Messages.publish();
Events.publish();
Employees.publish();
Equipments.publish();
Logz.publish();
Reservations.publish();
