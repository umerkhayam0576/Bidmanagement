import {
  Business,
  BusinessMembership,
  UserProfile,
  Partner,
  Lead,
  Client,
  Invoice,
  Quotation,
  Project,
  Task,
  Employee,
  PayrollRun,
  LeaveRequest,
  Expense,
  PurchaseOrder,
  BankAccount,
  InventoryItem,
  PersonalAsset,
  PersonalLiability,
  PersonalIncomeDraw,
  VaultDocument,
  Message,
  AppNotification,
  AuditLog
} from '../types';

export const initialUserProfiles: UserProfile[] = [
  {
    id: 'usr_main',
    name: 'Omar Refay',
    email: 'omar@refayholdings.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Founder & Principal Owner',
    globalRole: 'SUPER_OWNER'
  },
  {
    id: 'usr_cfo',
    name: 'Elena Rostova',
    email: 'elena@refayholdings.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'Chief Financial Officer',
    globalRole: 'FINANCE_LEAD'
  },
  {
    id: 'usr_ops',
    name: 'Marcus Vance',
    email: 'marcus@refayholdings.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'VP of Operations',
    globalRole: 'EXECUTIVE'
  },
  {
    id: 'usr_emp_alex',
    name: 'Alexandre Dubois',
    email: 'alex@apexcloud.io',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    title: 'Principal Cloud Architect',
    globalRole: 'EMPLOYEE',
    employeeId: 'emp_1',
    businessId: 'biz_apex',
    department: 'ENGINEERING'
  },
  {
    id: 'usr_emp_priya',
    name: 'Priya Sharma',
    email: 'priya@apexcloud.io',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    title: 'Senior DevOps & Reliability Engineer',
    globalRole: 'EMPLOYEE',
    employeeId: 'emp_2',
    businessId: 'biz_apex',
    department: 'ENGINEERING'
  }
];

export const initialBusinesses: Business[] = [
  {
    id: 'biz_apex',
    name: 'Apex Cloud Technologies Inc.',
    slug: 'apex-cloud',
    tagline: 'Enterprise Cloud Infrastructure & Distributed Systems',
    industry: 'Technology & SaaS',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    currency: 'USD',
    taxId: 'US-EIN-94829103',
    address: '500 Howard Street, Suite 1400, San Francisco, CA',
    country: 'United States',
    fiscalYearStart: 'January 1',
    valuation: 14500000,
    monthlyRevenue: 385000,
    cashBalance: 2450000,
    ownerEquityPercentage: 65,
    createdAt: '2021-03-15'
  },
  {
    id: 'biz_kensington',
    name: 'Kensington Estates Ltd.',
    slug: 'kensington-estates',
    tagline: 'Commercial Real Estate Portfolio & Luxury Living',
    industry: 'Real Estate & Asset Management',
    logo: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=120&auto=format&fit=crop&q=80',
    currency: 'GBP',
    taxId: 'GB-VAT-839201948',
    address: '14 Berkeley Square, Mayfair, London, UK',
    country: 'United Kingdom',
    fiscalYearStart: 'April 6',
    valuation: 8200000,
    monthlyRevenue: 142000,
    cashBalance: 1120000,
    ownerEquityPercentage: 40,
    createdAt: '2022-06-20'
  },
  {
    id: 'biz_nordic',
    name: 'Nordic Roasters & Goods',
    slug: 'nordic-roasters',
    tagline: 'Direct-Trade Micro-Roastery & Premium Hardware',
    industry: 'Retail & E-commerce',
    logo: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=120&auto=format&fit=crop&q=80',
    currency: 'EUR',
    taxId: 'DK-CVR-40291029',
    address: 'Jægersborggade 42, Copenhagen, Denmark',
    country: 'Denmark',
    fiscalYearStart: 'January 1',
    valuation: 2400000,
    monthlyRevenue: 98000,
    cashBalance: 480000,
    ownerEquityPercentage: 100,
    createdAt: '2023-01-10'
  }
];

export const initialMemberships: BusinessMembership[] = [
  {
    id: 'mem_1',
    businessId: 'biz_apex',
    userId: 'usr_main',
    userName: 'Omar Refay',
    userEmail: 'omar@refayholdings.com',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'OWNER',
    department: 'Executive',
    joinedAt: '2021-03-15'
  },
  {
    id: 'mem_2',
    businessId: 'biz_apex',
    userId: 'usr_cfo',
    userName: 'Elena Rostova',
    userEmail: 'elena@refayholdings.com',
    userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'ADMIN',
    department: 'Finance',
    joinedAt: '2022-01-10'
  },
  {
    id: 'mem_3',
    businessId: 'biz_kensington',
    userId: 'usr_main',
    userName: 'Omar Refay',
    userEmail: 'omar@refayholdings.com',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'OWNER',
    department: 'Executive',
    joinedAt: '2022-06-20'
  },
  {
    id: 'mem_4',
    businessId: 'biz_nordic',
    userId: 'usr_main',
    userName: 'Omar Refay',
    userEmail: 'omar@refayholdings.com',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'OWNER',
    department: 'Executive',
    joinedAt: '2023-01-10'
  }
];

