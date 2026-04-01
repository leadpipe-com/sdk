export type TopicType = "b2b" | "b2c" | "both";
export type AudienceLifecycleStatus = "draft" | "active" | "paused";
export type AudienceRunStatus = "ready" | "materializing" | "failed" | "none";
export type LeadpipeBooleanString = "y" | "n" | null;

export interface TopicRecord {
  topicId: number;
  topicName: string;
  type: TopicType;
  industry: string;
  category: string;
}

export interface TopicInventoryFilters {
  type: TopicType | null;
  industry: string | null;
  category: string | null;
  q: string | null;
}

export interface TopicInventoryMeta {
  count: number;
  total: number;
  filters: TopicInventoryFilters;
}

export interface TopicInventoryResponse {
  data: TopicRecord[];
  meta: TopicInventoryMeta;
}

export interface TopicFacetValue {
  value: string;
  count: number;
}

export interface TopicInventoryFacetsResponse {
  data: {
    types: TopicFacetValue[];
    industries: TopicFacetValue[];
    categories: TopicFacetValue[];
    total: number;
  };
}

export interface TopicSearchParams {
  q: string;
  industry?: string;
  type?: TopicType;
  limit?: number;
}

export interface TopicSearchResponse {
  data: TopicRecord[];
}

export interface TopicTrendPoint {
  date: string;
  topicName: string;
  type: string;
  industry: string;
  category: string;
  uniqueAudience: number;
  totalSignals: number;
  avgScore: number;
  highAudience: number;
  mediumAudience: number;
  lowAudience: number;
}

export interface TopicTrendResponse {
  data: TopicTrendPoint[];
}

export interface TopicComparePoint {
  date: string;
  uniqueAudience: number;
  totalSignals: number;
  avgScore: number;
  highAudience: number;
  mediumAudience: number;
  lowAudience: number;
}

export interface TopicCompareItem {
  topicId: number;
  topicName: string;
  data: TopicComparePoint[];
}

export interface TopicCompareResponse {
  data: TopicCompareItem[];
}

export interface TopicMover {
  topicId: number;
  topicName: string;
  type: string;
  industry: string;
  todayAudience: number;
  yesterdayAudience: number;
  pctChange: number;
}

export interface TopMoversResponse {
  data: TopicMover[];
}

export interface SiteTopicMatch {
  topicId: number;
  topicName: string;
  type: string;
  industry: string;
  category: string;
  similarity: number;
  matchedKeyword: string;
}

export interface SiteTopicsResponse {
  data: {
    company: string | null;
    summary: string | null;
    keywords: string[];
    topics: SiteTopicMatch[];
    contentHash?: string;
  };
}

export interface AudienceFilters {
  companyIndustry?: string[];
  seniority?: string[];
  companySize?: string[];
  department?: string[];
  state?: string;
  companyRevenueRange?: string[];
  ageRange?: string[];
  gender?: string;
  isB2b?: "y" | "n";
  jobTitle?: string;
  hasBusinessEmail?: boolean;
  hasPersonalEmail?: boolean;
  hasLinkedin?: boolean;
  hasPhone?: boolean;
  companyDomain?: string;
  companyName?: string;
}

export interface AudienceConfig {
  topicIds: number[];
  minScore?: number;
  maxScore?: number;
  minTopicOverlap?: number;
  filters?: AudienceFilters;
  sourceUrl?: string;
}

export interface AudiencePreviewInput {
  topicIds: number[];
  minScore?: number;
  maxScore?: number;
  minTopicOverlap?: number;
  filters?: AudienceFilters;
}

export interface AudiencePreviewSample {
  intentScore: number;
  topicId: number | null;
  topicName: string | null;
  matchedTopicIds: number[] | null;
  topicOverlap: number | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  ageRange: string | null;
  gender: string | null;
  headline: null;
  linkedinUrl: string | null;
  incomeRange: null;
  netWorth: null;
  isB2b: LeadpipeBooleanString;
  isB2c: LeadpipeBooleanString;
  city: string | null;
  state: string | null;
  jobTitle: string | null;
  seniority: string | null;
  department: string | null;
  company: string | null;
  companyDomain: null;
  companyIndustry: string | null;
  companySize: string | null;
  companyRevenue: null;
  companyRevenueRange: string | null;
  companyLinkedinUrl: null;
  companyNaics: null;
  companySic: null;
  directNumbers: string | null;
  businessEmail: string | null;
  emailHashes: {
    sha256: string | null;
    sha1: null;
    md5: null;
  };
  masked: boolean;
}

