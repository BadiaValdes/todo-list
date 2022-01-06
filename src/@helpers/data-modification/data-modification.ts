const bycrypt = require('bcrypt')
export class Encrypt{
    static async encrypt(dataToEncrypt: string): Promise<string>{
        const salt = await bycrypt.genSalt();
        return await bycrypt.hash(dataToEncrypt, salt);
    }

    static async compareEncrypt(dataWIthoutEncrypt: string, dataEncrypted: string): Promise<boolean>{
        return await bycrypt.compare(dataWIthoutEncrypt, dataEncrypted)
    }

    static async compareAndEncrypt(dataWIthoutEncrypt: string, dataEncrypted: string): Promise<string | null>{
        if(await this.compareEncrypt(dataWIthoutEncrypt, dataEncrypted)){
            return dataEncrypted;
        }
        else {
            return this.encrypt(dataWIthoutEncrypt);
        }
    }
}