export const initialPartners: Partner[] = [
  // Apex Partners
  {
    id: 'ptn_1',
    businessId: 'biz_apex',
    name: 'Omar Refay',
    email: 'omar@refayholdings.com',
    role: 'Co-Founder & CEO',
    equityPercentage: 65,
    sharesCount: 650000,
    capitalContributed: 450000,
    profitSharePercentage: 65,
    votingRights: true,
    distributionDue: 85000,
    status: 'ACTIVE',
    payoutHistory: [
      { id: 'pay_1', date: '2024-12-15', amount: 120000, note: 'Q4 2024 Dividend' },
      { id: 'pay_2', date: '2024-06-30', amount: 95000, note: 'Q2 2024 Dividend' }
    ]
  },
  {
    id: 'ptn_2',
    businessId: 'biz_apex',
    name: 'Dr. Tariq Al-Mansoor',
    email: 'tariq@vertex-ventures.com',
    role: 'Founding Partner & CTO',
    equityPercentage: 25,
    sharesCount: 250000,
    capitalContributed: 200000,
    profitSharePercentage: 25,
    votingRights: true,
    distributionDue: 32690,
    status: 'ACTIVE',
    payoutHistory: [
      { id: 'pay_3', date: '2024-12-15', amount: 46000, note: 'Q4 2024 Dividend' }
    ]
  },
  {
    id: 'ptn_3',
    businessId: 'biz_apex',
    name: 'Horizon Angel Syndicate',
    email: 'syndicate@horizoncap.io',
    role: 'Series Seed Angel Investor',
    equityPercentage: 10,
    sharesCount: 100000,
    capitalContributed: 500000,
    profitSharePercentage: 10,
    votingRights: false,
    distributionDue: 13075,
    status: 'ACTIVE',
    payoutHistory: []
  },
  // Kensington Partners
  {
    id: 'ptn_4',
    businessId: 'biz_kensington',
    name: 'Omar Refay',
    email: 'omar@refayholdings.com',
    role: 'Principal Partner',
    equityPercentage: 40,
    sharesCount: 400000,
    capitalContributed: 1200000,
    profitSharePercentage: 40,
    votingRights: true,
    distributionDue: 44000,
    status: 'ACTIVE',
    payoutHistory: [
      { id: 'pay_4', date: '2024-11-28', amount: 60000, note: 'Autumn Rental Yield Distribution' }
    ]
  },
  {
    id: 'ptn_5',
    businessId: 'biz_kensington',
    name: 'Sir Charles Sterling',
    email: 'c.sterling@mayfairholdings.co.uk',
    role: 'Senior Development Partner',
    equityPercentage: 60,
    sharesCount: 600000,
    capitalContributed: 1800000,
    profitSharePercentage: 60,
    votingRights: true,
    distributionDue: 66000,
    status: 'ACTIVE',
    payoutHistory: [
      { id: 'pay_5', date: '2024-11-28', amount: 90000, note: 'Autumn Rental Yield Distribution' }
    ]
  },
  // Nordic Roasters Partner (Sole Proprietorship / 100%)
  {
    id: 'ptn_6',
    businessId: 'biz_nordic',
    name: 'Omar Refay',
    email: 'omar@refayholdings.com',
    role: '100% Sole Proprietor',
    equityPercentage: 100,
    sharesCount: 100000,
    capitalContributed: 350000,
    profitSharePercentage: 100,
    votingRights: true,
    distributionDue: 28500,
    status: 'ACTIVE',
    payoutHistory: [
      { id: 'pay_6', date: '2024-12-20', amount: 35000, note: 'Year-End Owner Draw' }
    ]
  }
];

export const initialLeads: Lead[] = [
  {
    id: 'lead_1',
    businessId: 'biz_apex',
    title: 'Multi-Region Kubernetes Migration',
    contactName: 'Sarah Jenkins',
    company: 'FinTech Velocity Global',
    email: 'sjenkins@velocityfin.com',
    phone: '+1 (415) 892-0192',
    stage: 'NEGOTIATION',
    value: 185000,
    probability: 85,
    assignedTo: 'Omar Refay',
    expectedClose: '2025-04-15',
    notes: 'Legal reviewing Master Services Agreement and SLA tier.',
    createdAt: '2025-02-10'
  },
  {
    id: 'lead_2',
    businessId: 'biz_apex',
    title: 'AI Pipeline Architecture & Data Lake',
    contactName: 'David Cho',
    company: 'OmniHealth Intelligence',
    email: 'dcho@omnihealth.ai',
    phone: '+1 (650) 334-1120',
    stage: 'PROPOSAL',
    value: 92000,
    probability: 60,
    assignedTo: 'Marcus Vance',
    expectedClose: '2025-04-30',
    notes: 'Submitted scope document. Technical demo scheduled.',
    createdAt: '2025-02-28'
  },
  {
    id: 'lead_3',
    businessId: 'biz_apex',
    title: 'SOC2 Compliance & Zero Trust Audit',
    contactName: 'Amira Patel',
    company: 'Krypton Pay',
    email: 'apatel@krypton.io',
    phone: '+1 (408) 552-8812',
    stage: 'DISCOVERY',
    value: 48000,
    probability: 40,
    assignedTo: 'Omar Refay',
    expectedClose: '2025-05-15',
    notes: 'Initial discovery meeting completed. High interest in Q2 timeline.',
    createdAt: '2025-03-01'
  },
  {
    id: 'lead_4',
    businessId: 'biz_kensington',
    title: 'Commercial Penthouse 5-Year Lease',
    contactName: 'Lord Alistair Crawford',
    company: 'Sterling Capital Partners',
    email: 'acrawford@sterlingcp.co.uk',
    phone: '+44 20 7946 0912',
    stage: 'NEGOTIATION',
    value: 240000,
    probability: 90,
    assignedTo: 'Omar Refay',
    expectedClose: '2025-04-01',
    notes: 'Final terms exchange on tenant fit-out contribution.',
    createdAt: '2025-01-18'
  },
  {
    id: 'lead_5',
    businessId: 'biz_nordic',
    title: 'Wholesale Roastery Supply Contract',
    contactName: 'Freja Møller',
    company: 'Scandi Living Hotel Group',
    email: 'freja@scandiliving.dk',
    phone: '+45 32 88 19 00',
    stage: 'PROPOSAL',
    value: 52000,
    probability: 75,
    assignedTo: 'Omar Refay',
    expectedClose: '2025-04-20',
    notes: 'Tasting box delivered to flagship location.',
    createdAt: '2025-02-14'
  }
];

