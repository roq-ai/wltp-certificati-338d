import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface CardInterface {
  id?: string;
  certification_status: string;
  details: string;
  organization_id: string;
  created_at?: any;
  updated_at?: any;

  organization?: OrganizationInterface;
  _count?: {};
}

export interface CardGetQueryInterface extends GetQueryInterface {
  id?: string;
  certification_status?: string;
  details?: string;
  organization_id?: string;
}
