import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PermissionsGuardService } from 'src/app/guards/permissions-guard.service';
import { Estabelecimento } from 'src/app/interfaces/dto/estabelecimento';
import { EstabelecimentoService } from 'src/app/routes/estabelecimento.service';
import { MapService } from 'src/app/services/map.service';
import { NotifierService } from 'src/app/services/notifier.service';

@Component({
  selector: 'app-info-estabelecimento',
  templateUrl: './info-estabelecimento.component.html',
  styleUrls: ['./info-estabelecimento.component.css']
})
export class InfoEstabelecimentoComponent {

  formulario!: FormGroup;
  estabelecimento?: Estabelecimento;
  isDisabled = true;
  id = this.activatedRouter.snapshot.params['id'];

  @ViewChild('mapContainer')
  mapContainer!: ElementRef<HTMLDivElement>;

  private map!: any;
  private marker!: any;

  private initialView = {
    lat: -19.7502,
    lng: -47.9325,
    zoom: 13,
  };


  constructor(private activatedRouter: ActivatedRoute, private estabelecimentoService: EstabelecimentoService, private router: Router, private formBuilder: FormBuilder,
    private notifier: NotifierService, private mapService: MapService, public permissionService: PermissionsGuardService) { }

  async ngOnInit() {
    firstValueFrom(this.estabelecimentoService.getById(this.id)).then(async (estabelecimento) => {
      this.estabelecimento = estabelecimento;
      await this.createForm();
      await this.carregarMapa();
    });
  }

  private carregarMapa(): void {
    if (!this.mapContainer?.nativeElement) {
      this.notifier.showError('Não foi possível carregar o Google Maps.');
      return;
    }

    const map = this.mapService.createMap({
      container: this.mapContainer.nativeElement,
      center: {
        lat: this.estabelecimento?.latitude ? Number(this.estabelecimento.latitude) : this.initialView.lat,
        lng: this.estabelecimento?.longitude ? Number(this.estabelecimento.longitude) : this.initialView.lng,
      },
      zoom: this.estabelecimento?.latitude && this.estabelecimento?.longitude ? 20 : this.initialView.zoom,
      disableDefaultUI: true,
      clickableIcons: false,
      draggable: false,
      scrollwheel: true,
      zoomControl: true,
    });

    if (!map) {
      this.notifier.showError('Não foi possível carregar o Google Maps.');
      return;
    }

    this.map = map;

    if (this.estabelecimento?.latitude != null && this.estabelecimento?.longitude != null) {
      this.atualizarMarcador(
        Number(this.estabelecimento.latitude),
        Number(this.estabelecimento.longitude)
      );
    }

    this.mapService.triggerResize(this.map);
  }

  private atualizarMarcador(
    latitude: number,
    longitude: number
  ): void {
    this.marker = this.mapService.setOrCreateMarker({
      map: this.map,
      marker: this.marker,
      latitude,
      longitude,
      draggable: false,
    });
  }

  private createForm() {

    this.formulario = this.formBuilder.group({
      id: [{ value: this.estabelecimento?.id, disabled: this.isDisabled }],
      nome: [
        { value: this.estabelecimento?.nome, disabled: this.isDisabled },
        Validators.required,
      ],
      logradouro: [
        { value: this.estabelecimento?.logradouro, disabled: this.isDisabled },
        Validators.required,
      ],
      bairro: [
        { value: this.estabelecimento?.bairro, disabled: this.isDisabled },
        Validators.required,
      ],
      numero: [
        { value: this.estabelecimento?.numero, disabled: this.isDisabled },
        Validators.required,
      ],
      cep: [
        { value: this.estabelecimento?.cep, disabled: this.isDisabled },
        Validators.required,
      ],
      telefone: [
        { value: this.estabelecimento?.telefone, disabled: this.isDisabled },
        Validators.required,
      ],
      cnpj: [
        { value: this.estabelecimento?.cnpj, disabled: this.isDisabled },
        Validators.required,
      ],
      gerente: [
        { value: this.estabelecimento?.gerente, disabled: this.isDisabled },
        Validators.required,
      ],
      proprietario: [
        { value: this.estabelecimento?.proprietario, disabled: this.isDisabled },
        Validators.required,
      ],
    });
  }

  edit() {
    this.router.navigateByUrl(`/cms/estabelecimento/edit/${this.id}`);
  }

  return() {
    this.router.navigateByUrl(`/cms/estabelecimento`);
  }

}