export const initialClients: Client[] = [
  {
    id: 'cli_1',
    businessId: 'biz_apex',
    name: 'Julian Montgomery',
    company: 'Nexus Logistics Global',
    email: 'j.montgomery@nexuslog.com',
    phone: '+1 (212) 555-0199',
    address: '100 Wall Street, 22nd Floor, New York, NY',
    status: 'ACTIVE',
    totalBilled: 340000,
    outstandingBalance: 32500,
    projectsCount: 2,
    createdAt: '2023-04-10'
  },
  {
    id: 'cli_2',
    businessId: 'biz_apex',
    name: 'Claire Moreau',
    company: 'BioGen Discovery Corp',
    email: 'cmoreau@biogen-discovery.com',
    phone: '+1 (617) 440-9281',
    address: '500 Kendall Square, Cambridge, MA',
    status: 'ACTIVE',
    totalBilled: 215000,
    outstandingBalance: 0,
    projectsCount: 1,
    createdAt: '2023-09-18'
  },
  {
    id: 'cli_3',
    businessId: 'biz_kensington',
    name: 'Arthur Pendelton',
    company: 'Mayfair Family Trust',
    email: 'trustees@mayfairtrust.org.uk',
    phone: '+44 20 7123 4567',
    address: '8 Grosvenor Street, London, UK',
    status: 'ACTIVE',
    totalBilled: 480000,
    outstandingBalance: 40000,
    projectsCount: 3,
    createdAt: '2022-08-01'
  },
  {
    id: 'cli_4',
    businessId: 'biz_nordic',
    name: 'Lars Lindqvist',
    company: 'Stockholm Artisans Cafe Chain',
    email: 'lars@artisanscafe.se',
    phone: '+46 8 123 456',
    address: 'Drottninggatan 88, Stockholm, Sweden',
    status: 'ACTIVE',
    totalBilled: 84000,
    outstandingBalance: 6200,
    projectsCount: 1,
    createdAt: '2023-03-12'
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: 'inv_1',
    invoiceNumber: 'INV-2025-001',
    businessId: 'biz_apex',
    clientId: 'cli_1',
    clientName: 'Nexus Logistics Global',
    issueDate: '2025-02-15',
    dueDate: '2025-03-15',
    items: [
      { id: 'ii_1', description: 'Cloud Orchestration & Auto-Scaling (Sprint 8)', quantity: 80, unitPrice: 250, amount: 20000 },
      { id: 'ii_2', description: 'Terraform Infrastructure as Code Architecture', quantity: 50, unitPrice: 250, amount: 12500 }
    ],
    subtotal: 32500,
    taxRate: 0,
    taxAmount: 0,
    discountAmount: 0,
    total: 32500,
    status: 'OVERDUE',
    paymentMethod: 'ACH Wire Transfer',
    notes: 'Net 30 payment terms. Wire transfer details on file.'
  },
  {
    id: 'inv_2',
    invoiceNumber: 'INV-2025-002',
    businessId: 'biz_apex',
    clientId: 'cli_2',
    clientName: 'BioGen Discovery Corp',
    issueDate: '2025-03-01',
    dueDate: '2025-03-31',
    items: [
      { id: 'ii_3', description: 'Genomics Pipeline Optimization & Microservices', quantity: 1, unitPrice: 48000, amount: 48000 }
    ],
    subtotal: 48000,
    taxRate: 0,
    taxAmount: 0,
    discountAmount: 0,
    total: 48000,
    status: 'SENT',
    paymentMethod: 'Stripe Corporate Transfer',
    notes: 'Milestone 2 acceptance verified.'
  },
  {
    id: 'inv_3',
    invoiceNumber: 'INV-2025-003',
    businessId: 'biz_apex',
    clientId: 'cli_1',
    clientName: 'Nexus Logistics Global',
    issueDate: '2025-01-15',
    dueDate: '2025-02-15',
    items: [
      { id: 'ii_4', description: 'Initial Architecture Discovery & Security Blueprint', quantity: 1, unitPrice: 35000, amount: 35000 }
    ],
    subtotal: 35000,
    taxRate: 0,
    taxAmount: 0,
    discountAmount: 0,
    total: 35000,
    status: 'PAID',
    paymentMethod: 'Wire Transfer',
    notes: 'Paid in full on Feb 10, 2025',
    paidAt: '2025-02-10'
  },
  {
    id: 'inv_4',
    invoiceNumber: 'INV-2025-K01',
    businessId: 'biz_kensington',
    clientId: 'cli_3',
    clientName: 'Mayfair Family Trust',
    issueDate: '2025-03-01',
    dueDate: '2025-03-20',
    items: [
      { id: 'ii_5', description: 'Q1 Commercial Property Management Fee', quantity: 1, unitPrice: 33333.33, amount: 33333.33 }
    ],
    subtotal: 33333.33,
    taxRate: 20,
    taxAmount: 6666.67,
    discountAmount: 0,
    total: 40000,
    status: 'SENT',
    paymentMethod: 'BACS Transfer',
    notes: 'UK VAT applied @ 20%.'
  },
  {
    id: 'inv_5',
    invoiceNumber: 'INV-2025-N01',
    businessId: 'biz_nordic',
    clientId: 'cli_4',
    clientName: 'Stockholm Artisans Cafe Chain',
    issueDate: '2025-02-20',
    dueDate: '2025-03-20',
    items: [
      { id: 'ii_6', description: 'Specialty Ethiopian Yirgacheffe Beans (200kg)', quantity: 200, unitPrice: 22, amount: 4400 },
      { id: 'ii_7', description: 'Barista Precision Grinder Parts', quantity: 3, unitPrice: 600, amount: 1800 }
    ],
    subtotal: 6200,
    taxRate: 0,
    taxAmount: 0,
    discountAmount: 0,
    total: 6200,
    status: 'SENT',
    paymentMethod: 'SEPA Wire',
    notes: 'Direct trade green bean consignment.'
  }
];

