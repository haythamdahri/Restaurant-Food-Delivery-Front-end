export class Country {
  public name: string;
  public topLevelDomain: Array<String>;
  public alpha2Code: string;
  public alpha3Code: string;
  public callingCodes: Array<String>;
  public capital: string;
  public altSpellings: Array<String>;
  public region: string;
  public subregion: string;
  public population: number;
  public latlng: Array<String>;
  public demonym: string;
  public area: number;
  public gini: number;
  public timezones: Array<String>;
  public borders: Array<String>;
  public nativeName: string;
  public numericCode: string;
  public currencies: [
    {
      code: string;
      name: string;
      symbol: string;
    }
  ];
  public languages: [
    {
      iso639_1: string;
      iso639_2: string;
      name: string;
      nativeName: string;
    }
  ];
  public translations: {
    de: string;
    es: string;
    fr: string;
    ja: string;
    it: string;
    br: string;
    pt: string;
    nl: string;
    hr: string;
    fa: string;
  };
  public flag: string;
  public regionalBlocs: [
    {
      acronym: string;
      name: string;
      otherAcronyms: [];
      otherNames: [];
    }
  ];
  public cioc: string;
}
