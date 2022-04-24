import { SqlHighlighter} from '@mikro-orm/sql-highlighter';
import { MikroOrmModuleOptions as Options } from '@mikro-orm/nestjs';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import {LoadStrategy} from '@mikro-orm/core'

require('dotenv').config()

const config: Options =  {
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  clientUrl: process.env.DATABASE_URL,
  type: 'postgresql',
  highlighter: new SqlHighlighter(),
  debug: false,
  loadStrategy: LoadStrategy.JOINED,
  metadataProvider: TsMorphMetadataProvider,
  migrations: {
    path: 'dist/migrations',
    pathTs:'src/migrations'
  }
}

export default config