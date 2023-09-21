import { Lucid } from 'lucid-cardano';
import * as fs from 'fs';

const main = async () => {
    const lucid = await Lucid.new(undefined, 'Preprod');

    const privateKey = lucid.utils.generatePrivateKey();
    fs.writeFileSync('beneficiary.sk', privateKey);

    const address = await lucid
        .selectWalletFromPrivateKey(privateKey)
        .wallet.address();
    fs.writeFileSync('beneficiary.addr', address);
};
export default main;

// main();
