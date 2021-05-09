export type Language = string;

export enum Languages {
  ENG = 'ENG',
}

export type Translations = {
  [K in Languages]: string
};

export type Dictionary = {
  [key: string]: Translations
}