export interface AudiencePreviewResponse {
  data: {
    totalCount: number;
    sample: AudiencePreviewSample[];
    previewKey: string;
    dataDate: string;
  };
}

export interface AudienceQueryInput extends AudiencePreviewInput {
  audienceId?: string;
  date?: string;
  limit?: number;
  cursor?: string | null;
}

export interface LeadpipeEmailHashes {
  sha256: string | null;
  sha1: string | null;
  md5: string | null;
}

export interface AudienceQueryPerson {
  intentScore: number;
  topicId: number | null;
  topicName: string | null;
  matchedTopicIds: number[] | null;
  topicOverlap: number | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  ageRange: string | null;
  gender: string | null;
  headline: string | null;
  photoUrl: string | null;
  linkedinUrl: string | null;
  incomeRange: string | null;
  netWorth: string | null;
  hasChildren: string | null;
  isHomeowner: string | null;
  isMarried: string | null;
  isB2b: LeadpipeBooleanString;
  isB2c: LeadpipeBooleanString;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  personalCountry: string | null;
  jobTitle: string | null;
  jobTitleNormalized: string | null;
  seniority: string | null;
  department: string | null;
  subdepartments: string | null;
  jobFunctions: string | null;
  company: string | null;
  companyDomain: string | null;
  companyIndustry: string | null;
  companySize: string | null;
  companyRevenue: number | null;
  companyRevenueRange: string | null;
  companyCity: string | null;
  companyState: string | null;
  companyZip: string | null;
  country: string | null;
  companyLinkedinUrl: string | null;
  companyDescription: string | null;
  companyNaics: string | null;
  companySic: string | null;
  phones: string | null;
  directNumbers: string | null;
  mobilePhones: string | null;
  personalPhones: string | null;
  emails: string | null;
  personalEmail: string | null;
  personalEmails: string | null;
  businessEmail: string | null;
  businessEmails: string | null;
  emailHashes: LeadpipeEmailHashes;
  allEmailHashes: LeadpipeEmailHashes;
}

export type AudienceRecord = AudienceQueryPerson;

export interface AudienceMeta {
  count: number;
  totalCount: number;
  nextCursor: string | null;
  hasMore: boolean;
  status: "ready";
  cacheKey: string;
  dataDate: string | null;
}

export interface AudienceResponse {
  data: AudienceRecord[];
  meta: AudienceMeta;
}

export interface AudienceMaterializingResponse {
  data: Record<string, never>[];
  meta: {
    count: number;
    totalCount: number;
    nextCursor: string | null;
    hasMore: boolean;
    status: "materializing";
    cacheKey: string;
    dataDate: string | null;
  };
}

export interface AudienceDeleteResponse {
  data: {
    deleted: boolean;
  };
}

