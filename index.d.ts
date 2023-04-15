declare module 'amber' {
  declare type Test = {
    get: (name: string) => any,
    set: (name: string, value: any) => any,
    has: (name: string) => boolean,
    delete: (name: string) => any,
    keys: () => Array<string>,
    values: () => Array<any>,
    getProperties: () => Array<string>,
    getProperty: (name: string) => any,
    setProperty: (name: string, value: any) => any,
    getPropertyNames: () => Array<string>,
  }
}
