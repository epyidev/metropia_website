import { Request, Response, NextFunction, RequestHandler } from 'express';

export const requireMod: RequestHandler = (req, res, next) => {
  const user = (req as any).user;
  if (!user || typeof user.rank !== 'number' || user.rank < 1) {
    res.status(403).json({ message: 'Permission refusée : modérateur requis.' });
    return;
  }
  next();
};
