import React, { useState } from 'react';

import { PressureDto, LifestyleDto } from '@/types/types';

interface AddMeasurementModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { Pressures: PressureDto[]; Lifestyle: LifestyleDto }) => Promise<boolean>;
}

const AddMeasurementModal= ({ open, onClose, onSubmit }:AddMeasurementModalProps) => {
  const [pressures, setPressures] = useState<PressureDto[]>([
    { UpperPressure: 0, LowerPressure: 0, Heartbeat: 0 },
    { UpperPressure: 0, LowerPressure: 0, Heartbeat: 0 },
    { UpperPressure: 0, LowerPressure: 0, Heartbeat: 0 },
    { UpperPressure: 0, LowerPressure: 0, Heartbeat: 0 },
  ]);

  const [lifestyle, setLifestyle] = useState<LifestyleDto>({
    Description: '',
    Smoking: false,
    Alcohol: false,
    Sport: false,
    Stretching: false,
  });

  const handlePressureChange = (index: number, field: keyof PressureDto, value: number) => {
    const newPressures = [...pressures];
    newPressures[index] = { ...newPressures[index], [field]: value };
    setPressures(newPressures);
  };

  const handleLifestyleChange = (field: keyof LifestyleDto, value: any) => {
    setLifestyle({ ...lifestyle, [field]: value });
  };

  const handleSubmit = async () => {
    const success = await onSubmit({ Pressures: pressures, Lifestyle: lifestyle });
    if (success) {
      onClose();
      setPressures([
        { UpperPressure: 0, LowerPressure: 0, Heartbeat: 0 },
        { UpperPressure: 0, LowerPressure: 0, Heartbeat: 0 },
        { UpperPressure: 0, LowerPressure: 0, Heartbeat: 0 },
        { UpperPressure: 0, LowerPressure: 0, Heartbeat: 0 },
      ]);
      setLifestyle({
        Description: '',
        Smoking: false,
        Alcohol: false,
        Sport: false,
        Stretching: false,
      });
    }
  };

  return (
   <></>
  );
};

export default AddMeasurementModal;