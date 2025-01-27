import { remember } from '@mado/remember';
import { PrismaClient } from '@prisma/client';
import chalk from 'chalk';

export const prisma = remember('prisma', () => {
  const logThreshold = 20;

  const client = new PrismaClient({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'stdout', level: 'warn' },
      { emit: 'stdout', level: 'error' },
    ],
  });

  client.$on('query', (e) => {
    if (e.duration < logThreshold) {
      return;
    }

    const color =
      e.duration < logThreshold * 1.1
        ? 'green'
        : e.duration < logThreshold * 1.2
          ? 'blue'
          : e.duration < logThreshold * 1.3
            ? 'yellow'
            : e.duration < logThreshold * 1.4
              ? 'redBright'
              : 'red';

    console.info(
      `prisma:query - ${chalk[color](`${e.duration}ms`)} - ${e.query}`,
    );
  });

  client.$connect();

  return client;
});
