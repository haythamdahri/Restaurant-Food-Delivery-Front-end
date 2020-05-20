import { ContactMessage } from "./../models/contact-message.model";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ContactService {
  private static API = environment.contactServiceEndpoint.API;

  constructor(private http: HttpClient) {}

  sendContactMessage(contactMessage: ContactMessage) {
    return this.http.post<ContactMessage>(
      `${ContactService.API}/contactmessages`,
      contactMessage
    );
  }
}
