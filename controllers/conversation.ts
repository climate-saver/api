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
  await Promise.all([
    ConversationService.addUserMessage(req.params.conversationId, req.body.message),
    UserService.maybeAddUserInfoFromMessage(
      req.params.conversationId,
      req.body.message,
      req.body.homeInfoKey
    ),
  ]);
  res.sendStatus(204);
});

router.get('/:conversationId/nextMessage', async (req: Request, res: Response) => {
  const nextMessage = await ConversationService.getNextMessage(req.params.conversationId);
  if (!nextMessage) {
    res.status(200).json({});
    return;
  }
  await ConversationService.addNextMessage(req.params.conversationId, nextMessage);
  res.status(200).json(nextMessage);
});

export const ConversationController: Router = router;
