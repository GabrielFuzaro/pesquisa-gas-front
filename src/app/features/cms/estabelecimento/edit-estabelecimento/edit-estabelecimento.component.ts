import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Cep } from 'src/app/interfaces/dto/cep';
import { Estabelecimento } from 'src/app/interfaces/dto/estabelecimento';
import { EstabelecimentoInput } from 'src/app/interfaces/input/estabelecimento-input';
import { CepService } from 'src/app/routes/cep.service';
import { EstabelecimentoService } from 'src/app/routes/estabelecimento.service';
import { MapService } from 'src/app/services/map.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-edit-estabelecimento',
  templateUrl: './edit-estabelecimento.component.html',
  styleUrls: ['./edit-estabelecimento.component.css']
})
export class EditEstabelecimentoComponent {
  formulario!: FormGroup;
  estabelecimento?: Estabelecimento;
  isDisabled = false;
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

  constructor(
    private activatedRouter: ActivatedRoute,
    private estabelecimentoService: EstabelecimentoService,
    private router: Router,
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private notifier: NotifierService,
    private cepService: CepService,
    private mapService: MapService
  ) { }

  ngOnInit() {
    firstValueFrom(this.estabelecimentoService.getById(this.id)).then(async (estabelecimento) => {
      this.estabelecimento = estabelecimento;
      await this.createForm();
      await this.carregarMapa();
    });
  }

  async createForm() {
    this.formulario = this.formBuilder.group({
      id: [{ value: this.estabelecimento?.id, disabled: true }],
      nome: [
        { value: this.estabelecimento?.nome, disabled: this.isDisabled },
        Validators.required,
      ],
      logradouro: [
        { value: this.estabelecimento?.logradouro, disabled: true },
        Validators.required,
      ],
      bairro: [
        { value: this.estabelecimento?.bairro, disabled: true },
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
      latitude: [
        { value: this.estabelecimento?.latitude, disabled: this.isDisabled },
        Validators.required,
      ],
      longitude: [
        { value: this.estabelecimento?.longitude, disabled: this.isDisabled },
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

    this.formulario.get('cep')?.valueChanges.subscribe(cep => {
      if (cep && cep.length === 9) {
        this.buscarCep(cep);
      }
    })

  }


  private carregarMapa(): void {
    if (!this.mapContainer?.nativeElement) {
      this.notifier.showError('Não foi possível carregar o Google Maps.');
      return;
    }

    const map = this.mapService.createMap({
      container: this.mapContainer.nativeElement,
      center: {
        lat: this.estabelecimento!.latitude ? Number(this.estabelecimento!.latitude) : this.initialView.lat,
        lng: this.estabelecimento!.longitude ? Number(this.estabelecimento!.longitude) : this.initialView.lng,
      },
      zoom: this.estabelecimento!.latitude && this.estabelecimento!.longitude ? 20 : this.initialView.zoom,
      disableDefaultUI: false,
      clickableIcons: false,
      draggable: true,
      gestureHandling: 'auto',
      scrollwheel: true,
      zoomControl: true,
    });

    if (!map) {
      this.notifier.showError('Não foi possível carregar o Google Maps.');
      return;
    }

    this.map = map;

    this.mapService.addClickListener(this.map, (latitude, longitude) => {
      this.atualizarMarcador(latitude, longitude);
    });

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
    this.formulario.patchValue({
      latitude,
      longitude,
    });

    this.marker = this.mapService.setOrCreateMarker({
      map: this.map,
      marker: this.marker,
      latitude,
      longitude,
      draggable: true,
      onDragEnd: (lat, lng) => this.atualizarMarcador(lat, lng),
    });
  }

  buscarCep(cep: string) {
    let cepFormatado = cep.replace(/\D/g, '');

    firstValueFrom(this.cepService.getCep(cepFormatado))
      .then((response: Cep) => {
        if (response) {

          this.formulario.get('logradouro')?.setValue(response.logradouro);
          this.formulario.get('bairro')?.setValue(response.bairro);

          this.findPlaceOnMap(response)
        }
      })
      .catch(() => {
        this.notifier.showError('Erro ao buscar o CEP.');
      });
  }

  // GOOGLE MAPS
  async findPlaceOnMap(
    cep: Cep
  ) {
    if (!this.map) return;

    const parts = [cep.logradouro, cep.bairro, cep.localidade, cep.uf, cep.cep, 100].filter(
      (p) => p && p.toString().trim() !== '',
    );
    const addressQuery = parts.join(', ');

    if (!addressQuery) {
      this.notifier.showError('Endereço incompleto para busca no mapa.');
      return;
    }

    this.mapService.geoCodeAddress(addressQuery)
      .then((location) => {
        if (!location) {
          this.notifier.showError('Não foi possível localizar o endereço no mapa.');
          return;
        }

        this.atualizarMarcador(location.lat, location.lng);
        this.map.setCenter({ lat: location.lat, lng: location.lng });
        this.map.setZoom(18);
      })
      .catch((error) => {
        console.error('Erro ao buscar localização no Google Maps:', error);
        this.notifier.showError('Erro ao buscar localização no mapa.');
      });
  }


  edit() {
    if (this.formulario.valid) {
      const estabelecimentoInput = new EstabelecimentoInput({
        nome: this.formulario.get('nome')?.value,
        logradouro: this.formulario.get('logradouro')?.value,
        bairro: this.formulario.get('bairro')?.value,
        numero: this.formulario.get('numero')?.value,
        cep: this.formulario.get('cep')?.value,
        latitude: this.formulario.get('latitude')?.value,
        longitude: this.formulario.get('longitude')?.value,
        telefone: this.formulario.get('telefone')?.value,
        cnpj: this.formulario.get('cnpj')?.value,
        gerente: this.formulario.get('gerente')?.value,
        proprietario: this.formulario.get('proprietario')?.value,
      });

      this.estabelecimentoService.updateEstabelecimento(this.estabelecimento!.id!, estabelecimentoInput).subscribe(
        (data) => {
          this.notifier.showSucess('Estabelecimento atualizado com sucesso!');
          this.router.navigateByUrl(`/cms/estabelecimento`);
        },
        (error) => {
          this.notifier.showError(
            error.error.message || 'Erro ao editar estabelecimento. Tente novamente mais tarde.'
          );
          return;
        }
      );
    } else {
      this.utilsService.showInvalidFields(this.formulario);
    }
  }

  return() {
    this.router.navigateByUrl(`/cms/estabelecimento/info/${this.estabelecimento?.id}`);
  }
}
