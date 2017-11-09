import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { Headers, Http, RequestOptions, Response } from '@angular/http';

import { mockData } from './mock-data';

// Switch this to false to do real request
const USE_MOCK = true;

@Injectable()
export class WebService {

  private apiBaseUrl = 'http://api-test.com'; //this is a fake url. Put in your own API url.

  constructor(private http: Http) {
  }

  /**
   * Handles the change event of the input tag,
   * Extracts the image file uploaded and
   * makes an Http request with the image file.
   */
  sendImage(image): Observable<any> {
    let pattern = /image-*/;
    let reader = new FileReader();

    if (USE_MOCK) {
      // Stub
      let result = new Subject();
      setTimeout(() => {
        let data = Object.assign({}, mockData);
        while (data.products.length < 20) {
          data.products.push(data.products[0]);
        }
        result.next(data)
      }, 1500 /* simulate uploading delay */);
      return result;
    } else {
      if (!image.type.match(pattern)) {
        return Observable.throw('File is not an image');
      }

      let endPoint = '/upload/profileImage'; //use your own API endpoint
      let headers = new Headers();
      headers.set('Content-Type', 'application/octet-stream');
      headers.set('Upload-Content-Type', image.type);

      return this.makeRequest(endPoint, 'POST', image, headers);
    }

  }

  /**
   * Makes the HTTP request and returns an Observable
   */
  private makeRequest(endPoint: string, method: string, body = null,
                      headers: Headers = new Headers()): Observable<any> {
    let url = this.apiBaseUrl + endPoint;
    let options = new RequestOptions({ headers: headers });

    if (method == 'GET') {
      return this.http.get(url, options)
        .map(this.extractData);
    } else if (method == 'POST') {
      return this.http.post(url, body, options)
        .map(this.extractData);
    }
  }

  /**
   * Extracts the response from the API response.
   */
  private extractData(res: Response) {
    let body = res.json();
    if (!body) {
      throw Error('Error received from the API')
    }
    return body.response || {};
  }

}
