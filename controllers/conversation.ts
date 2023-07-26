import {Router, Request, Response} from 'express';
import {ConversationService} from '../services/conversation';
import {UserService} from '../services/user';
import {ConversationDocument} from '@modelInterfaces';
import {transformReadForClient} from '../transforms/transformUtil';
const router: Router = Router();

router.post('/', async (req: Request, res: Response) => {
  const conversation: ConversationDocument = await ConversationService.createConversation();
  await UserService.createUser(conversation);
  res.status(201).json(transformReadForClient(conversation));
});

router.post('/:conversationId/messages', async (req: Request, res: Response) => {
  console.log(req.body);
  await Promise.all([
    ConversationService.addUserMessage(req.params.conversationId, req.body.message),
    UserService.maybeAddUserInfoFromMessage(
      req.params.conversationId,
      req.body.message,
      req.body.userHomeInfoKey
    ),
  ]);
  res.sendStatus(204);
});

router.get('/:conversationId/nextMessages', async (req: Request, res: Response) => {
  const nextMessages = await ConversationService.getNextMessages(req.params.conversationId);
  await ConversationService.addNextMessages(req.params.conversationId, nextMessages);
  res.status(200).json(nextMessages);
});

export const ConversationController: Router = router;
