import { Router, ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public token: string;
  public rfqtoken: string;
  private subject = new Subject<any>();
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(  private route: ActivatedRoute, private router: Router, private http: HttpClient) {
    this.token = localStorage.getItem('token');
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
    this.rfqtoken  = this.findGetParameter('ref') ;
    if ( this.rfqtoken) {
    localStorage.setItem('rfqtoken', JSON.stringify(this.rfqtoken))  ;
    } else {
      this.rfqtoken = JSON.parse(localStorage.getItem('rfqtoken'));
    }
  }


 findGetParameter(parameterName: string) {
    let result = null;
    let   tmp = [];
    location.search
        .substr(1)
        .split('&')
        .forEach( (item) => {
          tmp = item.split('=');
          if (tmp[0] === parameterName) {
            result = decodeURIComponent(tmp[1]);
          }
        });
    return result;
      }
  sendMessage(message: string) {
    this.subject.next(message);
  }

  clearMessage() {
    this.subject.next('');
  }
  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  signinUser(email: string, password: string) {
    const lclUser = new User();
    this.currentUserSubject.next(lclUser);
    this.token = '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        username: email,
        password,
        Authorization: 'Bearer 123456',
        apikey: 'GENAPP'
      })
    };
    this.http
      .post<any>(
        environment.BASE_API + '/api/login?ClientID=All',
        {
          grant_type: 'password',
          username: email,
          password
        },
        httpOptions
      )
      .pipe(
        map(user => {
          // login successful if there's a jwt token in the response
          if (user && user.TOKEN) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('token', user.TOKEN);
            this.token = user.TOKEN;
            return user;
          }
          if (user.ERROR) {
            this.sendMessage('Logon failed');
            setTimeout(() => this.clearMessage(), 2000);
            return user.ERROR;
          }
        })
      )
      .subscribe(data => {
        if (data.TOKEN) {
          this.getUserDetails();
        }
      });
  }
  /* ************************************************************* */
  getUserDetails() {
    const lcluser = new User();
    const context = '{TOKEN:' + this.token + '}';
    const params = new HttpParams()
      .set('Partner', 'ALL')
      .set('Class', 'USER')
      .set('CallContext', context);
    this.http
      .get<any>(environment.BASE_API + '/api/GETFLEX', { params })
      .subscribe(data => {
        if (data.ServicesList instanceof Array) {
          const tempObj = JSON.parse(data.ServicesList[0].JsonsetJstext);
          lcluser.firstName = tempObj.NAME_FIRST;
          lcluser.lastName = tempObj.NAME_LAST;
          lcluser.sundry = tempObj.OBJ + ' - ' + tempObj.DATA;
          lcluser.username = tempObj.EMAIL.toLowerCase();
          lcluser.cellno = tempObj.CELLNO;
          this.currentUserSubject.next(lcluser);
          localStorage.setItem('currentUser', JSON.stringify(lcluser));
          this.router.navigate(['/']);
        }
      });
  }
  /* ************************************************************* */
  requestOTP(email: string, typeofcom: string, cellno: string) {
    const luser = {
      USERNAME: email,
      TYPEOF: typeofcom,
      CELLNO: cellno
    };
    if (!this.token || this.token.length < 6) {
      this.token = '123456';
    }
    const params = new HttpParams()
      .set('Partner', 'ALL')
      .set('Class', 'PWDR')
      .set('CallContext', JSON.stringify(luser));
    return this.http.get<any>(environment.BASE_API + '/api/GETFLEX', {
      params
    });
  }
  /* ************************************************************* */
  confirmOTP(email: string, otp: string, temptoken: string) {
    this.token = '123456';
    localStorage.setItem('token', '123456');
    const luser = {
      OTP: otp,
      TOKEN: temptoken
    };
    const params = new HttpParams()
      .set('Partner', 'ALL')
      .set('Class', 'OTPC')
      .set('CallContext', JSON.stringify(luser));
    return this.http
      .get<any>(environment.BASE_API + '/api/GETFLEX', {
        params
      })
      .pipe(
        map(data => {
          if (data.ServicesList instanceof Array) {
            return JSON.parse(data.ServicesList[0].JsonsetJstext).TOKEN;
          }
        })
      );
  }

  /* ************************************************************* */
  updatePassword(email: string, password: string, token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        token,
        password,
        Authorization: 'Bearer 123456',
        apikey: 'GENAPP'
      })
    };
    this.http
      .post<any>(
        environment.BASE_API + '/api/Updatepwd',
        {
          grant_type: 'password',
          username: email,
          password
        },
        httpOptions
      )
      .pipe(
        map(user => {
          // login successful if there's a jwt token in the response

          return user.TOKEN;
        })
      )
      .subscribe(newtoken => {
        if (newtoken) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('token', JSON.stringify(newtoken));
          this.token = newtoken;
          this.getUserDetails();
        }
      });
  }
  /* ************************************************************* */
  signupUser(
    email: string,
    password: string,
    Userdetail: string,
    firstname: string,
    lastname: string,
    cellno: string
  ) {
    this.token = '123456';
    localStorage.setItem('token', '123456');
    const lcluser = new User();
    let tempObj = '';
    const context =
      '{USERDETAIL:' +
      Userdetail +
      ',EMAIL:' +
      email +
      ',PASSWORD:' +
      password +
      ',FIRSTNAME:' +
      firstname +
      ',LASTNAME:' +
      lastname +
      ',CELLNO:' +
      cellno +
      '}';
    const params = new HttpParams()
      .set('Partner', 'ALL')
      .set('Class', 'PWDN')
      .set('CallContext', context);
    this.http
      .get<any>(environment.BASE_API + '/api/GETFLEX', { params })
      .subscribe(data => {
        if (data.ServicesList instanceof Array) {
          if (data.ServicesList[0].JsonsetName === 'ERROR') {
            tempObj =
              'Error:' + JSON.stringify(data.ServicesList[0].JsonsetJstext);
          } else {
            tempObj =
              'Success:' + JSON.stringify(data.ServicesList[0].JsonsetJstext);
          }
          this.subject.next(tempObj);
        }
      });
    //  this.router.navigate(['/']);
  }
  /* ************************************************************* */
  logout() {
    /* firebase.auth().signOut();*/
    this.token = null;
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }
  /* ************************************************************* */
  getToken() {
    /*  firebase.auth().currentUser.getIdToken()
      .then(
        (token: string) => this.token = token
      );*/
    return this.token;
  }
  /* ************************************************************* */
  isAuthenticated() {
    return ( this.token != null || this.rfqtoken != null ) ;
  }
}
