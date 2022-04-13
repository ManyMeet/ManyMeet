import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-google-auth',
  templateUrl: './google-auth.component.html',
  styleUrls: ['./google-auth.component.scss']
})
export class GoogleAuthComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.route.fragment.subscribe((fragment) => {
      if (fragment ){
        const fragments: string[] = fragment.split('&');
      
        const params = fragments.reduce<params>((acc, curr )=>{
          let set: string[] = curr.split('=');
          const [key, value] = set;
          
          Object.defineProperty(acc, key, {
            value: value,
            writable: true
          });
          return acc;
        },{} as params)
        localStorage.setItem('access-token', params.access_token);
        localStorage.setItem('authorized', 'true')
      }
      this.router.navigate([''])
    
    })

  }
  



}


type params = {
  access_token: string;
  authuser: string;
  expires_in: string;
  scope: string;
  token_type: string;
}
