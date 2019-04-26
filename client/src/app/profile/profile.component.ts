import { Component, OnInit } from '@angular/core';
import {DataService} from "../services/data.service";
import {NgSpinKitModule} from 'ng-spin-kit';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(
    private data: DataService
  ) { }

  ngOnInit() {
  }

}
