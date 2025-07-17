import { IAutoMessage } from "../entities";

export interface IAutoMessagesService {
    handleAutoMessageSend(dto: IAutoMessage);
}
