import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../src/users/users.controller';
import { UsersService } from '../src/users/users.service';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { User, UserRole } from '../src/users/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            updateRole: jest.fn(),
            updatePermissions: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const userDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.ADMIN,
    };

    const user: User = {
      id: '1',
      ...userDto,
      permissions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(service, 'create').mockResolvedValue(user);

    const result = await controller.create(userDto);
    expect(result).toEqual(user);
  });

  it('should return all users', async () => {
    const users: User[] = [
      {
        id: '1',
        email: 'test@example.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.ADMIN,
        permissions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    jest.spyOn(service, 'findAll').mockResolvedValue(users);

    const result = await controller.getUsers();
    expect(result).toEqual(users);
  });
}); 