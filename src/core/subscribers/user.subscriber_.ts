// import {
//     EntitySubscriberInterface,
//     EventSubscriber,
//     InsertEvent
// } from 'typeorm'
// import { User } from '../entities'

// @EventSubscriber()
// export class UserSubscriber implements EntitySubscriberInterface<User> {
//     listenTo() {
//         return User
//     }

//     beforeInsert(event: InsertEvent<User>) {
//         console.log(`BEFORE POST INSERTED: `, event.entity)
//     }
// }
