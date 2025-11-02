Go to https://pris.ly/ppg-init for detailed instructions.

1. Define your database schema
Open the schema.prisma file and define your first models. Check the docs if you need inspiration: https://pris.ly/ppg-init.

2. Apply migrations
Run the following command to create and apply a migration:
npx prisma migrate dev --name init

3. Manage your data
View and edit your data locally by running this command:
npx prisma studio

...or online in Console:
https://console.prisma.io/cmhhepgig05dyyxfl68pd43lk/cmhhepyiy05e3yxfld2uulg1b/cmhhepyiy05e4yxflgb1f9cx7/studio

4. Send queries from your app
To access your database from a JavaScript/TypeScript app, you need to use Prisma ORM. Go here for step-by-step instructions: https://pris.ly/ppg-init
  

jangan lupa tambahkan : import "dotenv/config"; di prisma.config.ts