import { Component, OnInit } from '@angular/core';
import { OpenweatherService } from './openweather.service';
import { Observable } from 'rxjs';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'elclima';
  current: any = [];
  currentForecast: any = []
  currentCity: string = "Bogota"
  cities: any = {}
  closeResult: string = '';
  newlocation: string = ''
  users: any = []
  constructor(
    protected openweather: OpenweatherService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    //Pide informacion de la primera ciudad en cargar
    this.openweather.getWeather(this.currentCity)
    .subscribe((data:any) => {this.current = data});

    //Pide informacion de Paris
    this.openweather.getWeather('Paris')
    .subscribe((data:any) => {
      this.cities[data.name] = data
    });

    //Pide informacion de London
    this.openweather.getWeather('London')
    .subscribe((data:any) => {
      this.cities[data.name] = data
    });

    //obtiene los forecast para procesar y capturar solo tres dias
    this.openweather.getForecast(this.currentCity)
    .subscribe((data:any) => {
      var i = 0
      data.list.forEach((element:any) => {
        if (element.dt_txt.search('12:00:00')>0 && i<3) {
          this.currentForecast[i]=element
          i++
        }
      });
    });

      //Consulta usuarios aleatorios
      this.openweather.getUsers()
      .subscribe((data:any) => {
        this.users = data.results
      });

  }

  //convertir fecha en nombre del dia
  nameOfDay(dateString:any){
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var d = new Date(dateString);
    var dayName = days[d.getDay()];
    return dayName
  }

  //evento que captura el valor del campo de la nueva ubicacion
  onKey(event:any) { this.newlocation = event.target.value;}
  
  //abre la modal para agregar una nueva ubicacion
  open(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with add`;
      if (this.newlocation){
        // agrega nueva ubicacion con el valor ingresado
        this.openweather.getWeather(this.newlocation)
        .subscribe((data:any) => {
          this.cities[data.name] = data
        });
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  //captura el motivo al cerrar el modal de add location
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  // convierte el valor del viento en direccion
  degToCompass(num:any) {
      var val = Math.floor((num / 22.5) + 0.5);
      var arr = ["North", "North North East", "North East", "Easth North East", "East", "East South East", "South East", "South South East", "South", "South South West", "South West", "West South West", "West", "West North West", "North West", "North North West"];
      return arr[(val % 16)];
  }

  //obtiene el icono segun la respuesta de la api
  getIcon(item:any){
    if (this.current.weather && !item) {
      return 'http://openweathermap.org/img/wn/'+this.current.weather[0].icon+'@2x.png';
    } else if (item) {
      return 'http://openweathermap.org/img/wn/'+item.weather[0].icon+'@2x.png';
    }
  }
}