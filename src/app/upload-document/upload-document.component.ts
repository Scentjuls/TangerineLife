import { Component, OnInit } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { UploadFileService } from 'src/services/upload-file.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.css']
})

export class UploadDocumentComponent implements OnInit {
  showTable: boolean = false;
  tableDatas: Array<any> = [];
  file: File;

  constructor(
    private papa: Papa,
    private UploadFileData: UploadFileService,
    private toastr: ToastrService
  ) {

  }

  ngOnInit() {

  }

  //Drag and Drop Function
  uploadFileDrag(event: FileList): void {
    this.file = event[0];
    const file: File = event.item(0);
    const reader: FileReader = new FileReader();
   
    reader.readAsText(file);
    reader.onload = e => {
      console.log('e', e)
      const csv = <string>reader.result;
      this.papa.parse(csv, {
        delimiter: ",",
        header: true,
        skipEmptyLines: true,
        beforeFirstChunk: function( chunk ) {
          var rows = chunk.split( /\r\n|\r|\n/ );
          var headings = rows[0].split( ',' );
          headings[1] = 'Phone Number';
          headings[5] = 'Date of Birth';
          headings[8] = 'Call Allowance';
          headings[9] = 'Transport Allowance';
          rows[0] = headings.join();
          return rows.join( '\n' );
      },
        complete: (result) => {
          let data = result.data[0];
          if (('Fullname' in data) && ('Phone Number' in data) && ('Address' in data) && ('State' in data) && ('LGA' in data) &&
            ('Date of Birth' in data) && ('Salary' in data) && ('Gender' in data) && ('Call Allowance' in data) && ('Transport Allowance' in data)) {
            this.toastr.success('You have Uploaded the CSV file Sucessfully', 'Successful Upload');
            this.showTable = true;
            this.tableDatas = result.data
          } else {
            this.toastr.error('Upload a valid excel file with matching headers', 'Wrong Headers');
          }
        }
      })
    }
  }

  getFile() {
    document.getElementById("upfile").click();
  }

// On click function
  uploadFileClick(files: FileList): void {
    this.file = files[0];
    const file: File = files.item(0);
    const reader: FileReader = new FileReader();
    reader.readAsText(file);
    reader.onload = e => {
      const csv = <string>reader.result;
      this.papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        beforeFirstChunk: function( chunk ) {
          var rows = chunk.split( /\r\n|\r|\n/ );
          var headings = rows[0].split( ',' );
          headings[1] = 'Phone Number';
          headings[5] = 'Date of Birth';
          headings[8] = 'Call Allowance';
          headings[9] = 'Transport Allowance';
          rows[0] = headings.join();
          return rows.join( '\n' );
      },
        complete: (result) => {
          let data = result.data[0];
          if (('Fullname' in data) && ('Phone Number' in data) && ('Address' in data) && ('State' in data) && ('LGA' in data) &&
          ('Date of Birth' in data) && ('Salary' in data) && ('Gender' in data) && ('Call Allowance' in data) && ('Transport Allowance' in data)) {
            this.toastr.success('You have Uploaded the CSV file Sucessfully', 'Successful Upload');
            this.showTable = true;
            this.tableDatas = result.data
          } else {
            this.toastr.error('Upload a valid excel file with matching headers', 'Wrong Headers');
          }
        }
      })
    }
  }

  //Posting file to the endpoint
  uploadCSV() {
    let fd = new FormData();
    fd.append('file', this.file);
    this.UploadFileData.uploadFile(fd).subscribe(
      res => {
        if (res) {
          this.toastr.success('You have Uploaded the CSV file Sucessfully', 'Successfully Uploaded');
        }
      }
    )
  }



}