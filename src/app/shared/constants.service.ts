import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ConstantsService {

  public static FILES_ENDOINT = 'http://localhost:8080/api/v1/restaurantfiles/file';

  constructor() {}
}
