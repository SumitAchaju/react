import { notificationType } from "../queryHooks/useNotificationQuery";

export type msgStatusType = "seen" | "delivered" | "sent";
export type msgType = "text" | "video" | "image" | "document" | "links";

export type fetchErrorType = {
  detail: string;
};

export type userType = {
  id: number;
  uid: string;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  profile: string;
  contact_number_country_code: number;
  contact_number: number;
  username: string;
  blocked_user?: userType[];
  blocked_by?: userType[];
  friend?: userType[];
  friend_by?: userType[];
  requested_user?: userType[];
  requested_by?: userType[];
};

export type onlineUserType = {
  user: userType;
  room: roomType;
};

export type roomUserType = {
  user_id: number;
  added_by: number | null;
  joined_at: string;
  isAdmin: boolean;
  id: string;
};

export type roomType = {
  users: roomUserType[];
  created_at: string;
  type: string;
  created_by: null | number;
  is_active: boolean;
  id: string;
};

export type chatHistoryType = {
  users: userType[];
  room: roomType;
  message: messageType;
  quantity: number;
};

export type innerMsgType = {
  msg_text: string;
  created_at: string;
};

export type messageType = {
  id: string;
  sender_id: number;
  message_text: string;
  created_at: string;
  room_id: string;
  message_type: msgType;
  file_links: string[] | null;
  status: msgStatusType;
  seen_by: number[];
};

export type websocketMsgType = {
  msg_type: "new_msg" | "change_msg_status";
  msg: messageType[];
  sender_user: userType | undefined;
};

export type websocketNotificationType = {
  msg_type: "notification";
  msg: notificationType;
  sender_user: userType | undefined;
};
