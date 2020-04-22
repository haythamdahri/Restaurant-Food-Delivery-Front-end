import { ContactMessage } from "./../models/contact-message.model";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private static API = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  sendContactMessage(contactMessage: ContactMessage) {
    return this.http.post<ContactMessage>(`${ContactService.API}/contactmessages`, contactMessage);
  }

}