export interface AudienceListItem {
  id: string;
  name: string;
  status: AudienceLifecycleStatus;
  config: AudienceConfig;
  topics: {
    id: number;
    name: string;
  }[];
  audienceSize: number | null;
  lastRefreshedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface AudienceListResponse {
  data: AudienceListItem[];
}

export interface AudienceCreateInput {
  name: string;
  config: AudienceConfig;
}

export interface AudienceCreatedResponse {
  data: {
    id: string;
    name: string;
    status: string;
    config: AudienceConfig;
    audienceSize: number | null;
    lastRefreshedAt: string | null;
    createdAt: string | null;
  };
}

export interface AudienceDetailResponse {
  data: {
    id: string;
    name: string;
    status: AudienceLifecycleStatus;
    config: AudienceConfig;
    topics: {
      id: number;
      name: string;
    }[];
    audienceSize: number | null;
    lastRefreshedAt: string | null;
    createdAt: string | null;
    updatedAt: string | null;
  };
}

export interface AudienceUpdateInput {
  name?: string;
  status?: AudienceLifecycleStatus;
  config?: AudienceConfig;
  audienceSize?: number;
}

export interface AudienceUpdatedResponse {
  data: {
    id: string;
    name: string;
    status: string;
    config: AudienceConfig;
    audienceSize: number | null;
    lastRefreshedAt: string | null;
    updatedAt: string | null;
  };
}

export interface AudienceStatusResponse {
  data: {
    status: AudienceRunStatus;
    totalCount: number;
    dataDate: string | null;
    runId: string | null;
  };
}

export interface AudienceResultsPerson {
  personId: string;
  intentScore: number;
  topicId: number;
  topicName: string | null;
  matchedTopicIds: number[] | null;
  topicOverlap: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  jobTitle: string | null;
  jobTitleNormalized: string | null;
  seniority: string | null;
  department: string | null;
  subdepartments: string | null;
  jobFunctions: string | null;
  headline: string | null;
  company: string | null;
  companyDomain: string | null;
  companyIndustry: string | null;
  companySize: string | null;
  companyRevenue: number;
  companyRevenueRange: string | null;
  companyCity: string | null;
  companyState: string | null;
  companyZip: string | null;
  companyCountry: string | null;
  companyLinkedinUrl: string | null;
  companyDescription: string | null;
  companyNaics: string | null;
  companySic: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  address: string | null;
  personalCountry: string | null;
  linkedinUrl: string | null;
  photoUrl: string | null;
  ageRange: string | null;
  gender: string | null;
  incomeRange: string | null;
  netWorth: string | null;
  hasChildren: string | null;
  isHomeowner: string | null;
  isMarried: string | null;
  isB2b: LeadpipeBooleanString;
  isB2c: LeadpipeBooleanString;
  phones: string | null;
  directNumbers: string | null;
  mobilePhones: string | null;
  personalPhones: string | null;
  emails: string | null;
  personalEmail: string | null;
  personalEmails: string | null;
  businessEmails: string | null;
  businessEmail: string | null;
}

export interface AudienceResultsResponse {
  data: AudienceResultsPerson[];
  meta: {
    count: number;
    totalCount: number;
    nextCursor: string | null;
    hasMore: boolean;
    status: "ready";
    dataDate: string;
  };
}

export interface AudienceResultsMaterializingResponse {
  data: unknown[];
  meta: {
    status: "materializing";
    dataDate: string | null;
  };
}

export interface AudienceRunsResponse {
  data: {
    cacheKey: string;
    dataDate: string;
    status: string;
    totalCount: number;
    createdAt: string;
    hasExport: boolean;
  }[];
}

export interface AudienceStatsResponse {
  data: {
    total: number;
    dataDate: string;
    fields: Record<string, number>;
  };
}

export interface AudienceExportResponse {
  data: {
    downloadUrl: string;
    fileName: string;
    rows: number;
    dataDate: string;
    expiresIn: string;
    cached: boolean;
  };
}

export interface AudienceFiltersResponse {
  data: {
    seniority: string[];
    companyIndustry: string[];
    companySize: string[];
    department: string[];
    state: string[];
    companyRevenueRange: string[];
    ageRange: string[];
    gender: string[];
  };
}

export interface AudiencePreviewRequest extends AudiencePreviewInput {}

export interface AudienceQueryRequest extends AudienceQueryInput {}

export interface AudienceStatusParams {
  date?: string;
}

export interface AudienceResultsParams extends AudienceStatusParams {
  limit?: number;
  cursor?: string;
}

export interface AudienceStatsParams {
  date?: string;
}

export interface AudienceExportParams {
  date?: string;
}

export interface TopicsListParams {
  type?: TopicType;
  industry?: string;
  category?: string;
  q?: string;
}

export interface TopicsMoversParams {
  limit?: number;
  direction?: "up" | "down";
  type?: TopicType;
  industry?: string;
}

export interface TopicsTrendParams {
  topicId: number;
}

export interface TopicsCompareInput {
  topicIds: number[];
}

export interface TopicsAnalyzeInput {
  url: string;
}

export interface LeadpipeOptions {
  apiKey?: string;
  bearerToken?: string;
  baseUrl?: string;
  fetch?: typeof fetch;
}

export interface WaitUntilReadyOptions {
  date?: string;
  intervalMs?: number;
  signal?: AbortSignal;
  timeoutMs?: number;
}
