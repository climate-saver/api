import {Request, Response, Router} from 'express';
import {SeedDatabaseService} from '../services/seedDatabase';
import {User} from '../models';
import {HomeEnergyProjectService} from '../services/homeEnergyProject';
const router: Router = Router();
router.post('/createAll', async (req: Request, res: Response) => {
  await SeedDatabaseService.createHomeEnergyProjects();
  res.sendStatus(204);
});

router.get('/recommendations', async (req: Request, res: Response) => {
  if (!req.query.conversationId) {
    res.status(400).send('Missing conversationId');
  }
  res
    .status(200)
    .json(
      await HomeEnergyProjectService.getRecommendations(
        (await User.findByConversationId(req.query.conversationId)).homeInfo
      )
    );
});

export const HomeEnergyProjectController: Router = router;