export const initialQuotations: Quotation[] = [
  {
    id: 'qte_1',
    quoteNumber: 'QTE-2025-104',
    businessId: 'biz_apex',
    clientId: 'cli_1',
    clientName: 'Nexus Logistics Global',
    issueDate: '2025-03-05',
    expiryDate: '2025-04-05',
    items: [
      { id: 'qi_1', description: 'Phase 2: Global Edge CDN & IoT Telemetry Sync', quantity: 1, unitPrice: 85000, amount: 85000 },
      { id: 'qi_2', description: 'Dedicated 24/7 SRE Reliability Retainer (Annual)', quantity: 12, unitPrice: 4500, amount: 54000 }
    ],
    subtotal: 139000,
    taxRate: 0,
    total: 139000,
    status: 'SENT',
    notes: 'Valid for 30 days. Includes custom SLA guarantee.'
  },
  {
    id: 'qte_2',
    quoteNumber: 'QTE-2025-105',
    businessId: 'biz_apex',
    clientId: 'cli_2',
    clientName: 'BioGen Discovery Corp',
    issueDate: '2025-03-02',
    expiryDate: '2025-03-25',
    items: [
      { id: 'qi_3', description: 'Automated Regulatory Submission Portal', quantity: 1, unitPrice: 42000, amount: 42000 }
    ],
    subtotal: 42000,
    taxRate: 0,
    total: 42000,
    status: 'ACCEPTED',
    notes: 'Client confirmed approval via email; pending invoice generation.'
  }
];

export const initialProjects: Project[] = [
  {
    id: 'prj_1',
    businessId: 'biz_apex',
    clientId: 'cli_1',
    clientName: 'Nexus Logistics Global',
    title: 'Cloud Orchestration & Auto-Scaling',
    description: 'Modernizing legacy freight telemetry into AWS EKS with GitOps pipelines.',
    budget: 120000,
    spent: 84000,
    progress: 75,
    status: 'IN_PROGRESS',
    startDate: '2024-11-01',
    endDate: '2025-04-30',
    leaderName: 'Omar Refay',
    milestones: [
      { id: 'ms_1', title: 'Infra Architecture Blueprint', done: true, dueDate: '2024-11-30' },
      { id: 'ms_2', title: 'Terraform Cluster Deployment', done: true, dueDate: '2025-01-15' },
      { id: 'ms_3', title: 'Telemetry Data Migration', done: true, dueDate: '2025-02-28' },
      { id: 'ms_4', title: 'Production Cutover & Chaos Testing', done: false, dueDate: '2025-04-15' }
    ]
  },
  {
    id: 'prj_2',
    businessId: 'biz_apex',
    clientId: 'cli_2',
    clientName: 'BioGen Discovery Corp',
    title: 'Genomics Pipeline Microservices',
    description: 'High-throughput protein folding workflow with serverless GPU clusters.',
    budget: 95000,
    spent: 52000,
    progress: 55,
    status: 'IN_PROGRESS',
    startDate: '2025-01-10',
    endDate: '2025-05-30',
    leaderName: 'Elena Rostova',
    milestones: [
      { id: 'ms_5', title: 'Data Pipeline Benchmarking', done: true, dueDate: '2025-02-15' },
      { id: 'ms_6', title: 'GPU Parallel Workers Setup', done: false, dueDate: '2025-03-30' },
      { id: 'ms_7', title: 'HIPAA & Compliance Sign-off', done: false, dueDate: '2025-05-15' }
    ]
  },
  {
    id: 'prj_3',
    businessId: 'biz_kensington',
    clientId: 'cli_3',
    clientName: 'Mayfair Family Trust',
    title: 'Berkeley Square Commercial Refurbishment',
    description: 'BREEAM Excellent commercial retrofit of floors 3-5 into tech suites.',
    budget: 650000,
    spent: 420000,
    progress: 68,
    status: 'IN_PROGRESS',
    startDate: '2024-07-01',
    endDate: '2025-06-30',
    leaderName: 'Sir Charles Sterling',
    milestones: [
      { id: 'ms_8', title: 'Structural Survey & Council Approvals', done: true, dueDate: '2024-09-30' },
      { id: 'ms_9', title: 'HVAC & Smart Metering Installation', done: true, dueDate: '2025-01-20' },
      { id: 'ms_10', title: 'Interior Fit-Out & Tenant Handover', done: false, dueDate: '2025-06-15' }
    ]
  }
];

