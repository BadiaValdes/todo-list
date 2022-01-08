const bycrypt = require('bcrypt');
export class Encrypt {
  static async encrypt(dataToEncrypt: string): Promise<string> {
    const salt = await bycrypt.genSalt();
    return await bycrypt.hash(dataToEncrypt, salt);
  }

  static async compareEncrypt(
    dataWIthoutEncrypt: string,
    dataEncrypted: string,
  ): Promise<boolean> {
    return await bycrypt.compare(dataWIthoutEncrypt, dataEncrypted);
  }

  static async compareAndEncrypt(
    dataWIthoutEncrypt: string,
    dataEncrypted: string,
  ): Promise<string | null> {
    if (await this.compareEncrypt(dataWIthoutEncrypt, dataEncrypted)) {
      return dataEncrypted;
    } else {
      return this.encrypt(dataWIthoutEncrypt);
    }
  }
}

export function Slugify(stringToSlug: string, value: string = "_") {
  return replaceAllSlug(stringToSlug, ' ', value);
}

export function replaceAllSlug(
  initialValue: string,
  valueToReplace: string = " ",
  value: string = "_",
) {
  let replace = '';
  for (
    let index = 0;
    index < initialValue.split(valueToReplace).length;
    index++
  ) {
    if (index == initialValue.split(valueToReplace).length - 1) {
      replace += initialValue.split(valueToReplace)[index];
    } else {
      replace += `${initialValue.split(valueToReplace)[index]}${value}`;
    }
  }
  return replace.toLowerCase();
}

export function replaceAll(
  initialValue: string,
  valueToReplace: string,
  value: string,
) {
  let replace = '';
  for (let index = 0; index < initialValue.length; index++) {
    if (
      initialValue.charAt(index).toLowerCase() === valueToReplace.toLowerCase()
    ) {
      replace += value;
    } else {
      replace += initialValue.charAt(index);
    }
  }
  return replace;
}
