export namespace AES {
    function decrypt(ciphertext: any, key: any, cfg: any): any;
    function encrypt(message: any, key: any, cfg: any): any;
}
export namespace DES {
    function decrypt(ciphertext: any, key: any, cfg: any): any;
    function encrypt(message: any, key: any, cfg: any): any;
}
export function EvpKDF(password: any, salt: any, cfg: any): any;
export function HmacMD5(message: any, key: any): any;
export function HmacRIPEMD160(message: any, key: any): any;
export function HmacSHA1(message: any, key: any): any;
export function HmacSHA224(message: any, key: any): any;
export function HmacSHA256(message: any, key: any): any;
export function HmacSHA3(message: any, key: any): any;
export function HmacSHA384(message: any, key: any): any;
export function HmacSHA512(message: any, key: any): any;
export function MD5(message: any, cfg: any): any;
export function PBKDF2(password: any, salt: any, cfg: any): any;
export namespace RC4 {
    function decrypt(ciphertext: any, key: any, cfg: any): any;
    function encrypt(message: any, key: any, cfg: any): any;
}
export namespace RC4Drop {
    function decrypt(ciphertext: any, key: any, cfg: any): any;
    function encrypt(message: any, key: any, cfg: any): any;
}
export function RIPEMD160(message: any, cfg: any): any;
export namespace Rabbit {
    function decrypt(ciphertext: any, key: any, cfg: any): any;
    function encrypt(message: any, key: any, cfg: any): any;
}
export namespace RabbitLegacy {
    function decrypt(ciphertext: any, key: any, cfg: any): any;
    function encrypt(message: any, key: any, cfg: any): any;
}
export function SHA1(message: any, cfg: any): any;
export function SHA224(message: any, cfg: any): any;
export function SHA256(message: any, cfg: any): any;
export function SHA3(message: any, cfg: any): any;
export function SHA384(message: any, cfg: any): any;
export function SHA512(message: any, cfg: any): any;
export namespace TripleDES {
    function decrypt(ciphertext: any, key: any, cfg: any): any;
    function encrypt(message: any, key: any, cfg: any): any;
}
export const algo: {
    AES: {
        $super: {
            $super: {
                $super: any;
                cfg: any;
                clone: any;
                create: any;
                createDecryptor: any;
                createEncryptor: any;
                extend: any;
                finalize: any;
                init: any;
                ivSize: any;
                keySize: any;
                mixIn: any;
                process: any;
                reset: any;
            };
            blockSize: number;
            cfg: {
                $super: any;
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
                mode: any;
                padding: any;
            };
            clone: Function;
            create: Function;
            createDecryptor: Function;
            createEncryptor: Function;
            extend: Function;
            finalize: Function;
            init: Function;
            ivSize: number;
            keySize: number;
            mixIn: Function;
            process: Function;
            reset: Function;
        };
        blockSize: number;
        cfg: {
            $super: {
                $super: any;
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
            mode: {
                $super: any;
                Decryptor: any;
                Encryptor: any;
                clone: any;
                create: any;
                createDecryptor: any;
                createEncryptor: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            padding: {
                pad: any;
                unpad: any;
            };
        };
        clone: Function;
        create: Function;
        createDecryptor: Function;
        createEncryptor: Function;
        decryptBlock: Function;
        encryptBlock: Function;
        extend: Function;
        finalize: Function;
        init: Function;
        ivSize: number;
        keySize: number;
        mixIn: Function;
        process: Function;
        reset: Function;
    };
    DES: {
        $super: {
            $super: {
                $super: any;
                cfg: any;
                clone: any;
                create: any;
                createDecryptor: any;
                createEncryptor: any;
                extend: any;
                finalize: any;
                init: any;
                ivSize: any;
                keySize: any;
                mixIn: any;
                process: any;
                reset: any;
            };
            blockSize: number;
            cfg: {
                $super: any;
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
                mode: any;
                padding: any;
            };
            clone: Function;
            create: Function;
            createDecryptor: Function;
            createEncryptor: Function;
            extend: Function;
            finalize: Function;
            init: Function;
            ivSize: number;
            keySize: number;
            mixIn: Function;
            process: Function;
            reset: Function;
        };
        blockSize: number;
        cfg: {
            $super: {
                $super: any;
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
            mode: {
                $super: any;
                Decryptor: any;
                Encryptor: any;
                clone: any;
                create: any;
                createDecryptor: any;
                createEncryptor: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            padding: {
                pad: any;
                unpad: any;
            };
        };
        clone: Function;
        create: Function;
        createDecryptor: Function;
        createEncryptor: Function;
        decryptBlock: Function;
        encryptBlock: Function;
        extend: Function;
        finalize: Function;
        init: Function;
        ivSize: number;
        keySize: number;
        mixIn: Function;
        process: Function;
        reset: Function;
    };
    EvpKDF: {
        $super: {
            clone: Function;
            create: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
        };
        cfg: {
            $super: {
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            extend: Function;
            hasher: {
                $super: any;
                blockSize: any;
                cfg: any;
                clone: any;
                create: any;
                extend: any;
                finalize: any;
                init: any;
                mixIn: any;
                reset: any;
                update: any;
            };
            init: Function;
            iterations: number;
            keySize: number;
            mixIn: Function;
        };
        clone: Function;
        compute: Function;
        create: Function;
        extend: Function;
        init: Function;
        mixIn: Function;
    };
    HMAC: {
        $super: {
            clone: Function;
            create: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
        };
        clone: Function;
        create: Function;
        extend: Function;
        finalize: Function;
        init: Function;
        mixIn: Function;
        reset: Function;
        update: Function;
    };
    MD5: {
        $super: {
            $super: {
                $super: any;
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
                reset: any;
            };
            blockSize: number;
            cfg: {
                $super: any;
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            extend: Function;
            finalize: Function;
            init: Function;
            mixIn: Function;
            reset: Function;
            update: Function;
        };
        blockSize: number;
        cfg: {
            $super: {
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
        };
        clone: Function;
        create: Function;
        extend: Function;
        finalize: Function;
        init: Function;
        mixIn: Function;
        reset: Function;
        update: Function;
    };
    PBKDF2: {
        $super: {
            clone: Function;
            create: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
        };
        cfg: {
            $super: {
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            extend: Function;
            hasher: {
                $super: any;
                blockSize: any;
                cfg: any;
                clone: any;
                create: any;
                extend: any;
                finalize: any;
                init: any;
                mixIn: any;
                reset: any;
                update: any;
            };
            init: Function;
            iterations: number;
            keySize: number;
            mixIn: Function;
        };
        clone: Function;
        compute: Function;
        create: Function;
        extend: Function;
        init: Function;
        mixIn: Function;
    };
    RC4: {
        $super: {
            $super: {
                $super: any;
                cfg: any;
                clone: any;
                create: any;
                createDecryptor: any;
                createEncryptor: any;
                extend: any;
                finalize: any;
                init: any;
                ivSize: any;
                keySize: any;
                mixIn: any;
                process: any;
                reset: any;
            };
            blockSize: number;
            cfg: {
                $super: any;
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            createDecryptor: Function;
            createEncryptor: Function;
            extend: Function;
            finalize: Function;
            init: Function;
            ivSize: number;
            keySize: number;
            mixIn: Function;
            process: Function;
            reset: Function;
        };
        blockSize: number;
        cfg: {
            $super: {
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
        };
        clone: Function;
        create: Function;
        createDecryptor: Function;
        createEncryptor: Function;
        extend: Function;
        finalize: Function;
        init: Function;
        ivSize: number;
        keySize: number;
        mixIn: Function;
        process: Function;
        reset: Function;
    };
    RC4Drop: {
        $super: {
            $super: {
                $super: any;
                blockSize: any;
                cfg: any;
                clone: any;
                create: any;
                createDecryptor: any;
                createEncryptor: any;
                extend: any;
                finalize: any;
                init: any;
                ivSize: any;
                keySize: any;
                mixIn: any;
                process: any;
                reset: any;
            };
            blockSize: number;
            cfg: {
                $super: any;
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            createDecryptor: Function;
            createEncryptor: Function;
            extend: Function;
            finalize: Function;
            init: Function;
            ivSize: number;
            keySize: number;
            mixIn: Function;
            process: Function;
            reset: Function;
        };
        blockSize: number;
        cfg: {
            $super: {
                $super: any;
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            drop: number;
            extend: Function;
            init: Function;
            mixIn: Function;
        };
        clone: Function;
        create: Function;
        createDecryptor: Function;
        createEncryptor: Function;
        extend: Function;
        finalize: Function;
        init: Function;
        ivSize: number;
        keySize: number;
        mixIn: Function;
        process: Function;
        reset: Function;
    };
    RIPEMD160: {
        $super: {
            $super: {
                $super: any;
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
                reset: any;
            };
            blockSize: number;
            cfg: {
                $super: any;
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            extend: Function;
            finalize: Function;
            init: Function;
            mixIn: Function;
            reset: Function;
            update: Function;
        };
        blockSize: number;
        cfg: {
            $super: {
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
        };
        clone: Function;
        create: Function;
        extend: Function;
        finalize: Function;
        init: Function;
        mixIn: Function;
        reset: Function;
        update: Function;
    };
    Rabbit: {
        $super: {
            $super: {
                $super: any;
                cfg: any;
                clone: any;
                create: any;
                createDecryptor: any;
                createEncryptor: any;
                extend: any;
                finalize: any;
                init: any;
                ivSize: any;
                keySize: any;
                mixIn: any;
                process: any;
                reset: any;
            };
            blockSize: number;
            cfg: {
                $super: any;
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            createDecryptor: Function;
            createEncryptor: Function;
            extend: Function;
            finalize: Function;
            init: Function;
            ivSize: number;
            keySize: number;
            mixIn: Function;
            process: Function;
            reset: Function;
        };
        blockSize: number;
        cfg: {
            $super: {
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
        };
        clone: Function;
        create: Function;
        createDecryptor: Function;
        createEncryptor: Function;
        extend: Function;
        finalize: Function;
        init: Function;
        ivSize: number;
        keySize: number;
        mixIn: Function;
        process: Function;
        reset: Function;
    };
    RabbitLegacy: {
        $super: {
            $super: {
                $super: any;
                cfg: any;
                clone: any;
                create: any;
                createDecryptor: any;
                createEncryptor: any;
                extend: any;
                finalize: any;
                init: any;
                ivSize: any;
                keySize: any;
                mixIn: any;
                process: any;
                reset: any;
            };
            blockSize: number;
            cfg: {
                $super: any;
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            createDecryptor: Function;
            createEncryptor: Function;
            extend: Function;
            finalize: Function;
            init: Function;
            ivSize: number;
            keySize: number;
            mixIn: Function;
            process: Function;
            reset: Function;
        };
        blockSize: number;
        cfg: {
            $super: {
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
        };
        clone: Function;
        create: Function;
        createDecryptor: Function;
        createEncryptor: Function;
        extend: Function;
        finalize: Function;
        init: Function;
        ivSize: number;
        keySize: number;
        mixIn: Function;
        process: Function;
        reset: Function;
    };
    SHA1: {
        $super: {
            $super: {
                $super: any;
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
                reset: any;
            };
            blockSize: number;
            cfg: {
                $super: any;
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            extend: Function;
            finalize: Function;
            init: Function;
            mixIn: Function;
            reset: Function;
            update: Function;
        };
        blockSize: number;
        cfg: {
            $super: {
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
        };
        clone: Function;
        create: Function;
        extend: Function;
        finalize: Function;
        init: Function;
        mixIn: Function;
        reset: Function;
        update: Function;
    };
    SHA224: {
        $super: {
            $super: {
                $super: any;
                blockSize: any;
                cfg: any;
                clone: any;
                create: any;
                extend: any;
                finalize: any;
                init: any;
                mixIn: any;
                reset: any;
                update: any;
            };
            blockSize: number;
            cfg: {
                $super: any;
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            extend: Function;
            finalize: Function;
            init: Function;
            mixIn: Function;
            reset: Function;
            update: Function;
        };
        blockSize: number;
        cfg: {
            $super: {
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
        };
        clone: Function;
        create: Function;
        extend: Function;
        finalize: Function;
        init: Function;
        mixIn: Function;
        reset: Function;
        update: Function;
    };
    SHA256: {
        $super: {
            $super: {
                $super: any;
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
                reset: any;
            };
            blockSize: number;
            cfg: {
                $super: any;
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            extend: Function;
            finalize: Function;
            init: Function;
            mixIn: Function;
            reset: Function;
            update: Function;
        };
        blockSize: number;
        cfg: {
            $super: {
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
        };
        clone: Function;
        create: Function;
        extend: Function;
        finalize: Function;
        init: Function;
        mixIn: Function;
        reset: Function;
        update: Function;
    };
    SHA3: {
        $super: {
            $super: {
                $super: any;
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
                reset: any;
            };
            blockSize: number;
            cfg: {
                $super: any;
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            extend: Function;
            finalize: Function;
            init: Function;
            mixIn: Function;
            reset: Function;
            update: Function;
        };
        blockSize: number;
        cfg: {
            $super: {
                $super: any;
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
            outputLength: number;
        };
        clone: Function;
        create: Function;
        extend: Function;
        finalize: Function;
        init: Function;
        mixIn: Function;
        reset: Function;
        update: Function;
    };
    SHA384: {
        $super: {
            $super: {
                $super: any;
                blockSize: any;
                cfg: any;
                clone: any;
                create: any;
                extend: any;
                finalize: any;
                init: any;
                mixIn: any;
                reset: any;
                update: any;
            };
            blockSize: number;
            cfg: {
                $super: any;
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            extend: Function;
            finalize: Function;
            init: Function;
            mixIn: Function;
            reset: Function;
            update: Function;
        };
        blockSize: number;
        cfg: {
            $super: {
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
        };
        clone: Function;
        create: Function;
        extend: Function;
        finalize: Function;
        init: Function;
        mixIn: Function;
        reset: Function;
        update: Function;
    };
    SHA512: {
        $super: {
            $super: {
                $super: any;
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
                reset: any;
            };
            blockSize: number;
            cfg: {
                $super: any;
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            extend: Function;
            finalize: Function;
            init: Function;
            mixIn: Function;
            reset: Function;
            update: Function;
        };
        blockSize: number;
        cfg: {
            $super: {
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
        };
        clone: Function;
        create: Function;
        extend: Function;
        finalize: Function;
        init: Function;
        mixIn: Function;
        reset: Function;
        update: Function;
    };
    TripleDES: {
        $super: {
            $super: {
                $super: any;
                cfg: any;
                clone: any;
                create: any;
                createDecryptor: any;
                createEncryptor: any;
                extend: any;
                finalize: any;
                init: any;
                ivSize: any;
                keySize: any;
                mixIn: any;
                process: any;
                reset: any;
            };
            blockSize: number;
            cfg: {
                $super: any;
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
                mode: any;
                padding: any;
            };
            clone: Function;
            create: Function;
            createDecryptor: Function;
            createEncryptor: Function;
            extend: Function;
            finalize: Function;
            init: Function;
            ivSize: number;
            keySize: number;
            mixIn: Function;
            process: Function;
            reset: Function;
        };
        blockSize: number;
        cfg: {
            $super: {
                $super: any;
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
            mode: {
                $super: any;
                Decryptor: any;
                Encryptor: any;
                clone: any;
                create: any;
                createDecryptor: any;
                createEncryptor: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            padding: {
                pad: any;
                unpad: any;
            };
        };
        clone: Function;
        create: Function;
        createDecryptor: Function;
        createEncryptor: Function;
        decryptBlock: Function;
        encryptBlock: Function;
        extend: Function;
        finalize: Function;
        init: Function;
        ivSize: number;
        keySize: number;
        mixIn: Function;
        process: Function;
        reset: Function;
    };
};
export const enc: {
    Base64: {
        parse: Function;
        stringify: Function;
    };
    Hex: {
        parse: Function;
        stringify: Function;
    };
    Latin1: {
        parse: Function;
        stringify: Function;
    };
    Utf16: {
        parse: Function;
        stringify: Function;
    };
    Utf16BE: {
        parse: Function;
        stringify: Function;
    };
    Utf16LE: {
        parse: Function;
        stringify: Function;
    };
    Utf8: {
        parse: Function;
        stringify: Function;
    };
};
export const format: {
    Hex: {
        parse: Function;
        stringify: Function;
    };
    OpenSSL: {
        parse: Function;
        stringify: Function;
    };
};
export const kdf: {
    OpenSSL: {
        execute: Function;
    };
};
export const lib: {
    Base: {
        clone: Function;
        create: Function;
        extend: Function;
        init: Function;
        mixIn: Function;
    };
    BlockCipher: {
        $super: {
            $super: {
                $super: any;
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
                reset: any;
            };
            cfg: {
                $super: any;
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            createDecryptor: Function;
            createEncryptor: Function;
            extend: Function;
            finalize: Function;
            init: Function;
            ivSize: number;
            keySize: number;
            mixIn: Function;
            process: Function;
            reset: Function;
        };
        blockSize: number;
        cfg: {
            $super: {
                $super: any;
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
            mode: {
                $super: any;
                Decryptor: any;
                Encryptor: any;
                clone: any;
                create: any;
                createDecryptor: any;
                createEncryptor: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            padding: {
                pad: any;
                unpad: any;
            };
        };
        clone: Function;
        create: Function;
        createDecryptor: Function;
        createEncryptor: Function;
        extend: Function;
        finalize: Function;
        init: Function;
        ivSize: number;
        keySize: number;
        mixIn: Function;
        process: Function;
        reset: Function;
    };
    BlockCipherMode: {
        $super: {
            clone: Function;
            create: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
        };
        clone: Function;
        create: Function;
        createDecryptor: Function;
        createEncryptor: Function;
        extend: Function;
        init: Function;
        mixIn: Function;
    };
    BufferedBlockAlgorithm: {
        $super: {
            clone: Function;
            create: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
        };
        clone: Function;
        create: Function;
        extend: Function;
        init: Function;
        mixIn: Function;
        reset: Function;
    };
    Cipher: {
        $super: {
            $super: {
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
            reset: Function;
        };
        cfg: {
            $super: {
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
        };
        clone: Function;
        create: Function;
        createDecryptor: Function;
        createEncryptor: Function;
        extend: Function;
        finalize: Function;
        init: Function;
        ivSize: number;
        keySize: number;
        mixIn: Function;
        process: Function;
        reset: Function;
    };
    CipherParams: {
        $super: {
            clone: Function;
            create: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
        };
        clone: Function;
        create: Function;
        extend: Function;
        init: Function;
        mixIn: Function;
        toString: Function;
    };
    Hasher: {
        $super: {
            $super: {
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
            reset: Function;
        };
        blockSize: number;
        cfg: {
            $super: {
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
        };
        clone: Function;
        create: Function;
        extend: Function;
        finalize: Function;
        init: Function;
        mixIn: Function;
        reset: Function;
        update: Function;
    };
    PasswordBasedCipher: {
        $super: {
            $super: {
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            cfg: {
                $super: any;
                clone: any;
                create: any;
                extend: any;
                format: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            decrypt: Function;
            encrypt: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
        };
        cfg: {
            $super: {
                $super: any;
                clone: any;
                create: any;
                extend: any;
                format: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            extend: Function;
            format: {
                parse: any;
                stringify: any;
            };
            init: Function;
            kdf: {
                execute: any;
            };
            mixIn: Function;
        };
        clone: Function;
        create: Function;
        decrypt: Function;
        encrypt: Function;
        extend: Function;
        init: Function;
        mixIn: Function;
    };
    SerializableCipher: {
        $super: {
            clone: Function;
            create: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
        };
        cfg: {
            $super: {
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            extend: Function;
            format: {
                parse: any;
                stringify: any;
            };
            init: Function;
            mixIn: Function;
        };
        clone: Function;
        create: Function;
        decrypt: Function;
        encrypt: Function;
        extend: Function;
        init: Function;
        mixIn: Function;
    };
    StreamCipher: {
        $super: {
            $super: {
                $super: any;
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
                reset: any;
            };
            cfg: {
                $super: any;
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            createDecryptor: Function;
            createEncryptor: Function;
            extend: Function;
            finalize: Function;
            init: Function;
            ivSize: number;
            keySize: number;
            mixIn: Function;
            process: Function;
            reset: Function;
        };
        blockSize: number;
        cfg: {
            $super: {
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
        };
        clone: Function;
        create: Function;
        createDecryptor: Function;
        createEncryptor: Function;
        extend: Function;
        finalize: Function;
        init: Function;
        ivSize: number;
        keySize: number;
        mixIn: Function;
        process: Function;
        reset: Function;
    };
    WordArray: {
        $super: {
            clone: Function;
            create: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
        };
        clamp: Function;
        clone: Function;
        concat: Function;
        create: Function;
        extend: Function;
        init: Function;
        mixIn: Function;
        random: Function;
        toString: Function;
    };
};
export const mode: {
    CBC: {
        $super: {
            $super: {
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            createDecryptor: Function;
            createEncryptor: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
        };
        Decryptor: {
            $super: any;
            Decryptor: any;
            Encryptor: {
                $super: any;
                Decryptor: any;
                Encryptor: any;
                clone: any;
                create: any;
                createDecryptor: any;
                createEncryptor: any;
                extend: any;
                init: any;
                mixIn: any;
                processBlock: any;
            };
            clone: Function;
            create: Function;
            createDecryptor: Function;
            createEncryptor: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
            processBlock: Function;
        };
        Encryptor: {
            $super: any;
            Decryptor: {
                $super: any;
                Decryptor: any;
                Encryptor: any;
                clone: any;
                create: any;
                createDecryptor: any;
                createEncryptor: any;
                extend: any;
                init: any;
                mixIn: any;
                processBlock: any;
            };
            Encryptor: any;
            clone: Function;
            create: Function;
            createDecryptor: Function;
            createEncryptor: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
            processBlock: Function;
        };
        clone: Function;
        create: Function;
        createDecryptor: Function;
        createEncryptor: Function;
        extend: Function;
        init: Function;
        mixIn: Function;
    };
    CFB: {
        $super: {
            $super: {
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            createDecryptor: Function;
            createEncryptor: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
        };
        Decryptor: {
            $super: any;
            Decryptor: any;
            Encryptor: {
                $super: any;
                Decryptor: any;
                Encryptor: any;
                clone: any;
                create: any;
                createDecryptor: any;
                createEncryptor: any;
                extend: any;
                init: any;
                mixIn: any;
                processBlock: any;
            };
            clone: Function;
            create: Function;
            createDecryptor: Function;
            createEncryptor: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
            processBlock: Function;
        };
        Encryptor: {
            $super: any;
            Decryptor: {
                $super: any;
                Decryptor: any;
                Encryptor: any;
                clone: any;
                create: any;
                createDecryptor: any;
                createEncryptor: any;
                extend: any;
                init: any;
                mixIn: any;
                processBlock: any;
            };
            Encryptor: any;
            clone: Function;
            create: Function;
            createDecryptor: Function;
            createEncryptor: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
            processBlock: Function;
        };
        clone: Function;
        create: Function;
        createDecryptor: Function;
        createEncryptor: Function;
        extend: Function;
        init: Function;
        mixIn: Function;
    };
    CTR: {
        $super: {
            $super: {
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            createDecryptor: Function;
            createEncryptor: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
        };
        Decryptor: {
            $super: any;
            Decryptor: any;
            Encryptor: any;
            clone: Function;
            create: Function;
            createDecryptor: Function;
            createEncryptor: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
            processBlock: Function;
        };
        Encryptor: {
            $super: any;
            Decryptor: any;
            Encryptor: any;
            clone: Function;
            create: Function;
            createDecryptor: Function;
            createEncryptor: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
            processBlock: Function;
        };
        clone: Function;
        create: Function;
        createDecryptor: Function;
        createEncryptor: Function;
        extend: Function;
        init: Function;
        mixIn: Function;
    };
    CTRGladman: {
        $super: {
            $super: {
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            createDecryptor: Function;
            createEncryptor: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
        };
        Decryptor: {
            $super: any;
            Decryptor: any;
            Encryptor: any;
            clone: Function;
            create: Function;
            createDecryptor: Function;
            createEncryptor: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
            processBlock: Function;
        };
        Encryptor: {
            $super: any;
            Decryptor: any;
            Encryptor: any;
            clone: Function;
            create: Function;
            createDecryptor: Function;
            createEncryptor: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
            processBlock: Function;
        };
        clone: Function;
        create: Function;
        createDecryptor: Function;
        createEncryptor: Function;
        extend: Function;
        init: Function;
        mixIn: Function;
    };
    ECB: {
        $super: {
            $super: {
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            createDecryptor: Function;
            createEncryptor: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
        };
        Decryptor: {
            $super: any;
            Decryptor: any;
            Encryptor: {
                $super: any;
                Decryptor: any;
                Encryptor: any;
                clone: any;
                create: any;
                createDecryptor: any;
                createEncryptor: any;
                extend: any;
                init: any;
                mixIn: any;
                processBlock: any;
            };
            clone: Function;
            create: Function;
            createDecryptor: Function;
            createEncryptor: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
            processBlock: Function;
        };
        Encryptor: {
            $super: any;
            Decryptor: {
                $super: any;
                Decryptor: any;
                Encryptor: any;
                clone: any;
                create: any;
                createDecryptor: any;
                createEncryptor: any;
                extend: any;
                init: any;
                mixIn: any;
                processBlock: any;
            };
            Encryptor: any;
            clone: Function;
            create: Function;
            createDecryptor: Function;
            createEncryptor: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
            processBlock: Function;
        };
        clone: Function;
        create: Function;
        createDecryptor: Function;
        createEncryptor: Function;
        extend: Function;
        init: Function;
        mixIn: Function;
    };
    OFB: {
        $super: {
            $super: {
                clone: any;
                create: any;
                extend: any;
                init: any;
                mixIn: any;
            };
            clone: Function;
            create: Function;
            createDecryptor: Function;
            createEncryptor: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
        };
        Decryptor: {
            $super: any;
            Decryptor: any;
            Encryptor: any;
            clone: Function;
            create: Function;
            createDecryptor: Function;
            createEncryptor: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
            processBlock: Function;
        };
        Encryptor: {
            $super: any;
            Decryptor: any;
            Encryptor: any;
            clone: Function;
            create: Function;
            createDecryptor: Function;
            createEncryptor: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
            processBlock: Function;
        };
        clone: Function;
        create: Function;
        createDecryptor: Function;
        createEncryptor: Function;
        extend: Function;
        init: Function;
        mixIn: Function;
    };
};
export const pad: {
    AnsiX923: {
        pad: Function;
        unpad: Function;
    };
    Iso10126: {
        pad: Function;
        unpad: Function;
    };
    Iso97971: {
        pad: Function;
        unpad: Function;
    };
    NoPadding: {
        pad: Function;
        unpad: Function;
    };
    Pkcs7: {
        pad: Function;
        unpad: Function;
    };
    ZeroPadding: {
        pad: Function;
        unpad: Function;
    };
};
export const x64: {
    Word: {
        $super: {
            clone: Function;
            create: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
        };
        clone: Function;
        create: Function;
        extend: Function;
        init: Function;
        mixIn: Function;
    };
    WordArray: {
        $super: {
            clone: Function;
            create: Function;
            extend: Function;
            init: Function;
            mixIn: Function;
        };
        clone: Function;
        create: Function;
        extend: Function;
        init: Function;
        mixIn: Function;
        toX32: Function;
    };
};
