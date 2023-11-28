import { Router } from "express";

const router = Router();

router.get('/', (req, res) => {
  req.logger.debug('Este es un log de nivel DEBUG');
  req.logger.http('Este es un log de nivel HTTP');
  req.logger.info('Este es un log de nivel INFO');
  req.logger.warning('Este es un log de nivel WARNING');
  req.logger.error('Este es un log de nivel ERROR');
  req.logger.fatal('Este es un log de nivel FATAL');

  res.send('Logs generados exitosamente');
});

export default router;
