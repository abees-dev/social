export interface CreateConversationBody {
  members: string[];
}

export interface IConversationCreateResponse {
  conversation_id: string;
}

export interface IConversationResponse {
  _id: string;
  avatar: string;
  description: string;
  last_message: string;
  thumbnail: string;
  name: string;
  status: number;
  is_pinned: number;
  is_notification: number;
  deleted: number;
  type: number;
  createdAt: string;
  updatedAt: string;
  permission: number;
  setting: ISettingConversation;
}

export interface ISettingConversation {
  conversation_id: string;
  is_blocked: number;
  is_change_avatar: number;
  is_change_name: number;
  is_invited: number;
  is_pin_message: number;
  is_remove_member: number;
  is_send_message: number;
}
