import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-google-auth',
  templateUrl: './google-auth.component.html',
  styleUrls: ['./google-auth.component.scss']
})
export class GoogleAuthComponent implements OnInit {

  ngOnInit(): void {
    if (window.opener) { 
      window.opener.postMessage({success:'success'});
      window.close();
    }
    
  }

  
  



}
