import {Request, Response, Router} from 'express';
import {SeedDatabaseService} from '../services/seedDatabase';
const router: Router = Router();
router.post('/createAll', async (req: Request, res: Response) => {
  await SeedDatabaseService.createHomeEnergyProjects();
  res.sendStatus(204);
});

export const HomeEnergyProjectController: Router = router;
