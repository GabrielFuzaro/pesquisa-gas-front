import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, firstValueFrom, forkJoin } from 'rxjs';
import { Cep } from 'src/app/interfaces/dto/cep';
import { Estabelecimento } from 'src/app/interfaces/dto/estabelecimento';
import { EstabelecimentoInput } from 'src/app/interfaces/input/estabelecimento-input';
import { CepService } from 'src/app/routes/cep.service';
import { EstabelecimentoService } from 'src/app/routes/estabelecimento.service';
import { MapService } from 'src/app/services/map.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-cadastro-estabelecimento',
  templateUrl: './cadastro-estabelecimento.component.html',
  styleUrls: ['./cadastro-estabelecimento.component.css']
})
export class CadastroEstabelecimentoComponent implements OnInit, AfterViewInit{

  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;

  formulario!:FormGroup
  estabelecimentos: Estabelecimento[] = [];
  cadastrando: boolean = false;
  carregandoOpcoes: boolean = false;

  private map!: any;
  private marker!: any;

  private initialView = {
    lat: -19.7502,
    lng: -47.9325,
    zoom: 13,
  };

  constructor(private router: Router, private formBuilder: FormBuilder, private notifier: NotifierService, private utilsService: UtilsService, private mapService: MapService, private cepService: CepService, private estabelecimentoService: EstabelecimentoService) {}

  ngOnInit(): void {
    this.criarFormulario();
    this.carregarOpcoes();
  }

  ngAfterViewInit(): void {
    this.carregarMapa();
  }

    private carregarMapa(): void {
      if(!this.mapContainer?.nativeElement) {
          this.notifier.showError("Não foi Possível carregar o Google Maps.")
        return;
    }

    const map = this.mapService.createMap({
      container: this.mapContainer.nativeElement,
      center: {
        lat: this.initialView.lat,
        lng: this.initialView.lng,
      },
      zoom: this.initialView.zoom,
      disableDefaultUI: false,
      clickableIcons: false,
      draggable: true,
      gestureHandling: 'auto',
      scrollwheel: true,
      zoomControl: true,
    });

    if(!map) {
      this.notifier.showError("Não foi possível carregar o Google Maps.");
      return;
    }

    this.map = map;

    this.mapService.addClickListener(this.map, (latitude, longitude) => {
      this.atualizarMarcador(latitude, longitude);
    });

    this.mapService.triggerResize(this.map);
  }

  private atualizarMarcador(latitude: number, longitude: number): void{
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

  private criarFormulario(): void{
    this.formulario = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255), Validators.pattern(/\S/)]],
      cep: ['', Validators.required],
      logradouro: [{ value : '' , disabled: true},
        [Validators.required, Validators.minLength(3), Validators.maxLength(255), Validators.pattern(/\S/)]
      ],
      bairro: [{ value: '', disabled:true },
        [Validators.required, Validators.minLength(3), Validators.maxLength(255), Validators.pattern(/\S/)]
      ],
      numero: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255), Validators.pattern(/\S/)]],
      latitude: [null, Validators.required],
      longitude: [null, Validators.required],
      telefone: ['', Validators.required],
      cnpj: ['', Validators.required],
      gerente: ['', Validators.required],
      proprietario: ['', Validators.required],
    });

    this.formulario.get('cep')?.valueChanges.subscribe(cep => {
      if(cep && cep.length == 9){
        this.buscarCep(cep);
      }
    });
  }

  buscarCep(cep: string) {
    let cepFormatado = cep.replace(/\D/g, '');

    firstValueFrom(this.cepService.getCep(cepFormatado))
    .then((response: Cep) => {
      if(response) {
        this.formulario.get('logradouro')?.setValue(response.logradouro);
        this.formulario.get('bairro')?.setValue(response.bairro);
      }

      this.findPlaceOnMap(response)
    })
    .catch(() => {
      this.notifier.showError("Erro ao buscar o CEP.");
    });
  }

  private carregarOpcoes(): void {
    this.carregandoOpcoes = true;

    forkJoin({
      estabelecimentos: this.estabelecimentoService.listarEstabelecimentos(),
    })
    .pipe(finalize(() => {
      this.carregandoOpcoes = false;
    }))
    .subscribe({
      next: ({
        estabelecimentos,
      }) => {
        this.estabelecimentos = estabelecimentos ?? [];
      },
      error: () => {
        this.notifier.showError("Não foi possível carregar os estabelecimentos");
      },
    });
  }

  save(): void {
    if(this.cadastrando || this.carregandoOpcoes) {
      return;
    }

    this.formulario.markAllAsTouched();

    if(this.formulario.invalid){
      this.utilsService.showInvalidFields(this.formulario);

      this.notifier.showError("Verifique os campos do formulário");
       return;
    }

    const valores = this.formulario.getRawValue();
    const nome = String(valores.nome).trim();

    const input = new EstabelecimentoInput({
      nome,
      logradouro: String(valores.logradouro).trim(),
      bairro: String(valores.bairro).trim(),
      numero: String(valores.numero).trim(),
      cep: String(valores.cep).trim(),
      latitude: Number(valores.latitude),
      longitude: Number(valores.longitude),
      telefone: String(valores.telefone).trim(),
      cnpj: String(valores.cnpj).trim(),
      gerente: String(valores.gerente).trim(),
      proprietario: String(valores.proprietario).trim(),
    });

    this.cadastrando = true;

    this.estabelecimentoService.createEstabelecimento(input)
    .pipe(finalize(() => {
      this.cadastrando = false;
    }))
    .subscribe({
      next: () => {
        this.notifier.showSucess("Estabelecimento cadastrado com sucesso!");

        this.router.navigateByUrl('/cms/estabelecimento');
      },
      error: error => {
        const mensagem = error?.error?.message || error?.message || 'Não foi possível cadastrar o estabelecimento';

        this.notifier.showError(mensagem);
      },
    });
  }

  async findPlaceOnMap(cep: Cep) {
    if(!this.map) return;

    const parts = [cep.logradouro, cep.bairro, cep.uf, cep.cep].filter(
      (p) => p && p.toString().trim() !== '');
      const addressQuery = parts.join(', ');

      if(!addressQuery) {
        this.notifier.showError("Endereço incompleto para busca no mapa.");
      }

      this.mapService.geoCodeAddress(addressQuery)
      .then((location) => {
        if(!location) {
          this.notifier.showError("Não foi possível localizar o endereço no mapa.");
          return;
        }

        this.atualizarMarcador(location.lat, location.lng);
        this.map.setCenter({lat: location.lat, lng: location.lng});
        this.map.setZoom(18);
      })
      .catch((error) => {
        console.error('Erro ao buscar localização no Google Maps:', error);
        this.notifier.showError('Erro ao buscar localização no mapa.');
      });
  }

  return() {
    this.router.navigateByUrl('/cms/estabelecimento');
  }
}
