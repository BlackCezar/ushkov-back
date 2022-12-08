import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {UsersModule} from './users/users.module';
import {OrganizationsModule} from './organizations/organizations.module';
import {ContractsModule} from './contracts/contracts.module';
import {DocumentsModule} from './documents/documents.module';
import {MongooseModule} from '@nestjs/mongoose';
import {HelpersModule} from './helpers/helpers.module';
import {SeedsModule} from './seeds/seed';
import {CommandModule} from 'nestjs-command';
import {UserSeed} from './seeds/user.seed';
import {ClientsModule} from "./clients/clients.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
        }),
        MongooseModule.forRoot(process.env.MONGODB_URL),
        UsersModule,
        OrganizationsModule,
        ContractsModule,
        ClientsModule,
        DocumentsModule,
        HelpersModule,
        SeedsModule,
        CommandModule,
    ],
    controllers: [],
    providers: [UserSeed],
})
export class AppModule {
}
