import { Collection, Entity, EntityRepositoryType, ManyToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Calendar } from "../calendar/calendar.entity";
const crypto = require('crypto')
import { UserRepository } from "./user.repository";

@Entity({customRepository: ()=> UserRepository})
export class User {

  [EntityRepositoryType]?: UserRepository;

  @PrimaryKey()
  id!: number;

  @Property()
  email!: string;

  @Property()
  password_hash!: string;

  @Property({nullable: true})
  refresh_token?: string;

  @ManyToMany(()=> Calendar, 'users', {owner: true})
  calendars = new Collection<Calendar>(this);

  constructor(email:string) {
    this.email = email;
  }

  async hash(password) : Promise<string>{
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(16).toString("hex");
      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(salt + ":" + derivedKey.toString('hex'))
      });
    })
  }

  async checkPassword(password) : Promise<boolean> {
    return new Promise((resolve, reject) => {
      const [salt, hash] = this.password_hash.split(':');
      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve( hash === derivedKey)
      });
    })
  }

}
