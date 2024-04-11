const User = require('../models/user');
const db = require('../database');


jest.mock('../database', () => ({
  query: jest.fn(),
}));


describe('User', () => {
  describe('getByEmail', () => {
    it('should fetch user by email', async () => {
      const expectedUser = [{ userId: '1', email: 'test@example.com', password: 'password' }];
      db.query.mockResolvedValueOnce({ rows: expectedUser });

      const result = await User.getByEmail('test@example.com');
      
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM users WHERE email = $1', ['test@example.com']);
      expect(result).toEqual(expectedUser);
    });

    it('should throw error if database query fails', async () => {
      db.query.mockRejectedValueOnce(new Error('Database error'));

      await expect(User.getByEmail('test@example.com')).rejects.toThrow('Database error');
    });
  });

  describe('getById', () => {
    it('should fetch user by id', async () => {
      const expectedUser = [{ userId: '1', email: 'test@example.com', password: 'password' }];
      db.query.mockResolvedValueOnce({ rows: expectedUser });

      const result = await User.getById('1');
      
      expect(db.query).toHaveBeenCalledWith('SELECT userid, email FROM users WHERE userid = $1', ['1']);
      expect(result).toEqual(expectedUser);
    });

    it('should throw error if database query fails', async () => {
      db.query.mockRejectedValueOnce(new Error('Database error'));

      await expect(User.getById('1')).rejects.toThrow('Database error');
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const newUser = { email: 'test@example.com', password: 'password' };
      const expectedResult = [{ userId: '1', email: 'test@example.com' }];
      db.query.mockResolvedValueOnce({ rows: expectedResult });

      const result = await User.register(newUser);
      
      expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO users (userid, email, password) VALUES (uuid_generate_v4(), $1, $2)',
        ['test@example.com', 'password']
      );
      expect(result).toEqual(expectedResult);
    });

    it('should throw error if database query fails', async () => {
      const newUser = { email: 'test@example.com', password: 'password' };
      db.query.mockRejectedValueOnce(new Error('Database error'));

      await expect(User.register(newUser)).rejects.toThrow('Database error');
    });
  });
  describe('User Constructor', () => {
    it('should set userId, email, and password from data object', () => {
      const data = { userId: '1', email: 'test@example.com', password: 'password' };
      const user = new User(data);
  
      expect(user.userId).toBe('1');
      expect(user.email).toBe('test@example.com');
      expect(user.password).toBe('password');
    });
  });
});
