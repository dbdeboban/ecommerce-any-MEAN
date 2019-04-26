import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {ToastrService} from "ngx-toastr";
import {RestApiService} from "../services/rest-api.service";
import {DataService} from "../services/data.service";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  product: any;

  reviews: any;
  averageRating = 2.5;
  totalRated = 5;

  myReview = {
    title: '',
    description: '',
    rating: 0
  };

  cgr = true;
  constructor(
    private data: DataService,
    private rest: RestApiService,
    private toastr: ToastrService,
    private activatedRoute : ActivatedRoute,
    private router: Router,
    private _location: Location,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.rest.get(`api/products/${params.id}`)
        .then(data => {
          data['success'] ?
            (this.product = data['product'], this.reviews = this.product.reviews, this.calculateRating())
            : this.router.navigate(['/']);
        })
        .catch(error=>{
          this.toastr.error(error, 'Error');
          this._location.back();
        });
    });
  }

  calculateRating(){
    this.totalRated = this.reviews.length;
    let total = 0.0;
    this.reviews.forEach(review => {
      total += review.rating;
    });
    this.averageRating = total / this.totalRated;
  }

  async postReview(){
    if (this.myReview.rating == 0){
      this.toastr.error('Please select rating first.');
      return;
    }
    try {
      const data = await this.rest.post('api/reviews',{
        productId: this.product._id,
        title: this.myReview.title,
        description: this.myReview.description,
        rating: this.myReview.rating
      });

      data['success'] ?
        (this.toastr.success(data['message']),this.ngOnInit(), this.cdr.detectChanges())
        : this.toastr.error(data['message']);
    }
    catch (error){
      this.toastr.error(error['message']);
    }
  }
  async canGiveReview(){
    if (!localStorage.getItem('token')) {
      this.cgr = false;
      return;
    }

    if (!this.data.user) await this.data.getProfile();

    let alreadyReviewed = false;
    this.reviews.forEach(review => {
      if (review.owner._id == this.data.user._id)
        alreadyReviewed = true;
    });
    this.cgr = !alreadyReviewed;
  }
  addToCart(){
    this.data.addToCart(this.product)?
      this.toastr.success("Product Successfully added to Cart")
      :this.toastr.error('Product has already been added to Cart');
  }
}
