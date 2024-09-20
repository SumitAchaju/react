import { messageType, userType } from "../types/fetchTypes";

export const defaultUser: userType = {
  id: 0,
  uid: "string",
  first_name: "string",
  last_name: "string",
  email: "string",
  address: "string",
  profile: "/src/assets/png/profile.png",
  contact_number_country_code: 977,
  contact_number: 6556468,
  username: "string",
  password: "string",
  superuser_pass: "d",
};

export let messageData: messageType[] = [
  {
    sender_id: 1,
    reciever_id: 2,
    status: "seen",
    message: [
      {
        msg_text: "hello",
        created_at: "2027",
      },
      {
        msg_text: "hello",
        created_at: "2027",
      },
    ],
  },
];
