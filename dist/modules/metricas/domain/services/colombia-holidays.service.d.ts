export declare class ColombiaHolidaysService {
    private static readonly cachePorAnio;
    static calcularDomingoPascua(year: number): Date;
    private static trasladarAlSiguienteLunes;
    private static sumarDias;
    private static formatearIso;
    static obtenerFestivosPorAnio(year: number): Set<string>;
    static obtenerFestivosEnRango(startDateIso: string, endDateIso: string): Set<string>;
    static esFestivo(dateIso: string): boolean;
}
