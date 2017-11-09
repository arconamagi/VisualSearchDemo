import { Component } from '@angular/core';

import { WebService } from './web.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public loading: boolean;
  public uploadError: string;
  public uploadResponse: any;

  constructor(public webSvc: WebService) {
  }

  /**
   * Handles the change event of the input tag,
   * Extracts the image file uploaded and
   * makes an Http request with the image file.
   */
  handleInputChange(event) {
    this.setError('');
    this.uploadResponse = null;

    if (!event.target.files[0]) {
      return;
    }

    this.loading = true;

    this.webSvc.sendImage(event.target.files[0]).take(1).subscribe(
      response => {
        this.loading = false;
        this.handleSuccess(response);
      },
      error => {
        this.loading = false;
        this.handleError(error);
      }
    );

  }

  private handleSuccess(response) {
    console.log('Successfully uploaded image');
    this.uploadResponse = response;
  }

  private handleError(error) {
    this.setError(error || 'Error uploading image');
  }

  private setError(msg: string = null) {
    this.uploadError = msg;
  }

}
