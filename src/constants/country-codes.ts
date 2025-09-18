// ISO 3166-1 alpha-2 country codes (official list)
// Used with Intl.DisplayNames to render localized country names.
export const COUNTRY_CODES = [
  'AF','AX','AL','DZ','AS','AD','AO','AI','AQ','AG','AR','AM','AW','AU','AT','AZ',
  'BS','BH','BD','BB','BY','BE','BZ','BJ','BM','BT','BO','BQ','BA','BW','BV','BR',
  'IO','BN','BG','BF','BI','CV','KH','CM','CA','KY','CF','TD','CL','CN','CX','CC',
  'CO','KM','CG','CD','CK','CR','CI','HR','CU','CW','CY','CZ','DK','DJ','DM','DO',
  'EC','EG','SV','GQ','ER','EE','SZ','ET','FK','FO','FJ','FI','FR','GF','PF','TF',
  'GA','GM','GE','DE','GH','GI','GR','GL','GD','GP','GU','GT','GG','GN','GW','GY',
  'HT','HM','VA','HN','HK','HU','IS','IN','ID','IR','IQ','IE','IM','IL','IT','JM',
  'JP','JE','JO','KZ','KE','KI','KP','KR','KW','KG','LA','LV','LB','LS','LR','LY',
  'LI','LT','LU','MO','MG','MW','MY','MV','ML','MT','MH','MQ','MR','MU','YT','MX',
  'FM','MD','MC','MN','ME','MS','MA','MZ','MM','NA','NR','NP','NL','NC','NZ','NI',
  'NE','NG','NU','NF','MK','MP','NO','OM','PK','PW','PS','PA','PG','PY','PE','PH',
  'PN','PL','PT','PR','QA','RE','RO','RU','RW','BL','SH','KN','LC','MF','PM','VC',
  'WS','SM','ST','SA','SN','RS','SC','SL','SG','SX','SK','SI','SB','SO','ZA','GS',
  'SS','ES','LK','SD','SR','SJ','SE','CH','SY','TW','TJ','TZ','TH','TL','TG','TK',
  'TO','TT','TN','TR','TM','TC','TV','UG','UA','AE','GB','US','UM','UY','UZ','VU',
  'VE','VN','VG','VI','WF','EH','YE','ZM','ZW'
];

export type CountryOption = {
  code: string; // alpha-2, lowercase preferred for values
  name: string; // localized display name
};

export function getLocalizedCountries(locale: string = 'fr'): CountryOption[] {
  // Fallback if Intl.DisplayNames is not supported
  // In modern browsers/Node this should exist.
  // We still guard to avoid runtime errors.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const DisplayNames: any = (Intl as any).DisplayNames;
  if (!DisplayNames) {
    return COUNTRY_CODES.map((c) => ({ code: c.toLowerCase(), name: c }));
  }
  const regionNames = new DisplayNames([locale], { type: 'region' });
  const options = COUNTRY_CODES.map((code) => {
    const name = regionNames.of(code) || code;
    return { code: code.toLowerCase(), name };
  });
  // Sort by localized name
  options.sort((a, b) => a.name.localeCompare(b.name, locale));
  return options;
}

