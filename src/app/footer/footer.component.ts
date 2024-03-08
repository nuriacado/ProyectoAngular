import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  fecha: string | null = null;

  ngOnInit() {
    let hoy = new Date();
    this.fecha = hoy.toLocaleDateString();
  }
}