export const initialTasks: Task[] = [
  {
    id: 'tsk_1',
    businessId: 'biz_apex',
    projectId: 'prj_1',
    projectTitle: 'Cloud Orchestration',
    title: 'Configure Datadog APM alerts for EKS worker nodes',
    description: 'Ensure P99 latency alerts page the on-call engineer automatically.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    assignee: 'Omar Refay',
    dueDate: '2025-03-18',
    createdAt: '2025-03-01'
  },
  {
    id: 'tsk_2',
    businessId: 'biz_apex',
    projectId: 'prj_1',
    projectTitle: 'Cloud Orchestration',
    title: 'Review Nexus MSA indemnification clause with legal',
    description: 'Clarify liability cap for third-party cloud outages.',
    status: 'TODO',
    priority: 'URGENT',
    assignee: 'Omar Refay',
    dueDate: '2025-03-14',
    createdAt: '2025-03-02'
  },
  {
    id: 'tsk_3',
    businessId: 'biz_apex',
    projectId: 'prj_2',
    projectTitle: 'Genomics Pipeline',
    title: 'Verify GPU spot instance termination recovery logic',
    description: 'Ensure jobs checkpoint state to S3 every 60 seconds.',
    status: 'DONE',
    priority: 'MEDIUM',
    assignee: 'Elena Rostova',
    dueDate: '2025-03-05',
    createdAt: '2025-02-20'
  },
  {
    id: 'tsk_4',
    businessId: 'biz_apex',
    projectId: 'prj_2',
    projectTitle: 'Genomics Pipeline',
    title: 'Deliver monthly project burn report to BioGen stakeholders',
    description: 'Prepare presentation deck comparing actual hours to estimated budget.',
    status: 'REVIEW',
    priority: 'MEDIUM',
    assignee: 'Elena Rostova',
    dueDate: '2025-03-15',
    createdAt: '2025-03-04'
  },
  {
    id: 'tsk_5',
    businessId: 'biz_kensington',
    projectId: 'prj_3',
    projectTitle: 'Berkeley Square Refurb',
    title: 'Finalize acoustic glazing contractor contract',
    description: 'Requires contractor sign-off and Westminster council compliance stamp.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    assignee: 'Omar Refay',
    dueDate: '2025-03-22',
    createdAt: '2025-03-05'
  },
  {
    id: 'tsk_6',
    businessId: 'biz_nordic',
    title: 'Renew Q2 Green Bean import logistics clearance with customs',
    description: 'Complete phytosanitary declarations for Costa Rica micro-lot harvest.',
    status: 'TODO',
    priority: 'URGENT',
    assignee: 'Omar Refay',
    dueDate: '2025-03-25',
    createdAt: '2025-03-06'
  }
];

export const initialEmployees: Employee[] = [
  {
    id: 'emp_1',
    businessId: 'biz_apex',
    firstName: 'Alexandre',
    lastName: 'Dubois',
    email: 'alex@apexcloud.io',
    role: 'Principal Cloud Architect',
    department: 'ENGINEERING',
    salary: 195000,
    payFrequency: 'MONTHLY',
    hireDate: '2022-04-01',
    status: 'ACTIVE',
    bankAccount: 'US-JPM-****4912'
  },
  {
    id: 'emp_2',
    businessId: 'biz_apex',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya@apexcloud.io',
    role: 'Senior DevOps & Reliability Engineer',
    department: 'ENGINEERING',
    salary: 165000,
    payFrequency: 'MONTHLY',
    hireDate: '2022-08-15',
    status: 'ACTIVE',
    bankAccount: 'US-WF-****8102'
  },
  {
    id: 'emp_3',
    businessId: 'biz_apex',
    firstName: 'Zack',
    lastName: 'Kowalski',
    email: 'zack@apexcloud.io',
    role: 'Enterprise Solutions Director',
    department: 'SALES',
    salary: 140000,
    payFrequency: 'MONTHLY',
    hireDate: '2023-02-01',
    status: 'ACTIVE',
    bankAccount: 'US-BOA-****9941'
  },
  {
    id: 'emp_4',
    businessId: 'biz_apex',
    firstName: 'Chloe',
    lastName: 'Lin',
    email: 'chloe@apexcloud.io',
    role: 'Operations & HR Coordinator',
    department: 'HR',
    salary: 82000,
    payFrequency: 'MONTHLY',
    hireDate: '2023-06-01',
    status: 'ACTIVE',
    bankAccount: 'US-CHASE-****3310'
  },
  {
    id: 'emp_5',
    businessId: 'biz_kensington',
    firstName: 'Rupert',
    lastName: 'Harrington',
    email: 'r.harrington@kensingtonestates.co.uk',
    role: 'Senior Portfolio Asset Manager',
    department: 'OPERATIONS',
    salary: 95000,
    payFrequency: 'MONTHLY',
    hireDate: '2022-09-01',
    status: 'ACTIVE',
    bankAccount: 'GB-BARC-****1029'
  },
  {
    id: 'emp_6',
    businessId: 'biz_nordic',
    firstName: 'Astrid',
    lastName: 'Lind',
    email: 'astrid@nordicroasters.dk',
    role: 'Head Roaster & Quality Director',
    department: 'OPERATIONS',
    salary: 68000,
    payFrequency: 'MONTHLY',
    hireDate: '2023-02-01',
    status: 'ACTIVE',
    bankAccount: 'DK-DANSKE-****5520'
  }
];

export const initialPayrollRuns: PayrollRun[] = [
  {
    id: 'pr_1',
    businessId: 'biz_apex',
    period: 'February 2025',
    runDate: '2025-02-28',
    totalGross: 48500,
    totalTax: 12125,
    totalNet: 36375,
    status: 'PAID',
    employeesCount: 4
  },
  {
    id: 'pr_2',
    businessId: 'biz_apex',
    period: 'March 2025',
    runDate: '2025-03-31',
    totalGross: 48500,
    totalTax: 12125,
    totalNet: 36375,
    status: 'APPROVED',
    employeesCount: 4
  },
  {
    id: 'pr_3',
    businessId: 'biz_kensington',
    period: 'February 2025',
    runDate: '2025-02-28',
    totalGross: 7916.67,
    totalTax: 2100,
    totalNet: 5816.67,
    status: 'PAID',
    employeesCount: 1
  }
];

