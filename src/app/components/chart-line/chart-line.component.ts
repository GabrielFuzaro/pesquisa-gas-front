import { Component, OnInit } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexLegend, ApexMarkers, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis, NgApexchartsModule } from 'ng-apexcharts';
import { DashboardService } from 'src/app/routes/dashboard.service';

export interface GraficoPreco {
  data: string;
  idTamanho: number;
  tamanhoBotijao: string;
  preco: number;
}

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  title: ApexTitleSubtitle;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  legend: ApexLegend;
//   markers: ApexMarkers;
};

@Component({
  selector: 'chart-line',
  templateUrl: './chart-line.component.html'
})
export class ChartLineComponent implements OnInit {
    periodos = [15, 30, 90, 180, 365];
    periodoSelecionado = 365;

    chartOptions: ChartOptions = {
        series: [],
        chart: {
            type: 'line',
            height: 420,
            width: '100%',
            toolbar: { show: true },
            zoom: { enabled: true }
        },
        title: {
            text: 'Variação de preço dos tamanhos',
            align: 'center',
            margin: 20,
            style: {
                fontSize: '18px',
                fontWeight: 'bold',
            }
        },
        stroke: {
            curve: 'straight',
            width: 3
        },
        // markers: {
        //     size: 6 
        // },
        xaxis: {
            type: 'category',
        },
        yaxis: {
            title: { text: 'Preço (R$)' },
            labels: {
                formatter: (val) => `R$ ${val.toFixed(2)}`
            }
        },
        tooltip: {
            shared: true,
            intersect: false,
            x: { format: 'dd/MM/yyyy' },
            y: {
                formatter: (val) => `R$ ${val.toFixed(2)}`
            }
        },
        legend: {
            position: 'top'
        }
    };

    constructor(private dashboardService: DashboardService){}

    ngOnInit(){
        this.carregarGrafico();
    }

    carregarGrafico(){
        this.dashboardService.buscarGraficoPreco(this.periodoSelecionado)
            .subscribe((res: GraficoPreco[]) => {
                const mapa = new Map<string, any[]>();

                res.forEach(item => {
                    const tamanhoBotijao = item.tamanhoBotijao;

                    if(!mapa.has(tamanhoBotijao)){
                        mapa.set(tamanhoBotijao, []);
                    }

                    const [ano, mes, dia] = item.data.split('-');
                    const dataFormatada = `${dia}/${mes}/${ano}`;
                    
                    mapa.get(tamanhoBotijao)?.push({
                        dataIso: item.data,
                        x: dataFormatada,
                        y: item.preco
                    });
                });

                const seriesData: ApexAxisChartSeries = Array.from(mapa.entries()).map(([nome, valores]) => ({
                    name: nome,
                    data: valores.sort(
                        (a, b) => a.dataIso.localeCompare(b.dataIso))
                        .map(item => ({ x: item.x, y: item.y }))
                }));

                this.chartOptions = {
                    ...this.chartOptions,
                    series: seriesData
                };
            }
        );
    }

    trocarPeriodo(dias:number){
        this.periodoSelecionado=dias;
        this.carregarGrafico();
    }
}