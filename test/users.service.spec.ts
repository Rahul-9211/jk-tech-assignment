import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../src/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserRole } from '../src/users/user.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const userDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.ADMIN,
    };

    jest.spyOn(repository, 'save').mockResolvedValue(userDto as User);

    const result = await service.create(userDto);
    expect(result).toEqual(userDto);
  });

  it('should throw conflict exception if user already exists', async () => {
    const userDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.ADMIN,
    };

    jest.spyOn(repository, 'findOne').mockResolvedValue(userDto as User);

    await expect(service.create(userDto)).rejects.toThrow(ConflictException);
  });

  it('should find a user by email', async () => {
    const user = {
      email: 'test@example.com',
      password: 'password',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.ADMIN,
    };

    jest.spyOn(repository, 'findOne').mockResolvedValue(user as User);

    const result = await service.findByEmail('test@example.com');
    expect(result).toEqual(user);
  });

  it('should throw not found exception if user does not exist', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);

    await expect(service.findByEmail('nonexistent@example.com')).rejects.toThrow(NotFoundException);
  });
}); 