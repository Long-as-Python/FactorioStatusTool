import { fetchFactorioStatus } from './rconClient';
import { Rcon } from 'rcon-client';

jest.mock('rcon-client');

describe('fetchFactorioStatus', () => {
  it('returns version, uptime, and players', async () => {
    process.env.RCON_HOST = 'example';
    process.env.RCON_PASSWORD = 'secret';
    const sendMock = jest.fn()
      .mockResolvedValueOnce('Factorio 1.1.72')
      .mockResolvedValueOnce('Map age: 5 hours')
      .mockResolvedValueOnce('Online players (2): Alice, Bob');
    const endMock = jest.fn();
    (Rcon.connect as unknown as jest.Mock).mockResolvedValue({
      send: sendMock,
      end: endMock,
    });

    const result = await fetchFactorioStatus();

    expect(result).toEqual({
      version: 'Factorio 1.1.72',
      uptime: 'Map age: 5 hours',
      players: ['Alice', 'Bob'],
    });
    expect(endMock).toHaveBeenCalled();
  });
});
