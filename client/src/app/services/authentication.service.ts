import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {TokenPayload, TokenResponse, UserDetails} from "../shared/interfaces";
import {map, Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private token: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  private saveToken(token: string): void {
    localStorage.setItem('token', token);
    this.token = token;
  }

  public getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  private request(type: 'login'|'register', user?: TokenPayload): Observable<any> {
    const base = this.http.post<TokenResponse>(`${environment.apiUrl}/api/${type}`, user);

    return base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );
  }

  public register(user: TokenPayload): Observable<any> {
    return this.request('register', user);
  }

  public login(user: TokenPayload): Observable<any> {
    return this.request('login', user);
  }

  public getUserDetails(): UserDetails | null {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  public logout(): void {
    this.token = '';
    window.localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
