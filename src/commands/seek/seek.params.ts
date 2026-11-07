import { Param, ParamType } from '@discord-nestjs/core';

export class SeekCommandParams {
  @Param({
    required: true,
    description:
      'How far to move, e.g. 5s, 30s, 2m or 1m30s (a bare number is seconds)',
    type: ParamType.STRING,
  })
  time!: string;
}
