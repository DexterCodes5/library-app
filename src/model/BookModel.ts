export class BookModel {
  id?: number;
  title: string;
  author: string;  
  description: string;  
  copies: number;
  copiesAvailable?: number;
  category: string;
  img: string;

  constructor(title: string, author: string, description: string,
    copies: number, category: string, img: string)
  constructor(title: string, author: string, description: string,
    copies: number, category: string, img: string, id?: number, copiesAvailable?: number) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.description = description;
    this.copies = copies;
    this.copiesAvailable = copiesAvailable;
    this.category = category;
    this.img = img;
  }

}