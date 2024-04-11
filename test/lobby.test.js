const Lobby = require('../models/lobby');
const db = require('../database.js');

jest.mock('../database.js'); // Mocking the database module

describe('Lobby model', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll method', () => {
    it('should return all lobbies', async () => {
      const mockRows = [{ id: 1, name: 'Lobby 1' }, { id: 2, name: 'Lobby 2' }];
      const mockResult = { rows: mockRows };
      db.query.mockResolvedValueOnce(mockResult);

      const lobbies = await Lobby.getAll();

      expect(db.query).toHaveBeenCalledTimes(1);
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM lobby');
      expect(lobbies).toEqual(mockRows);
    });

    it('should throw an error if database query fails', async () => {
      const errorMessage = 'Database error';
      db.query.mockRejectedValueOnce(new Error(errorMessage));

      await expect(Lobby.getAll()).rejects.toThrow(errorMessage);
    });
  });

  describe('getByStatus method', () => {
    it('should return lobbies by status', async () => {
      const status = 'open';
      const mockRows = [{ id: 1, name: 'Lobby 1', status: 'open' }, { id: 2, name: 'Lobby 2', status: 'open' }];
      const mockResult = { rows: mockRows };
      db.query.mockResolvedValueOnce(mockResult);

      const lobbies = await Lobby.getByStatus(status);

      expect(db.query).toHaveBeenCalledTimes(1);
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM lobby WHERE status = $1', [status]);
      expect(lobbies).toEqual(mockRows);
    });

    it('should throw an error if database query fails', async () => {
      const status = 'open';
      const errorMessage = 'Database error';
      db.query.mockRejectedValueOnce(new Error(errorMessage));

      await expect(Lobby.getByStatus(status)).rejects.toThrow(errorMessage);
    });
  });

  describe('create method', () => {
    it('should create a lobby', async () => {
      const mockLobby = {
        name: 'Test Lobby',
        password: 'testPassword',
        isPrivate: true,
        maxPlayers: 4,
        status: 'open'
      };
      const mockLobbyInstance = new Lobby(mockLobby);
      const mockResult = { rows: [] };
      db.query.mockResolvedValueOnce(mockResult);

      const result = await Lobby.create(mockLobbyInstance);

      expect(db.query).toHaveBeenCalledTimes(1);
      expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO lobby (id, name, password, isPrivate, maxPlayers, status) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5)',
        [mockLobby.name, mockLobby.password, mockLobby.isPrivate, mockLobby.maxPlayers, mockLobby.status]
      );
      expect(result).toEqual(mockResult.rows);
    });

    it('should throw an error if database query fails', async () => {
      const mockLobby = {
        name: 'Test Lobby',
        password: 'testPassword',
        isPrivate: true,
        maxPlayers: 4,
        status: 'open'
      };
      const errorMessage = 'Database error';
      db.query.mockRejectedValueOnce(new Error(errorMessage));

      await expect(Lobby.create(mockLobby)).rejects.toThrow(errorMessage);
    });
  });
});
