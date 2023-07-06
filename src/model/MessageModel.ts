export class MessageModel {
  id?: number;
  userEmail: string;
  title: string;
  question: string;
  adminEmail?: string;
  response?: string;
  closed?: boolean;

  constructor(userEmail: string, title: string, question: string) {
    this.userEmail = userEmail;
    this.title = title;
    this.question = question;
  }
}