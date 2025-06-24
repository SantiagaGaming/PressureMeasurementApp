export interface PressureDto {
    upperPressure: number;
    lowerPressure: number;
    heartbeat: number;
}

export interface LifestyleDto {
    description?: string;
    smoking: boolean;
    alcohol: boolean;
    sport: boolean;
    stretching: boolean;
}

export interface CreateMeasurementRequest {
    pressures: PressureDto[];
    lifestyle: LifestyleDto;
}
export interface PressureMeasurementDto {
    id: number;
    upperPressure: number;
    lowerPressure: number; 
    heartbeat: number;
    measureDate: Date;
    description?: string;
    smoking: boolean;
    alcohol: boolean;
    sport: boolean;
    stretching: boolean;
    pressureState?: PressureState;
}
export interface PressureState {
    id: number;
    name: string;
}
