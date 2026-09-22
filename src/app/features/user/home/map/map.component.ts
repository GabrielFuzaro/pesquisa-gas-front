import { Component, ElementRef, Input, OnChanges, AfterViewInit, SimpleChanges, ViewChild, NgZone } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MapService } from 'src/app/services/map.service';
import { EstabelecimentoService } from 'src/app/routes/estabelecimento.service';
import { HistoricoService } from 'src/app/routes/historico.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { Estabelecimento } from 'src/app/interfaces/dto/estabelecimento';

interface PrecoPorTamanho {
  tamanhoCodigo: string;
  tamanhoDescricao: string;
  preco: number;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit, OnChanges {

  @ViewChild('mapContainer')
  mapContainer!: ElementRef<HTMLDivElement>;

  @Input() mes?: number;
  @Input() ano?: number;
  @Input() estabelecimentoId?: number;
  @Input() filtrosAplicados = 0;

  private map!: any;
  markers: any[] = [];
  estabelecimentos: Estabelecimento[] = [];

  showModalNavegacao = false;
  coordsSelecionadas: { lat: number; lng: number; nome: string; precos?: PrecoPorTamanho[] } | null = null;

  private initialView = {
    lat: -19.7502,
    lng: -47.9325,
    zoom: 13,
  };

  constructor(
    private mapService: MapService,
    private estabelecimentoService: EstabelecimentoService,
    private historicoService: HistoricoService,
    private notifier: NotifierService,
    private ngZone: NgZone
  ) {}

  async ngAfterViewInit(): Promise<void> {
    this.carregarMapa();
    await this.carregarEstabelecimentos();
    this.adicionarPinsNoMapa(this.estabelecimentos.map(e => ({ estabelecimento: e })));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filtrosAplicados'] && this.mes && this.ano && this.map) {
      this.buscarPinsFiltrados();
    }
  }

  private carregarMapa(): void {
    if (!this.mapContainer?.nativeElement) {
      this.notifier.showError('Não foi possível carregar o Google Maps.');
      return;
    }

    const map = this.mapService.createMap({
      container: this.mapContainer.nativeElement,
      center: { lat: this.initialView.lat, lng: this.initialView.lng },
      zoom: this.initialView.zoom,
      disableDefaultUI: false,
      clickableIcons: false,
      draggable: true,
      scrollwheel: true,
      zoomControl: true,
    });

    if (!map) {
      this.notifier.showError('Não foi possível carregar o Google Maps.');
      return;
    }

    this.map = map;
    this.mapService.triggerResize(this.map);
  }

  async carregarEstabelecimentos(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.estabelecimentoService.listarEstabelecimentos()
      );
      this.estabelecimentos = response;
    } catch (error) {
      this.notifier.showError('Erro ao carregar estabelecimentos');
    }
  }

  async buscarPinsFiltrados(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.historicoService.buscarMenorPrecoAtuais(
          0, 1000, 'ASC', this.mes!, this.ano!, this.estabelecimentoId
        )
      );

      const pinsComPreco = response.content.flatMap(historicoMes =>
        historicoMes.historicos.map(historico => {
          const estabelecimento = this.estabelecimentos.find(
            e => e.id === historico.estabelecimentoId
          );

          if (!estabelecimento) return null;

          return {
            estabelecimento,
            precos: historico.informacoes.map(info => ({
              tamanhoCodigo: info.tamanhoCodigo,
              tamanhoDescricao: info.tamanhoDescricao,
              preco: info.preco,
            })),
          };
        }).filter((item): item is { estabelecimento: Estabelecimento; precos: PrecoPorTamanho[] } => item !== null)
      );

      this.adicionarPinsNoMapa(pinsComPreco);
    } catch (error) {
      this.notifier.showError('Erro ao buscar postos filtrados');
    }
  }

  adicionarPinsNoMapa(itens: { estabelecimento: Estabelecimento; precos?: PrecoPorTamanho[] }[]): void {
    this.mapService.clearPinOnMap(this.markers);
    this.markers = [];

    itens.forEach((item) => {
      const lat = Number(item.estabelecimento.latitude);
      const lng = Number(item.estabelecimento.longitude);

      if (!lat || !lng) {
        console.warn(`${item.estabelecimento.nome} sem coordenadas válidas`);
        return;
      }

      const marker = this.mapService.setOrCreateMarker({
        map: this.map,
        marker: null,
        latitude: lat,
        longitude: lng,
        draggable: false,
        clickable: true,
        onClick: () => this.abrirModalNavegacao(item.estabelecimento, item.precos),
      });

      this.markers.push(marker);
    });
  }

  abrirModalNavegacao(estabelecimento: Estabelecimento, precos?: PrecoPorTamanho[]): void {
    this.ngZone.run(() => {
      this.coordsSelecionadas = {
        lat: Number(estabelecimento.latitude),
        lng: Number(estabelecimento.longitude),
        nome: estabelecimento.nome,
        precos,
      };
      this.showModalNavegacao = true;
    });
  }

  fecharModalNavegacao(): void {
    this.ngZone.run(() => {
      this.showModalNavegacao = false;
      this.coordsSelecionadas = null;
    });
  }

  abrirGoogleMaps(): void {
    if (!this.coordsSelecionadas) return;
    const { lat, lng } = this.coordsSelecionadas;
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  }

  abrirWaze(): void {
    if (!this.coordsSelecionadas) return;
    const { lat, lng } = this.coordsSelecionadas;
    window.open(`https://waze.com/ul?ll=${lat},${lng}&navigate=yes`, '_blank');
  }
}