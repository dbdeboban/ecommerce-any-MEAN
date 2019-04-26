import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DataService} from "../services/data.service";
import {RestApiService} from "../services/rest-api.service";
import {ToastrService} from "ngx-toastr";

@Component({ 
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories: any = [];
  newCategory = '';
  constructor(
    private data: DataService,
    private rest: RestApiService,
    private toastr: ToastrService
  ) { }

  async ngOnInit() {
    try {
      const data = await this.rest.get('api/categories');
      data['success'] ?
        (this.categories = data['categories']) :
        this.toastr.error("Can't load categories");
    } catch (error){
      this.toastr.error('Can\'t connect to server. Please check your internet connection.')
    }

  }

  async addCategory(){
    if (this.newCategory.length == 0){
      this.toastr.warning('Please enter category name.');
      return;
    }
    const data = await this.rest.post('api/categories', {category: this.newCategory});
    data['success'] ?
      (this.toastr.success("Category added successfully"), this.newCategory = '', this.ngOnInit()) :
      this.toastr.error(data['message'], "Error");
  }

}
