
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
const jwt = require('jsonwebtoken');

import { CreateUserDto } from './dto/create-user.dto';
import { IUserRO } from './user.interface';
import { UserRepository } from './user.repository';
import { User } from './user.entity';



@Injectable()
export class UserService {
  constructor (
    private readonly userRepository: UserRepository
    ) {}

  async create(dto: CreateUserDto) : Promise<IUserRO> {
    const {email, password} = dto;
    const exists = await this.userRepository.findOne({email: email.toLowerCase()})
    if (exists) {
      throw new HttpException({
        message: 'Input data validation failed',
        errors: {general: 'Credentials invalid'},
      }, HttpStatus.BAD_REQUEST);
    }
    
    // create new user
    const user = new User(email.toLowerCase());
    user.password_hash = await user.hash(password);
    const errors = await validate(user);
    if (errors.length > 0) {
      throw new HttpException({
        message: 'Input data validation failed',
        errors: {email:"Userinput is not valid"},
      }, HttpStatus.BAD_REQUEST); 
    } else {
      await this.userRepository.persistAndFlush(user);
      return this.buildUserRO(user)
    }
  }

  async login (dto:CreateUserDto) : Promise<IUserRO> {
    const {email, password} = dto;
    const user = await this.userRepository.findOne({email: email.toLowerCase()}, {populate:['calendars']});
    if (!user || !user.checkPassword(password)) {
      throw new HttpException({
        message: 'Input data validation failed',
        errors: { general: 'Credentials invalid' }
      }, HttpStatus.BAD_REQUEST);
    } else {
      return this.buildUserRO(user)
    }
  }

  async findOne(id) : Promise <User | undefined> {
    return this.userRepository.findOne(id);      
  }
  


  generateJWT(user) {
    const today = new Date();
    const exp = new Date(today);
    const SECRET = process.env.SECRET_KEY;
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
      email: user.email,
      exp: exp.getTime() / 1000,
      id: user.id
    }, SECRET);
  }

  private buildUserRO(user:User) {
    const userRO = {
      email: user.email,
      id: user.id,
      calendars: user.calendars.toArray().map(cal => {return {id: cal.uuid, title: cal.title, start: cal.start, end: cal.end}})
      // token: this.generateJWT(user)
    }

    return {user: userRO}
  }


}
