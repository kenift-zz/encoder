/// <reference types="node" />
declare type KHash = {
    a: Buffer;
    b: Buffer;
    c: Buffer;
};
declare const Encoder: {
    format: {
        MongoBinaries: (data: KHash) => KHash;
    };
    isEqual: {
        string: (data: string, enc: KHash) => boolean;
        number: (data: number, enc: KHash) => boolean;
        object: (data: object, enc: KHash) => boolean;
    };
    encrypt: {
        string: (data: string) => KHash;
        number: (data: number) => KHash;
        object: (data: object) => KHash;
    };
    decrypt: {
        string: (data: KHash) => string;
        number: (data: KHash) => number;
        object: (data: KHash) => object;
    };
};
export { Encoder, KHash };
