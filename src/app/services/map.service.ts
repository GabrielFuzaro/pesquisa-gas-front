/*import { Injectable } from "@angular/core";

export interface MapInitOptions {
  container: HTMLElement;
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  disableDefaultUI?: boolean;
  clickableIcons?: boolean;
  draggable?: boolean;
  gestureHandling?: string;
  scrollwheel?: boolean;
  zoomControl?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class MapService {

    getGoogleMaps(): any | null {
        return (window as any).google?.maps ?? null;
    }

    createMap(options: MapInitOptions): any | null {
        const googleMaps = this.getGoogleMaps();

        if(!googleMaps){
            return null;
        }

        return new googleMaps.Map(options.container, {
            center: options.center,
            zoom: options.zoom,
            disableDefaultUI: options.disableDefaultUI ?? false,
            clickableIcons: options.clickableIcons ?? false,
            draggable: options.draggable ?? true,
            gestureHandling: options.gestureHandling ?? 'auto',
            scrollwheel: options.scrollwheel ?? true,
            zoomControl: options.zoomControl ?? true,
        });
    }

    triggerResize(map: any): void{
        const googleMaps = this.getGoogleMaps();

        if(!googleMaps || !map){
            return;
        }
        setTimeout(() => {
            googleMaps.event.trigger(map, 'resize');
        });
    }

    addClickListener(map: any, callback: (latitude: number, longitude: number) => void): void {
        if(!map) {
            return;
        }

        map.addListener('click', (event: any) => {
            if(!event?.latLng){
                return;
            }

            callback(event.latLng.lat(), event.latLng.lng());
        });
    }

    setOrCreateMarker(options: {
        map: any;
        marker: any;
        latitude: number;
        longitude: number;
        draggable: boolean;
        clickable?: boolean;
        icon?: string;
        onClick?: () => void;
        onDragEnd?: (latitude: number, longitude: number) => void;
    }): any {
        const googleMaps = this.getGoogleMaps();

            if(!googleMaps || !options.map){
                return options.marker;
            }

            const position = {
                lat: options.latitude,
                lng: options.longitude,
            };

            if(!options.marker) {
                const marker = new googleMaps.Marker({
                    position,
                    map: options.map,
                    draggable: options.draggable,
                    clickable: options.clickable ?? true,
                    icon: options.icon,
                });

                if (options.onClick) {
                marker.addListener('click', () => {
                    options.onClick!();
                });
            }

            if(options.onDragEnd) {
                marker.addListener('dragend', (event: any)=> {
                    if(!event?.latLng) {
                        return;
                    }

                    options.onDragEnd!(
                        event.latLng.lat(),
                        event.latLng.lng()
                    );
                });
            }

            return marker;
        }

        options.marker.setPosition(position);
        return options.marker;
    }

    clearPinOnMap(markers: google.maps.Marker[]): void {
        markers.forEach(marker => marker.setMap(null));
        markers.length = 0;
    }

    geoCodeAddress(address: string): Promise<{ lat:number, lng: number } | null> {
        const googleMaps = this.getGoogleMaps();

        if(!googleMaps || !address){
            return Promise.resolve(null);
        }

        const geoCoder = new googleMaps.Geocoder();

        return new Promise((resolve) => {
            geoCoder.geocode({ address }, (results: any, status: string) => {
                if(status !== 'OK' || !results?.length) {
                    resolve(null);
                    return;
                }

                const location = results[0].geometry.location;

                resolve({
                    lat: location.lat(),
                    lng: location.lng(),
                });
            });
        });
    }
}*/