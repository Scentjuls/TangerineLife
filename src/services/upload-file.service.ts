import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  baseUrl = environment.apiBaseURL;
  constructor(
    private http: HttpClient
  ) { }

  uploadFile(data) {
    return this.http.post<any>(this.baseUrl, data)
  }
}
