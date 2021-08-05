/**
 * Helper types that are reused across app.
 *
 * Example:
 * import { TFunction } from '@custom-types';
 * const arg0: TFunction.Arg0<typeof (a: number): number> = 10;
 */

declare module '@custom-types' {
  export namespace TFunction {
    export type Args<T> = T extends (...args: infer U) => any ? U : never;
    export type Arg0<T> = T extends (arg1: infer U) => any ? U : never;
    export type ReplaceReturnType<T, TReturn> = (...args: Args<T>[]) => TReturn;
  }

  export namespace TObject {
    export type TKeys<T> = Array<keyof T>;
    export type TValues<TObject> = TObject extends Record<string, infer TKey>
      ? Array<TKey>
      : never;

    export type Indexable<
      TValues = any,
      T extends Record<string, unknown> = Record<string, unknown>,
    > = {
      [key: string]: TValues;
    } & T;

    export type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<T>;
    export type MakeRequired<T, K extends keyof T> = Omit<T, K> &
      Required<Pick<T, K>>;

    export type MakeNilAll<T extends Record<string, unknown>> = {
      [TKey in keyof T]?: T[TKey] | null;
    };
    export type MakeNil<
      T extends Record<string, unknown>,
      TKeys extends keyof T,
    > = {
      [TKey in TKeys]?: T[TKey] | null;
    };

    export type Diff<TObject> = Record<
      keyof TObject,
      {
        old: TObject;
        new: TObject;
      }
    >;
  }

  export namespace TArray {
    export type TKeys<T> = Array<Exclude<keyof T, keyof Array<any>>>;
    export type TValues<T> = Array<T[number]>;

    export type SingleType<TValue> = TValue extends Array<infer TSingle>
      ? TSingle
      : TValue;

    export type PossibleArray<TValue> = TValue | Array<TValue>;
  }

  export namespace TType {
    export type PartialAdvanced<Type, Fields extends keyof Type> = Partial<
      Pick<Type, Fields>
    > &
      Omit<Type, Fields>;
  }
}
