export type PortalRole = 'CLIENT' | 'EMPLOYEE' | 'MANAGER' | 'ADMIN';

export type PortalProjectStatus = 'ACTIVE' | 'IN_REVIEW' | 'ON_HOLD' | 'COMPLETED' | 'DELIVERED';

export interface PortalProjectSummary {
  id: string;
  title: string;
  clientName: string;
  status: PortalProjectStatus;
  progress: number;
  startDate: string;
  endDate: string;
  daysLeft: number;
  unreadMessages: number;
  pendingDeliverables: number;
  pendingRfIs: number;
  modelVersion?: string;
}

export type BimElementType = 'COLUMN' | 'BEAM' | 'SLAB' | 'WALL' | 'FOUNDATION' | 'STAIR' | 'OTHER';

export interface BimElement {
  id: string;
  globalId: string;
  mark?: string;
  type: BimElementType;
  name: string;
  level?: string;
  material?: string;
  profile?: string;
  status: 'EXISTING' | 'NEW' | 'REVIEW' | 'APPROVED';
  properties: Record<string, string | number | boolean | null>;
  modelVersionId: string;
}

export interface BimModelVersion {
  id: string;
  projectId: string;
  fileName: string;
  version: string;
  uploadedAt: string;
  uploadedBy: string;
  elementCount: number;
  status: 'PROCESSING' | 'READY' | 'FAILED';
}

export interface PortalDeliverable {
  id: string;
  projectId: string;
  title: string;
  type: 'DRAWING' | 'MODEL' | 'SHOP_DRAWING' | 'TAKEOFF' | 'REPORT' | 'OTHER';
  revision: string;
  status: 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'DELIVERED';
  dueDate?: string;
  fileUrl?: string;
}

export interface PortalRfi {
  id: string;
  projectId: string;
  number: string;
  subject: string;
  status: 'OPEN' | 'ANSWERED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  createdAt: string;
  elementId?: string;
}
