import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Section} from "../shared/interfaces";

@Injectable({
  providedIn: 'root'
})
export class SectionService {

  constructor(private http: HttpClient) { }

  getSections(sortParams?: string[]): Observable<any> {
    let params;
    if (sortParams && sortParams.length == 2) {
      params = new HttpParams().set('sort', sortParams[0] + ':' + sortParams[1]);
    }
    return this.http.get('/api/section', {params});
  }

  getSection(sectionId: number): Observable<any> {
    return this.http.get(`/api/section/${sectionId}`);
  }

  createSection(section: Section): Observable<any> {
    return this.http.post('/api/section', {section});
  }

  updateSection(section: Section): Observable<any> {
    return this.http.put('/api/section', {section});
  }

  deleteSection(sectionId: number): Observable<any> {
    return this.http.delete(`/api/section/${sectionId}`);
  }
}
