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

export type websocketResponseType = {
  event_type: "new_message" | "change_message_status" | "notification";
  data: messageType[] | notificationType[];
  sender_user: userType;
};

type notificationEnumType =
  | "friend_request"
  | "friend_request_accepted"
  | "friend_request_rejected"
  | "friend_request_canceled"
  | "block_friend"
  | "unblock_friend"
  | "unfriend";

type friendRequestExtraDataType = {
  is_active: boolean;
  is_canceled: boolean;
  is_accepted: boolean;
  is_rejected: boolean;
};

export type notificationType = {
  id: number;
  is_read: boolean;
  created_at: string;
  read_at: string;
  notification_type: notificationEnumType;
  message: string;
  sender_id: number;
  receiver_id: number;
  extra_data: friendRequestExtraDataType;
  linked_notification_id: number;
  sender_user?: userType;
  receiver_user?: userType;
  linked_notification?: notificationType;
};
