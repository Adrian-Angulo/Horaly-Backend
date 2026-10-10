/**
 * Servicio de Dominio para el cálculo determinista de festivos nacionales de Colombia.
 *
 * Implementa la legislación oficial colombiana:
 * - Ley 51 de 1983 (Ley Emiliani): Traslado de días festivos al lunes siguiente.
 * - Festivos fijos inamovibles.
 * - Festivos móviles basados en el cómputo del Domingo de Resurrección (Pascua)
 *   utilizando el algoritmo gregoriano anónimo (Meeus/Jones/Butcher).
 *
 * Principios aplicados:
 * - SOLID (SRP): Responsabilidad única de calcular festivos de Colombia.
 * - Clean Code: Funciones pequeñas, puras, sin efectos secundarios, tipado estricto.
 */
export declare class ColombiaHolidaysService {
    private static readonly cachePorAnio;
    /**
     * Calcula el Domingo de Resurrección (Pascua) para un año dado.
     * Algoritmo de Meeus/Jones/Butcher para el calendario Gregoriano.
     */
    static calcularDomingoPascua(year: number): Date;
    /**
     * Aplica la regla de la Ley Emiliani: si el día no es lunes,
     * se traslada al lunes inmediatamente posterior.
     */
    private static trasladarAlSiguienteLunes;
    private static sumarDias;
    private static formatearIso;
    /**
     * Obtiene todos los festivos nacionales oficiales de Colombia para el año dado en formato ISO (`YYYY-MM-DD`).
     */
    static obtenerFestivosPorAnio(year: number): Set<string>;
    /**
     * Obtiene todos los festivos en un rango de fechas [startDateIso, endDateIso].
     */
    static obtenerFestivosEnRango(startDateIso: string, endDateIso: string): Set<string>;
    /**
     * Verifica si una fecha específica es festivo nacional en Colombia.
     */
    static esFestivo(dateIso: string): boolean;
}
