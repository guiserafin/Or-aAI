import type { ServiceType, ServiceTypeId } from '@/types/budget';

export const SERVICE_TYPES: ServiceType[] = [
  {
    id: 'pintura',
    label: 'Pintura',
    defaultTitle: 'Pintura residencial',
    defaultDeadline: '5 dias úteis',
  },
  {
    id: 'eletrica',
    label: 'Elétrica',
    defaultTitle: 'Instalação elétrica',
    defaultDeadline: '2 dias úteis',
  },
  {
    id: 'marcenaria',
    label: 'Marcenaria',
    defaultTitle: 'Móvel planejado',
    defaultDeadline: '20 dias úteis',
  },
  {
    id: 'manutencao',
    label: 'Manutenção',
    defaultTitle: 'Manutenção geral',
    defaultDeadline: '3 dias úteis',
  },
  {
    id: 'limpeza',
    label: 'Limpeza',
    defaultTitle: 'Serviço de limpeza',
    defaultDeadline: '1 dia útil',
  },
  {
    id: 'instalacao',
    label: 'Instalação',
    defaultTitle: 'Serviço de instalação',
    defaultDeadline: '2 dias úteis',
  },
  {
    id: 'outro',
    label: 'Outro',
    defaultTitle: 'Prestação de serviço',
    defaultDeadline: '5 dias úteis',
  },
];

export function getServiceType(id: ServiceTypeId): ServiceType {
  return SERVICE_TYPES.find((type) => type.id === id) ?? SERVICE_TYPES[SERVICE_TYPES.length - 1];
}

export function isServiceTypeId(value: unknown): value is ServiceTypeId {
  return SERVICE_TYPES.some((type) => type.id === value);
}
