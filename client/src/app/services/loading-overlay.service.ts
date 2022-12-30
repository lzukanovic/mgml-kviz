import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadingOverlayService {
  public loading$ = new BehaviorSubject<boolean>(false);

  constructor() { }
}
