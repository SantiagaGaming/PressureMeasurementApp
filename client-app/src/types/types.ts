export interface PressureDto {
    UpperPressure: number;
    LowerPressure: number;
    Heartbeat: number;
}

export interface LifestyleDto {
    Description?: string;
    Smoking: boolean;
    Alcohol: boolean;
    Sport: boolean;
    Stretching: boolean;
}

export interface CreateMeasurementRequest {
    Pressures: PressureDto[];
    Lifestyle: LifestyleDto;
}

export interface PressureMeasurementResponse {
    Id: number;
    UpperPressure: number;
    LowerPressure: number;
    Heartbeat: number;
    MeasureDate: Date;
    Description?: string;
    Smoking: boolean;
    Alcohol: boolean;
    Sport: boolean;
    Stretching: boolean;
    PressureState?: PressureState;
}
export interface UpdateMeasurementRequest {
    UpperPressure: number;
    LowerPressure: number;
    Heartbeat: number;
    Description?: string;
    Smoking: boolean;
    Alcohol: boolean;
    Sport: boolean;
    Stretching: boolean;
    PressureState?: PressureState;
}
export interface PressureState {
    Id: number;
    Name: string;
}
