export interface Message {
  t: 'u' | 'b';
  x: string;
}

export interface Chat {
  id: string;
  title: string;
  msgs: Message[];
  userName: string;
  favorite?: boolean;
}
