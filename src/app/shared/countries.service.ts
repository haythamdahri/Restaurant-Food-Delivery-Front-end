import { Injectable } from "@angular/core";
import { HttpClient, HttpBackend } from "@angular/common/http";
import { Country } from "../models/country.model";
import { retry } from "rxjs/operators";
import { environment } from "../../environments/environment";

const API = environment.countriesServiceEndpoints.API;

@Injectable({
  providedIn: "root",
})
export class CountriesService {
  private http: HttpClient;

  constructor(private handler: HttpBackend) {
    this.http = new HttpClient(handler);
  }

  getCountries() {
    return this.http.get<Array<Country>>(API).pipe(retry(5));
  }
}
