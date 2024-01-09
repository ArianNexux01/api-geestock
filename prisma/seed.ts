/* import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient()
async function main() {
   const alice = await prisma.pieces.upsert({
     create: {
           name: faker.commerce.product(),
           brand_name: faker.company.name(),
           description: faker.lorem.lines(),
           price: faker.number.float(),
           quantity: faker.number.int(),
           state: "PENDING",
           min: faker.number.int(),
           target: faker.number.int(),
           category: {
               create: {
                   code: faker.string.alpha(),
                   name: faker.person.fullName(),
                   SubCategories: {
                       create: {
                           code: faker.string.alpha(),
                           name: faker.person.fullName()
                       }
                   }
               }
           }        },
   })

}
main()
   .then(async () => {
       await prisma.$disconnect()
   })
   .catch(async (e) => {
       console.error(e)
       await prisma.$disconnect()
       process.exit(1)
   })*/