export const initialLeaveRequests: LeaveRequest[] = [
  {
    id: 'lr_1',
    businessId: 'biz_apex',
    employeeId: 'emp_2',
    employeeName: 'Priya Sharma',
    type: 'VACATION',
    startDate: '2025-04-10',
    endDate: '2025-04-18',
    days: 7,
    status: 'PENDING'
  },
  {
    id: 'lr_2',
    businessId: 'biz_apex',
    employeeId: 'emp_1',
    employeeName: 'Alexandre Dubois',
    type: 'PERSONAL',
    startDate: '2025-03-24',
    endDate: '2025-03-25',
    days: 2,
    status: 'APPROVED'
  }
];

export const initialExpenses: Expense[] = [
  {
    id: 'exp_1',
    businessId: 'biz_apex',
    title: 'Amazon Web Services Production Infrastructure',
    amount: 14200,
    category: 'SOFTWARE',
    vendor: 'Amazon Web Services Inc.',
    date: '2025-03-01',
    status: 'APPROVED',
    paidBy: 'Corporate Amex',
    taxDeductible: true,
    notes: 'Production VPC, RDS Aurora, and NAT gateways.'
  },
  {
    id: 'exp_2',
    businessId: 'biz_apex',
    title: 'San Francisco Executive Suite & Coworking',
    amount: 6800,
    category: 'RENT',
    vendor: 'Howard St. Commercial Partners',
    date: '2025-03-01',
    status: 'APPROVED',
    paidBy: 'Direct Debit Checking',
    taxDeductible: true
  },
  {
    id: 'exp_3',
    businessId: 'biz_apex',
    title: 'Enterprise GitHub + Datadog + Slack Suite',
    amount: 3200,
    category: 'SOFTWARE',
    vendor: 'Developer Tools Consolidated',
    date: '2025-02-28',
    status: 'APPROVED',
    paidBy: 'Corporate Amex',
    taxDeductible: true
  },
  {
    id: 'exp_4',
    businessId: 'biz_apex',
    title: 'Corporate Legal Advisory & Trademark Filing',
    amount: 8500,
    category: 'LEGAL',
    vendor: 'Gunderson Dettmer LLP',
    date: '2025-02-15',
    status: 'APPROVED',
    paidBy: 'Wire Transfer',
    taxDeductible: true,
    notes: 'Q1 corporate governance & IP protection.'
  },
  {
    id: 'exp_5',
    businessId: 'biz_kensington',
    title: 'Mayfair Building Structural Insurance & Security',
    amount: 4200,
    category: 'RENT',
    vendor: 'Allianz UK Commercial',
    date: '2025-03-01',
    status: 'APPROVED',
    paidBy: 'Barclays Commercial Direct',
    taxDeductible: true
  },
  {
    id: 'exp_6',
    businessId: 'biz_nordic',
    title: 'Specialty Coffee Green Beans Consignment (4,000kg)',
    amount: 26000,
    category: 'COGS',
    vendor: 'Nordic Origin Partners SAS',
    date: '2025-02-18',
    status: 'APPROVED',
    paidBy: 'SEPA Direct Wire',
    taxDeductible: true
  }
];

export const initialPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po_1',
    poNumber: 'PO-2025-091',
    businessId: 'biz_apex',
    vendor: 'Apple Enterprise Business',
    itemsSummary: '3x MacBook Pro M4 Max (64GB RAM) for engineering team',
    total: 10497,
    status: 'APPROVED',
    requestDate: '2025-03-02'
  },
  {
    id: 'po_2',
    poNumber: 'PO-2025-092',
    businessId: 'biz_nordic',
    vendor: 'Loring Smart Roast Inc.',
    itemsSummary: 'Precision Roaster Thermal Thermocouple Kit & Chaff Collector',
    total: 4800,
    status: 'SUBMITTED',
    requestDate: '2025-03-04'
  }
];

export const initialBankAccounts: BankAccount[] = [
  {
    id: 'ba_1',
    businessId: 'biz_apex',
    bankName: 'J.P. Morgan Chase Commercial',
    accountNumber: '****-9481',
    accountType: 'OPERATING',
    balance: 1850000,
    currency: 'USD'
  },
  {
    id: 'ba_2',
    businessId: 'biz_apex',
    bankName: 'Silicon Valley Bank (First Citizens)',
    accountNumber: '****-3102',
    accountType: 'TREASURY',
    balance: 600000,
    currency: 'USD'
  },
  {
    id: 'ba_3',
    businessId: 'biz_kensington',
    bankName: 'Barclays Corporate UK',
    accountNumber: '****-7721',
    accountType: 'OPERATING',
    balance: 1120000,
    currency: 'GBP'
  },
  {
    id: 'ba_4',
    businessId: 'biz_nordic',
    bankName: 'Danske Bank Commercial',
    accountNumber: '****-4091',
    accountType: 'OPERATING',
    balance: 480000,
    currency: 'EUR'
  }
];

export const initialInventory: InventoryItem[] = [
  {
    id: 'inv_item_1',
    businessId: 'biz_nordic',
    sku: 'NR-ETH-YIRG-1KG',
    name: 'Ethiopia Yirgacheffe Washed Beans (1kg)',
    category: 'Coffee Beans',
    quantity: 340,
    unitCost: 14.5,
    retailPrice: 28.0,
    reorderPoint: 100,
    warehouse: 'Copenhagen Central Hub',
    lastRestocked: '2025-02-15'
  },
  {
    id: 'inv_item_2',
    businessId: 'biz_nordic',
    sku: 'NR-COL-GEISHA-250G',
    name: 'Colombia Huila Geisha Reserve (250g)',
    category: 'Reserve Series',
    quantity: 85,
    unitCost: 12.0,
    retailPrice: 34.0,
    reorderPoint: 40,
    warehouse: 'Copenhagen Central Hub',
    lastRestocked: '2025-02-28'
  },
  {
    id: 'inv_item_3',
    businessId: 'biz_nordic',
    sku: 'NR-ACC-SCALE-PRO',
    name: 'Acaia Lunar Precision Espresso Scale',
    category: 'Hardware & Gear',
    quantity: 18,
    unitCost: 140.0,
    retailPrice: 250.0,
    reorderPoint: 25,
    warehouse: 'Copenhagen Central Hub',
    lastRestocked: '2025-01-10'
  },
  {
    id: 'inv_item_4',
    businessId: 'biz_nordic',
    sku: 'NR-ACC-DRIPPER-SS',
    name: 'Nordic Minimalist Dripper (Matte Titanium)',
    category: 'Hardware & Gear',
    quantity: 14,
    unitCost: 28.0,
    retailPrice: 65.0,
    reorderPoint: 30,
    warehouse: 'Copenhagen Central Hub',
    lastRestocked: '2025-01-05'
  }
];

