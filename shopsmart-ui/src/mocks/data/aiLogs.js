/**
 * Mock AI logs dataset per CONTRACT Section 47.
 * Contains SHOP and POLICY interactions with exact response structures.
 */

export const INITIAL_AI_LOGS = [
  {
    id: 'log-001',
    userId: 'usr_prime',
    userName: 'Prime User',
    type: 'SHOP',
    question: 'I need a laptop under $1000 with 16GB RAM for everyday tasks',
    response: {
      interpretedRequirement: 'Laptop under $1000 with at least 16GB RAM for productivity and multitasking',
      budget: 1000,
      recommendations: [
        {
          productId: 'LAP101',
          productName: 'Dell Inspiron 15',
          reason: 'Intel Core i7-1355U with 16GB RAM and 512GB SSD priced at $899 fits your $1000 budget perfectly',
          availability: 'IN_STOCK',
        },
        {
          productId: 'LAP102',
          productName: 'Lenovo IdeaPad Gaming 3',
          reason: 'Dedicated NVIDIA RTX 4050 GPU and 16GB RAM at $949 provides outstanding performance under $1000',
          availability: 'IN_STOCK',
        },
        {
          productId: 'LAP103',
          productName: 'HP Pavilion 15',
          reason: 'AMD Ryzen 7 7730U with 16GB RAM at $829 delivers great value within your budget',
          availability: 'LOW_STOCK',
        },
      ],
      clarifyingQuestion: null,
    },
    confidence: null, // Per section 33: confidence is NULL for SHOP rows
    sources: null,
    latencyMs: 540,
    createdAt: '2026-10-10T12:00:00Z',
  },
  {
    id: 'log-002',
    userId: 'usr_prime',
    userName: 'Prime User',
    type: 'POLICY',
    question: 'Can I return an opened laptop?',
    response: {
      answer: 'Opened laptops can be returned within 7 days of delivery provided there is no physical damage, all accessories and original packaging are included, and a factory reset has been performed.',
      confidence: 'HIGH',
      sources: [
        {
          document: 'Laptop Return Policy',
          section: 'Opened Products',
          version: 'v2026.1',
        },
      ],
      followUpRequired: false,
    },
    confidence: 'HIGH',
    sources: [
      {
        document: 'Laptop Return Policy',
        section: 'Opened Products',
        version: 'v2026.1',
      },
    ],
    latencyMs: 420,
    createdAt: '2026-10-10T12:05:00Z',
  },
  {
    id: 'log-003',
    userId: 'usr_basic',
    userName: 'Basic User',
    type: 'POLICY',
    question: 'When will I get my refund after returning?',
    response: {
      answer: 'Refunds are processed within 5-7 business days after the returned item passes inspection (which takes 1-2 business days). For Prime and Premium members, refunds initiate at pickup scan and credit within 2-3 business days.',
      confidence: 'MEDIUM',
      sources: [
        {
          document: 'Refund Policy',
          section: 'Inspection and Processing',
          version: 'v2026.1',
        },
      ],
      followUpRequired: false,
    },
    confidence: 'MEDIUM',
    sources: [
      {
        document: 'Refund Policy',
        section: 'Inspection and Processing',
        version: 'v2026.1',
      },
    ],
    latencyMs: 465,
    createdAt: '2026-10-10T12:10:00Z',
  },
  {
    id: 'log-004',
    userId: 'usr_prime',
    userName: 'Prime User',
    type: 'POLICY',
    question: 'Who won the cricket world cup?',
    response: {
      answer: 'This information is not available in the approved policy documents.',
      confidence: 'LOW',
      sources: [],
      followUpRequired: true,
    },
    confidence: 'LOW',
    sources: [],
    latencyMs: 310,
    createdAt: '2026-10-10T12:15:00Z',
  },
  {
    id: 'log-005',
    userId: 'usr_basic',
    userName: 'Basic User',
    type: 'SHOP',
    question: 'Recommend something cool',
    response: {
      interpretedRequirement: 'Looking for product recommendations without specified category or budget',
      budget: null,
      recommendations: [],
      clarifyingQuestion: 'What type of product are you looking for, and do you have a specific budget in mind?',
    },
    confidence: null,
    sources: null,
    latencyMs: 380,
    createdAt: '2026-10-10T12:20:00Z',
  },
];

let mockAiLogs = [...INITIAL_AI_LOGS];
let logSequence = 6;

export function recordAiLog(entry) {
  const newLog = {
    id: `log-${String(logSequence++).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    ...entry,
  };
  mockAiLogs.unshift(newLog);
  return newLog;
}

export function listAiLogs({ page = 1, size = 12, type } = {}) {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const sizeNum = Math.min(50, Math.max(1, parseInt(size, 10) || 12));

  let filtered = [...mockAiLogs];
  if (type) {
    const normType = String(type).toUpperCase();
    filtered = filtered.filter((l) => l.type === normType);
  }

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / sizeNum) || 1;
  const start = (pageNum - 1) * sizeNum;
  const items = filtered.slice(start, start + sizeNum);

  return {
    items,
    page: pageNum,
    totalPages,
    totalItems,
  };
}
