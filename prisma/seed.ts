import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async (prisma) => {
    // Seed Roles
    const adminRole = await prisma.roles.create({
      data: {
        id: '1',
        name: 'Administrador',
      },
    });

    const managerRole = await prisma.roles.create({
      data: {
        id: '2',
        name: 'Gestor',
      },
    });

    const chief = await prisma.roles.create({
      data: {
        id: '3',
        name: 'Chefe de Armazém',
      },
    });

    // Seed Users
    const user0 = await prisma.users.upsert({
      where: { email: 'admin@geestock.com' },
      update: {},
      create: {
        name: 'Admin User',
        email: 'administrador@geestock.com',
        company: 'MyCompany',
        position: adminRole.id,
        password:
          '$2a$12$fKeCiohodx5aFCYWViFnMemD7XK6HBP1mmYLSYBYyjY.3d9OD7Kki',
      },
    });

    const user2 = await prisma.users.upsert({
      where: { email: 'gestor@geestock.com' },
      update: {},
      create: {
        name: 'Manager User',
        email: 'gestor@geestock.com',
        company: 'MyCompany',
        position: managerRole.id,
        password:
          '$2a$12$fKeCiohodx5aFCYWViFnMemD7XK6HBP1mmYLSYBYyjY.3d9OD7Kki',
      },
    });

    const user1 = await prisma.users.upsert({
      where: { email: 'chief@gmail.com' },
      update: {},
      create: {
        name: 'Chefe User',
        email: 'chief@gmail.com',
        company: 'MyCompany',
        position: chief.id,
        password:
          '$2a$12$fKeCiohodx5aFCYWViFnMemD7XK6HBP1mmYLSYBYyjY.3d9OD7Kki', //123456
      },
    });

    // Seed Warehouses
    const warehouse1 = await prisma.warehouse.create({
      data: {
        name: 'Main Warehouse',
        code: 'WH001',
        type: 'Armazém',
        address: '123 Warehouse St',
        capacity: 1000,
      },
    });

    const warehouse2 = await prisma.warehouse.create({
      data: {
        name: 'Backup Warehouse',
        code: 'WH002',
        type: 'Armazém',
        address: '456 Warehouse Ave',
        capacity: 500,
      },
    });

    const userWarehouse = await prisma.usersWarehouse.create({
      data: {
        warehouseId: warehouse1.id,
        usersId: user1.id,
      },
    });

    const userWarehouse1 = await prisma.usersWarehouse.create({
      data: {
        warehouseId: warehouse2.id,
        usersId: user2.id,
      },
    });
    const category1 = await prisma.categories.create({
      data: {
        name: 'Electronics',
        code: 'CAT001',
      },
    });

    const category2 = await prisma.categories.create({
      data: {
        name: 'Furniture',
        code: 'CAT002',
      },
    });

    // Seed SubCategories
    const subCategory1 = await prisma.subCategories.create({
      data: {
        name: 'Laptops',
        code: 'SUBCAT001',
        categoryId: category1.id,
      },
    });

    const subCategory2 = await prisma.subCategories.create({
      data: {
        name: 'Chairs',
        code: 'SUBCAT002',
        categoryId: category2.id,
      },
    });

    // Seed Suppliers
    const supplier1 = await prisma.suppliers.create({
      data: {
        name: 'TechSupplier',
        code: 'SUP001',
      },
    });

    const supplier2 = await prisma.suppliers.create({
      data: {
        name: 'HomeSupplier',
        code: 'SUP002',
      },
    });
  });
}

main()
  .then(() => {
    console.log('Seeding finished.');
  })
  .catch((e) => {
    console.error(e);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

/******ADMINISTRADOR - FAZ TUDO */
/***** GESTOR - TODAS AS PERMISSÕES DO ADMINISTRADOR EXCEPTO, CRUD DE USUÁRIOS */
/***** Funcionário o nome passa para chefe de armazem e todas as permissões actuais do gestor, Não cadastram nada so vem */
