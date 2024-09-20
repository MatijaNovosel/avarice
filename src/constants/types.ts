export type mapType = "satellite" | "terrain" | "hybrid" | "roadmap";

export type Dictionary<T> = { [key: string]: T };

export type alertType = "success" | "info" | "warning" | "error" | undefined;

// LANGUAGE TYPES
export enum LanguageKind {
  Croatian = 1,
  English = 2
}

export enum PartyRoleTypeKind {
  Employee = 1,
  Employer = 2,
  Team = 3,
  TeamMember = 4,
  Organization = 5,
  OrganizationDepartment = 6,
  OrganizationPost = 7,
  OrganizationExpertTeam = 8,
  OrganizationSpecialistTeam = 9,
  Customer = 13,
  Partner = 14,
  Supplier = 15,
  Buyer = 16,
  Competitor = 17,
  Vendor = 18,
  ServiceProvider = 19,
  Intermediary = 20,
  ServiceProviderServiceAccount = 25,
  PlatformOwner = 26,
  Member = 27,
  MemberBusinessAdministrator = 28,
  MemberBusinessApprover = 29,
  OrganizationPostCEO = 30,
  Backoffice = 31,
  Administrator = 1000
}

export enum CustomerRequestStatusType {
  Open = 1,
  Resolved = 2,
  Declined = 3,
  New = 4,
  WaitingForResponse = 5
}
