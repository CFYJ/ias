import { SimpleGlobal } from 'ng2-simple-global';
import { async } from '@angular/core/testing';
import { Injectable, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, Response } from '@angular/http';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Rx';

export class User {
  constructor(
    public name: string,
    public password: string) { }
}

@Injectable()
export class AuthenticationService {

  constructor(
    
    private _router: Router,
    private http: Http,
    private jwtHelper: JwtHelper = new JwtHelper(),
    private sg: SimpleGlobal,  
  ) {}

  public getRoles():string{
    return 'system_admin';
  }


  logout() {
    sessionStorage.clear();
    localStorage.removeItem('user');
  }

  loggedIn(): boolean {
    if(sessionStorage.isLogged)
      return true;

    return false;
  }

  getUser(): string {
    if (this.loggedIn)
      return sessionStorage.userName? sessionStorage.userName: '';    
    return '';
  }

  getUserData(): any {
    if (this.loggedIn)
      return sessionStorage.userData? sessionStorage.userData: '';
    return '';
  }

  checkIfUserIsInRole(dataRow: any): boolean{ 
    if(sessionStorage.isLogged)
      if(sessionStorage.getItem(dataRow.trim().toUpperCase())==='1')
        return true;    
    
    return false;
  }

//#region metody uprawnien stare Piotrka do kontaktow

 
  // getUserRole(): string {
    
  //   if (this.loggedIn) {
  //     const token = localStorage.getItem('user');
  //     //const token = sessionStorage.getItem('user');
  //     if (token) {
  //       const role = this.jwtHelper.decodeToken(token).role;
  //       return role;
  //     } else {
  //       return '';
  //     }
  //   }
  // }


  // checkIfUserHasPermissionToEdit(dataRow: any): boolean {
  //   const user = this.getUser();
  //   const userData = this.getUserData();
  //   const role = this.getUserRole();

  //   if (dataRow.pion === userData.Pion && dataRow.wydzial === userData.Wydzial
  //     && (role === 'Supervisor' || dataRow.login === user)) {
  //     return true;
  //   }
  //   if (role === 'Admin' || dataRow.login === user) {
  //     return true;
  //   }
  //   return false;
  // }

  checkIfUserBelongsToITStaff(): boolean {
    const userData = this.getUserData();
    if (userData) {
      if (userData.Pion === 'P Informatyki' && userData.Wydzial === 'Wydział Informatyki') {
        return true;
      }
    }
    return false;
  }

  // checkCredential() {
  //   if (localStorage.getItem('user') === null) {
  //     this._router.navigate(['Login']);
  //   }
  // }

  // isEditAllowed(data: any) {
  //   const user = localStorage.getItem('user');
  // }

  //#endregion

  authorizationState:any =null;
  login(user) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json')
    return this.http.put(this.sg['HTTPS_SERVICE_URL'] + 'ADAuthentication/JwtAuthenticate1', JSON.stringify(user), { headers: headers })
      .map((response: Response) => {
        user = response.json();
        if (user && user.token) {
          localStorage.setItem('user', user.token);   
         
          //*********************** set isLogged */

          if (tokenNotExpired(null, user.token)){
          
            sessionStorage.setItem('isLogged','true');
            this.authorizationState = setInterval(()=>{        
              const token = localStorage.getItem('user');
              
              if (!tokenNotExpired(null, token) || sessionStorage.isLogged !=='true') {
                //sessionStorage.clear();//removeItem('isLogged');
                this.logout();
                clearTimeout(this.authorizationState);
                }
              
            }, 30000)
           }
                            
          //********************* get users roles */

          if(sessionStorage.isLogged){
            var role = this.jwtHelper.decodeToken(user.token)["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
       
            if(role){
                  if(role instanceof Array){
                    role.forEach((value:string, index:number, array:string[])=>{sessionStorage.setItem(array[index].trim().toUpperCase(),'1');});
                  }
                  else           
                    sessionStorage.setItem(role.trim().toUpperCase(),'1');
            }
          } 
          
          //***************************** userdata */
          sessionStorage.setItem('userData',this.jwtHelper.decodeToken(user.token).userData);

          //******************************username  */
          sessionStorage.setItem('userName', this.jwtHelper.decodeToken(user.token).name)
 
        
        }                   
      });
  }




}
