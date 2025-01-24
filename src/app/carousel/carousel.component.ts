import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { ApiServiceService } from '../services/api-service.service';
import { ICarouselSlide } from '../Interface/IcarouselSlide';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [NgFor,CommonModule,FormsModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent {

  constructor(private api: ApiServiceService){}
  currentSlide :number=0;
  images = [];
 // Slides array
 slides: { content: string; bgColor: string }[] = [];

  // Original data
  browserObjects: ICarouselSlide[] = [];

   ngOnInit(): void {
    this.fetchDataAndPopulateSlides();
    setInterval(() => this.nextSlide(), 10000);
    history.pushState(null, '', location.href);
    window.onpopstate = function() {
    history.pushState(null, '', location.href);
    };
    this.populateSlides();

  }

   populateSlides(): void {
    console.log(this.images);
    console.log("this.browserObjects "+this.browserObjects);
    this.slides = this.browserObjects.map(item => ({
      content: `<div class="crousal-img-container">
                  <img src="${item.imagePath}" class="crousal-img">
                </div>`,
      bgColor: 'bg-color-05' // Default background color
    }));
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

    async fetchDataAndPopulateSlides(): Promise<void> {
      try {
        const data =await this.api.getAllImages();
        this.browserObjects = data || []; // Solution 2: Use nullish coalescing
        console.log("data "+data)
        console.log("this.browserObjects "+this.browserObjects)
        this.slides = this.browserObjects.map(item => ({
          content: `<div class="crousal-img-container">
                      <img src="${item.imagePath}" class="crousal-img">
                    </div>`,
          bgColor: 'bg-color-05'
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  

 // API call to fetch data


}
