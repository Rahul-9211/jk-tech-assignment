import { createConnection } from 'typeorm';
import { User, UserRole } from '../users/user.entity';
import { Document } from '../documents/document.entity';
import { faker } from '@faker-js/faker';

async function generateTestData() {
  const connection = await createConnection();
  const userRepository = connection.getRepository(User);
  const documentRepository = connection.getRepository(Document);

  // Generate users
  for (let i = 0; i < 1000; i++) {
    const user = userRepository.create({
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: faker.helpers.arrayElement(['admin', 'editor', 'viewer']) as UserRole,
    });
    await userRepository.save(user);
  }

  // Generate documents
  for (let i = 0; i < 100000; i++) {
    const document = documentRepository.create({
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      filePath: faker.system.filePath(),
    });
    await documentRepository.save(document);
  }

  await connection.close();
}

generateTestData().catch(console.error); 