// Personal Wealth ("Manage Everything You Own")
export const initialPersonalAssets: PersonalAsset[] = [
  {
    id: 'pa_1',
    title: 'Primary Residence (Pacific Heights Penthouse)',
    category: 'REAL_ESTATE',
    valuation: 4200000,
    institution: 'First Republic Trust Title',
    notes: 'Appraised in Q4 2024. 3,400 sq ft.',
    lastUpdated: '2025-01-15'
  },
  {
    id: 'pa_2',
    title: 'Lake Tahoe Alpine Chalet',
    category: 'REAL_ESTATE',
    valuation: 1950000,
    institution: 'Placer County Records',
    notes: 'Vacation home & seasonal rental.',
    lastUpdated: '2024-11-20'
  },
  {
    id: 'pa_3',
    title: 'Morgan Stanley Global Equities & Index Portfolio',
    category: 'STOCK_PORTFOLIO',
    valuation: 2150000,
    institution: 'Morgan Stanley Wealth Management',
    notes: 'Diversified S&P 500, MSCI World & Tech Dividend ETFs.',
    lastUpdated: '2025-03-01'
  },
  {
    id: 'pa_4',
    title: 'Personal Treasury & Liquid Cash Accounts',
    category: 'CASH_BANK',
    valuation: 820000,
    institution: 'J.P. Morgan Private Bank',
    notes: 'Yielding 4.85% in Treasury Money Market Fund.',
    lastUpdated: '2025-03-01'
  },
  {
    id: 'pa_5',
    title: 'Digital Assets Cold Storage (BTC & ETH)',
    category: 'CRYPTO',
    valuation: 450000,
    institution: 'Ledger Enterprise Multi-Sig',
    notes: '3.5 BTC + 40 ETH stored off-exchange.',
    lastUpdated: '2025-03-05'
  },
  {
    id: 'pa_6',
    title: 'Porsche 911 GT3 Touring (2024)',
    category: 'VEHICLE',
    valuation: 240000,
    institution: 'Porsche Financial Services',
    notes: 'Clean title, insured with Hagerty.',
    lastUpdated: '2025-01-10'
  }
];

export const initialPersonalLiabilities: PersonalLiability[] = [
  {
    id: 'pl_1',
    title: 'Pacific Heights Mortgage',
    category: 'MORTGAGE',
    remainingBalance: 1650000,
    monthlyPayment: 8400,
    interestRate: 3.15,
    lender: 'J.P. Morgan Private Bank'
  },
  {
    id: 'pl_2',
    title: 'Lake Tahoe Chalet Mortgage',
    category: 'MORTGAGE',
    remainingBalance: 780000,
    monthlyPayment: 4200,
    interestRate: 4.10,
    lender: 'Wells Fargo Home Lending'
  }
];

export const initialIncomeDraws: PersonalIncomeDraw[] = [
  {
    id: 'pid_1',
    businessId: 'biz_apex',
    businessName: 'Apex Cloud Technologies Inc.',
    source: 'Quarterly Shareholder Dividend',
    amount: 120000,
    type: 'DIVIDEND',
    date: '2024-12-15',
    status: 'COMPLETED'
  },
  {
    id: 'pid_2',
    businessId: 'biz_kensington',
    businessName: 'Kensington Estates Ltd.',
    source: 'Mayfair Rental Yield Payout',
    amount: 60000,
    type: 'PROFIT_DISTRIBUTION',
    date: '2024-11-28',
    status: 'COMPLETED'
  },
  {
    id: 'pid_3',
    businessId: 'biz_nordic',
    businessName: 'Nordic Roasters & Goods',
    source: 'Annual Owner Draw',
    amount: 35000,
    type: 'DIVIDEND',
    date: '2024-12-20',
    status: 'COMPLETED'
  },
  {
    id: 'pid_4',
    businessId: 'biz_apex',
    businessName: 'Apex Cloud Technologies Inc.',
    source: 'Executive Base Salary (Monthly)',
    amount: 18000,
    type: 'SALARY',
    date: '2025-02-28',
    status: 'COMPLETED'
  }
];

