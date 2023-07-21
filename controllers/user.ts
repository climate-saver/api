import {Router, Request, Response} from 'express';
import {User} from '../models/user';

const router: Router = Router();

router.post('/', async (req: Request, res: Response) => {
  await User.create({name: 'hey'});
  console.log('user created');
});

export const UserController: Router = router;
