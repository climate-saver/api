import {Request, Response, Router} from 'express';
import {SeedDatabaseService} from '../services/seedDatabase';
const router: Router = Router();
router.post('/createAll', async (req: Request, res: Response) => {
  await SeedDatabaseService.createRebates();
  res.sendStatus(204);
});

export const RebateController: Router = router;
