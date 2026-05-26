import { AppRole, ROLES } from "./rbac";

export function canViewInvestors(role: AppRole) {
  return ([
    ROLES.SUPER_ADMIN,
    ROLES.GP_PARTNER,
    ROLES.CIO,
    ROLES.INVESTMENT_MANAGER,
    ROLES.ANALYST,
  ] as AppRole[]).includes(role);
}

export function canManageAssets(role: AppRole) {
  return ([
    ROLES.SUPER_ADMIN,
    ROLES.GP_PARTNER,
    ROLES.CIO,
    ROLES.INVESTMENT_MANAGER,
    ROLES.ANALYST,
    ROLES.OPERATING_PARTNER,
  ] as AppRole[]).includes(role);
}

export function canManageDataRooms(role: AppRole) {
  return ([
    ROLES.SUPER_ADMIN,
    ROLES.GP_PARTNER,
    ROLES.INVESTMENT_MANAGER,
    ROLES.LEGAL,
  ] as AppRole[]).includes(role);
}

export function canUploadDocuments(role: AppRole) {
  return ([
    ROLES.SUPER_ADMIN,
    ROLES.GP_PARTNER,
    ROLES.INVESTMENT_MANAGER,
    ROLES.LEGAL,
    ROLES.OPERATING_PARTNER,
  ] as AppRole[]).includes(role);
}

export function canApproveIC(role: AppRole) {
  return ([ROLES.SUPER_ADMIN, ROLES.GP_PARTNER, ROLES.CIO] as AppRole[]).includes(role);
}

export function canExportReports(role: AppRole) {
  return ([
    ROLES.SUPER_ADMIN,
    ROLES.GP_PARTNER,
    ROLES.CIO,
    ROLES.INVESTMENT_MANAGER,
  ] as AppRole[]).includes(role);
}

export function canViewLPContent(role: AppRole) {
  return ([
    ROLES.SUPER_ADMIN,
    ROLES.GP_PARTNER,
    ROLES.CIO,
    ROLES.INVESTMENT_MANAGER,
    ROLES.ANALYST,
    ROLES.LP,
  ] as AppRole[]).includes(role);
}