export const initialVaultDocuments: VaultDocument[] = [
  {
    id: 'doc_1',
    businessId: 'biz_apex',
    isPersonal: false,
    title: 'Apex Cloud Technologies - Certificate of Incorporation (Delaware)',
    category: 'LEGAL',
    size: '1.8 MB',
    uploadDate: '2021-03-15',
    fileType: 'PDF'
  },
  {
    id: 'doc_2',
    businessId: 'biz_apex',
    isPersonal: false,
    title: 'Shareholder Agreement & Voting Rights Bylaws (Apex)',
    category: 'CONTRACT',
    size: '4.2 MB',
    uploadDate: '2023-01-10',
    fileType: 'PDF'
  },
  {
    id: 'doc_3',
    businessId: 'biz_apex',
    isPersonal: false,
    title: 'IRS Form 1120 Corporate Tax Return FY 2024',
    category: 'TAX',
    size: '6.5 MB',
    uploadDate: '2025-02-20',
    fileType: 'PDF'
  },
  {
    id: 'doc_4',
    businessId: 'biz_kensington',
    isPersonal: false,
    title: 'Kensington Estates HM Land Registry Title Deeds',
    category: 'LEGAL',
    size: '12.4 MB',
    uploadDate: '2022-06-25',
    fileType: 'PDF'
  },
  {
    id: 'doc_5',
    businessId: undefined,
    isPersonal: true,
    title: 'Refay Family Revocable Living Trust & Asset Distribution Will',
    category: 'PERSONAL_ESTATE',
    size: '5.1 MB',
    uploadDate: '2024-10-15',
    fileType: 'PDF'
  },
  {
    id: 'doc_6',
    businessId: undefined,
    isPersonal: true,
    title: 'Consolidated Personal Tax Return Form 1040 (FY 2024)',
    category: 'TAX',
    size: '3.9 MB',
    uploadDate: '2025-02-18',
    fileType: 'PDF'
  }
];

export const initialMessages: Message[] = [
  {
    id: 'msg_1',
    businessId: 'biz_apex',
    channel: '#executive-board',
    senderName: 'Elena Rostova',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    text: 'Omar, March cash collections reached $340k already. Our runway is sitting comfortably at 24+ months.',
    timestamp: '10:45 AM'
  },
  {
    id: 'msg_2',
    businessId: 'biz_apex',
    channel: '#executive-board',
    senderName: 'Omar Refay',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    text: 'Great work Elena. Let us make sure the Nexus Logistics overdue invoice ($32.5k) gets followed up today.',
    timestamp: '11:02 AM'
  },
  {
    id: 'msg_3',
    businessId: 'biz_apex',
    channel: '#engineering-ops',
    senderName: 'Alexandre Dubois',
    senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    text: 'Kubernetes cluster v1.30 upgrade tested in staging with zero downtime. Scheduled for prod this Sunday.',
    timestamp: '11:30 AM'
  },
  {
    id: 'msg_4',
    businessId: 'biz_kensington',
    channel: '#property-deals',
    senderName: 'Sir Charles Sterling',
    senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    text: 'Westminster Council just approved the solar roof panel permits for Berkeley Square. Refurbishment on track.',
    timestamp: 'Yesterday'
  }
];

export const initialNotifications: AppNotification[] = [
  {
    id: 'notif_1',
    businessId: 'biz_apex',
    title: 'Overdue Invoice Alert',
    message: 'Invoice #INV-2025-001 ($32,500) to Nexus Logistics is past due.',
    type: 'ALERT',
    read: false,
    timestamp: '2 hours ago',
    targetTab: 'billing'
  },
  {
    id: 'notif_2',
    businessId: 'biz_nordic',
    title: 'Low Stock Notification',
    message: 'Acaia Precision Scales (18 units left) has fallen below reorder point (25 units).',
    type: 'WARNING',
    read: false,
    timestamp: '5 hours ago',
    targetTab: 'inventory'
  },
  {
    id: 'notif_3',
    businessId: 'biz_apex',
    title: 'Quote Accepted',
    message: 'BioGen Discovery Corp accepted Quotation #QTE-2025-105 ($42,000).',
    type: 'SUCCESS',
    read: false,
    timestamp: '1 day ago',
    targetTab: 'billing'
  },
  {
    id: 'notif_4',
    businessId: 'biz_kensington',
    title: 'Quarterly Tax Filing Window Open',
    message: 'UK HMRC VAT return for Q1 2025 is due in 28 days.',
    type: 'INFO',
    read: true,
    timestamp: '2 days ago',
    targetTab: 'finance'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'log_1',
    businessId: 'biz_apex',
    businessName: 'Apex Cloud Technologies Inc.',
    user: 'Omar Refay',
    action: 'Generated Quotation QTE-2025-104 for Nexus Logistics',
    entity: 'Billing / Quotation',
    timestamp: '2025-03-05 14:22:10',
    ipAddress: '192.168.1.104'
  },
  {
    id: 'log_2',
    businessId: 'biz_apex',
    businessName: 'Apex Cloud Technologies Inc.',
    user: 'Elena Rostova',
    action: 'Approved Payroll Run for March 2025 ($48,500 gross)',
    entity: 'Payroll / HR',
    timestamp: '2025-03-04 16:45:00',
    ipAddress: '192.168.1.18'
  },
  {
    id: 'log_3',
    businessId: 'biz_kensington',
    businessName: 'Kensington Estates Ltd.',
    user: 'Omar Refay',
    action: 'Issued Invoice INV-2025-K01 (£40,000) to Mayfair Family Trust',
    entity: 'Billing / Invoice',
    timestamp: '2025-03-01 09:12:44',
    ipAddress: '192.168.1.104'
  },
  {
    id: 'log_4',
    businessId: 'biz_nordic',
    businessName: 'Nordic Roasters & Goods',
    user: 'Omar Refay',
    action: 'Restocked Inventory: NR-COL-GEISHA-250G (+50 units)',
    entity: 'Inventory',
    timestamp: '2025-02-28 11:30:19',
    ipAddress: '192.168.1.104'
  },
  {
    id: 'log_5',
    businessId: undefined,
    businessName: 'Personal Wealth Portfolio',
    user: 'Omar Refay',
    action: 'Updated Pacific Heights Real Estate Valuation to $4,200,000',
    entity: 'Personal Asset',
    timestamp: '2025-01-15 17:05:22',
    ipAddress: '192.168.1.104'
  }
];
