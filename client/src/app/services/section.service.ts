import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SectionService {

  constructor(private http: HttpClient) { }

  getSections(): Observable<any> {
    return this.http.get('/api/section');
  }

  getSection(sectionId: number): Observable<any> {
    return this.http.get(`/api/section/${sectionId}`);
  }

  createSection(section: any): Observable<any> {
    return this.http.post('/api/section', {section});
  }

  updateSection(section: any): Observable<any> {
    return this.http.put('/api/section', {section});
  }

  deleteSection(sectionId: number): Observable<any> {
    return this.http.delete(`/api/section/${sectionId}`);
  }
}
