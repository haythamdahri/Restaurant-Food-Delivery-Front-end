import { ContactMessage } from "./../models/contact-message.model";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private API = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  sendContactMessage(contactMessage: ContactMessage) {
    console.log(contactMessage);
    return this.http.post<ContactMessage>(`${this.API}/messages`, contactMessage);
  }

}
