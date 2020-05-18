import crypto from 'crypto'

type KHash = {
    a: Buffer,
    b: Buffer,
    c: Buffer
}

const Encoder = new class Encoder {
    public format: {
        MongoBinaries: (data: KHash) => KHash;
    }

    public isEqual: {
        boolean: (data: boolean, enc: KHash) => boolean;
        string: (data: string, enc: KHash) => boolean;
        number: (data: number, enc: KHash) => boolean;
        object: (data: object, enc: KHash) => boolean;
    }

    public encrypt: {
        boolean: (data: boolean) => KHash;
        string: (data: string) => KHash;
        number: (data: number) => KHash;
        object: (data: object) => KHash;
    };

    public decrypt: {
        boolean: (data: KHash) => boolean;
        string: (data: KHash) => string;
        number: (data: KHash) => number;
        object: (data: KHash) => object;
    }

    constructor() {
        const Encoder = this;

        this.format = {
            MongoBinaries: (data: KHash): KHash => {
                return {
                    a: Buffer.from(data.a.buffer),
                    b: Buffer.from(data.b.buffer),
                    c: Buffer.from(data.c.buffer)
                }
            }
        }

        this.isEqual = {
            boolean(data: boolean, enc: KHash): boolean {
                return data === Encoder.decrypt.boolean(enc);
            },
            string(data: string, enc: KHash): boolean {
                return data === Encoder.decrypt.string(enc);
            },
            number(data: number, enc: KHash): boolean {
                return data === Encoder.decrypt.number(enc);
            },
            object(data: object, enc: KHash): boolean {
                return data === Encoder.decrypt.object(enc);
            }
        }

        this.encrypt = {
            boolean(data: boolean): KHash {
                const b = crypto.randomBytes(32);
                const c = crypto.randomBytes(16);

                let mod : number = data ? 1 : 0;
            
                let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(b), c);
            
                let update = cipher.update(mod.toString());
            
                let a = Buffer.concat([ update, cipher.final() ]);
            
                return {
                    a: a,
                    b: b,
                    c: c
                }
            },
            string(data: string): KHash {
                const b = crypto.randomBytes(32);
                const c = crypto.randomBytes(16);
            
                let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(b), c);
            
                let update = cipher.update(data);
            
                let a = Buffer.concat([ update, cipher.final() ]);
            
                return {
                    a: a,
                    b: b,
                    c: c
                }
            },
            number(data: number): KHash {
                const b = crypto.randomBytes(32);
                const c = crypto.randomBytes(16);
            
                let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(b), c);
            
                let update = cipher.update(data.toString());
            
                let a = Buffer.concat([ update, cipher.final() ]);
            
                return {
                    a: a,
                    b: b,
                    c: c
                }
            },
            object(data: object): KHash {
                return Encoder.encrypt.string(JSON.stringify(data));
            }
        }

        this.decrypt = {
            boolean(target: KHash): boolean {
                let iv = Buffer.from(target.c);
            
                let a = Buffer.from(target.a);
            
                let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(target.b), iv);
            
                let z = decipher.update(a);
            
                let dec = Buffer.concat([z, decipher.final()]);

                return Number(dec.toString()) ? true : false;
            },
            string(target: KHash): string {
                let iv = Buffer.from(target.c);
            
                let a = Buffer.from(target.a);
            
                let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(target.b), iv);
            
                let z = decipher.update(a);
            
                let dec = Buffer.concat([z, decipher.final()]);
            
                return dec.toString();
            },
            number(target: KHash): number {
                let iv = Buffer.from(target.c);
            
                let a = Buffer.from(target.a);
            
                let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(target.b), iv);
            
                let z = decipher.update(a);
            
                let dec = Buffer.concat([z, decipher.final()]);
            
                return Number(dec.toString());
            },
            object(data: KHash): object {
                return JSON.parse(Encoder.decrypt.string(data))
            }
        }
    }
}

export {
    Encoder,
    KHash
}