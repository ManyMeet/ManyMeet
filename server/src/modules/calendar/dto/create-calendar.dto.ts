import { IsNotEmpty } from 'class-validator';

export class CreateCalendarDto {
  @IsNotEmpty()
  readonly id: string;

  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly start: string;

  @IsNotEmpty()
  readonly end: string;
}
